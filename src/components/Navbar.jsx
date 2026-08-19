import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#product", label: "Product", id: "product" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#workflow", label: "Workflow", id: "workflow" }
];

function Navbar() {
  const navRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = useCallback((event, href) => {
    event.preventDefault();
    setOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <header
      className={`navbar${isScrolled ? " is-scrolled" : ""}`}
      ref={navRef}
    >
      <div className="container nav-inner">
        <a
          href="#"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-mark">D</span>
          <span>DevFlow</span>
        </a>

        <nav className={`nav-links${open ? " nav-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={activeSection === link.id ? "is-active" : ""}
              onClick={(event) => handleLinkClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="#product" className="login-link" onClick={(event) => handleLinkClick(event, "#product")}>
            Sign in
          </a>
          <a href="#start" className="nav-cta" onClick={(event) => handleLinkClick(event, "#start")}>
            Start building
            <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;