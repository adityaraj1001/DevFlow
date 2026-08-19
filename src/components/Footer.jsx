import React, { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

const NAV_LINKS = [
  { href: "#product", label: "Product", id: "product" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#workflow", label: "Workflow", id: "workflow" }
];

function Footer() {
  const [activeSection, setActiveSection] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      Boolean
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback((event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">
          <span className="brand-mark">D</span>
          <span>DevFlow</span>
        </div>

        <div className="footer-copy">
          <span className="footer-status">
            <span className="footer-status-dot"></span>
            All systems operational
          </span>
          <span className="footer-divider">/</span>
          <span>
            {year} — A concept product for the Acdyon Technologies frontend
            challenge.
          </span>
        </div>

        <nav className="footer-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={activeSection === link.id ? "is-active" : ""}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}

export default Footer;