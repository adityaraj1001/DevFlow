import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  BarChart3,
  GitPullRequest,
  Layers3,
  ShieldCheck,
  Plus
} from "lucide-react";

const features = [
  {
    icon: GitPullRequest,
    title: "One source of truth",
    text: "Connect your engineering workflow and keep projects, changes and deployments visible in one place.",
    detail: "Pull requests, deploys and incidents land in the same timeline, so nobody has to piece a story together across five tabs."
  },
  {
    icon: BarChart3,
    title: "Useful metrics",
    text: "See deployment activity and engineering signals without drowning your team in dashboards.",
    detail: "A handful of numbers that actually change how you plan the week, not a wall of charts nobody opens."
  },
  {
    icon: Layers3,
    title: "Built around your flow",
    text: "Keep the tools you already use while DevFlow gives your team a cleaner operational layer.",
    detail: "Works alongside your existing stack instead of replacing it, so adoption is a setting, not a migration."
  },
  {
    icon: ShieldCheck,
    title: "Focused by default",
    text: "A deliberate interface keeps important information visible and unnecessary complexity out of the way.",
    detail: "Every screen ships with an opinion about what matters most today, and hides the rest until you ask for it."
  }
];

function FeatureCard({ feature, index, isSectionVisible }) {
  const cardRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--spot-x", `${x}%`);
    card.style.setProperty("--spot-y", `${y}%`);
  }, []);

  const toggleExpanded = () => setIsExpanded((open) => !open);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const Icon = feature.icon;

  return (
    <article
      className={`feature-card${isSectionVisible ? " is-visible" : ""}${
        isExpanded ? " is-expanded" : ""
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
      ref={cardRef}
      onMouseMove={handlePointerMove}
    >
      <div className="feature-spotlight"></div>

      <div className="feature-icon">
        <Icon size={20} />
      </div>

      <h3>{feature.title}</h3>
      <p>{feature.text}</p>

      <button
        type="button"
        className="feature-toggle"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
      >
        <Plus size={14} className="feature-toggle-icon" />
        {isExpanded ? "Show less" : "Learn more"}
      </button>

      <div className="feature-detail" aria-hidden={!isExpanded}>
        <p>{feature.detail}</p>
      </div>
    </article>
  );
}

function Features() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="features-section" id="features" ref={sectionRef}>
      <div className="container">
        <div className="section-heading">
          <div className="section-label">Why DevFlow</div>
          <h2>Less context switching.<br />More shipping.</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              feature={feature}
              index={index}
              isSectionVisible={isVisible}
              key={feature.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;