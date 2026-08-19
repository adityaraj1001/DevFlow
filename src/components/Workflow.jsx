import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, GitBranch, Rocket, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Connect",
    text: "Bring your engineering projects into one workspace."
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Understand",
    text: "Get a clear picture of activity, health and progress."
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ship",
    text: "Move from signal to deployment without the extra noise."
  }
];

function Workflow() {
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height + viewportHeight;
      const scrolled = viewportHeight - rect.top;
      const ratio = Math.min(Math.max(scrolled / total, 0), 1);

      setProgress(ratio);
      setActiveStep(Math.min(steps.length - 1, Math.floor(ratio * steps.length)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="workflow-section" id="workflow" ref={sectionRef}>
      <div className="container">
        <div className="section-heading centered">
          <div className="section-label">Simple by design</div>
          <h2>From code to clarity.</h2>
          <p>
            DevFlow stays out of your way while making the important parts of
            your workflow easier to see.
          </p>
        </div>

        <div
          className={`workflow-grid${isVisible ? " is-visible" : ""}`}
          style={{ "--workflow-progress": progress }}
        >
          <div className="workflow-track">
            <div
              className="workflow-track-fill"
              style={{ transform: `scaleX(${progress})` }}
            ></div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                className={`workflow-step${
                  index === activeStep ? " is-active" : ""
                }${index < activeStep ? " is-complete" : ""}`}
                key={step.number}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="workflow-number">{step.number}</div>

                <div className="workflow-icon">
                  <Icon size={22} />
                </div>

                <h3>{step.title}</h3>
                <p>{step.text}</p>

                {index < steps.length - 1 && (
                  <ArrowRight className="workflow-arrow" size={20} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Workflow;