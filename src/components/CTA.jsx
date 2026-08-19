import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";

function CTA() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

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
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleButtonMove = useCallback((event) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;

    setButtonOffset({ x: relX * 0.25, y: relY * 0.4 });
  }, []);

  const resetButtonOffset = useCallback(() => {
    setButtonOffset({ x: 0, y: 0 });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || isSubmitting || isSubmitted) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <section
      className={`cta-section${isVisible ? " is-visible" : ""}`}
      id="start"
      ref={sectionRef}
    >
      <div className="container">
        <div
          className="cta-card"
          ref={cardRef}
          onMouseMove={handlePointerMove}
        >
          <div className="cta-glow"></div>
          <div className="cta-grid"></div>

          <div className="cta-content">
            <div className="cta-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <div className="section-label">Ready when you are</div>
              <h2>Build with less friction.</h2>
              <p>
                Give your engineering workflow a place that feels as good as
                the software you ship.
              </p>
            </div>

            <form className="cta-form" onSubmit={handleSubmit}>
              <div className={`cta-input-wrap${isSubmitted ? " is-done" : ""}`}>
                <input
                  type="email"
                  className="cta-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting || isSubmitted}
                  required
                />
                <button
                  type="submit"
                  className="primary-button"
                  ref={buttonRef}
                  onMouseMove={handleButtonMove}
                  onMouseLeave={resetButtonOffset}
                  disabled={isSubmitting || isSubmitted}
                  style={{
                    transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                  }}
                >
                  {isSubmitted ? (
                    <>
                      You're in
                      <Check size={18} />
                    </>
                  ) : (
                    <>
                      {isSubmitting ? "Starting" : "Start building"}
                      <ArrowRight size={18} className="cta-arrow" />
                    </>
                  )}
                </button>
              </div>
              <span className="cta-hint">
                {isSubmitted
                  ? "Check your inbox for next steps."
                  : "No credit card. Cancel anytime."}
              </span>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;