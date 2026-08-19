import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const HEADLINE_WORDS = [
  "without the noise.",
  "without the chaos.",
  "without the guesswork.",
  "without the friction."
];

function Hero() {
  const heroRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [showScrollCue, setShowScrollCue] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWordVisible(false);
      window.setTimeout(() => {
        setWordIndex((index) => (index + 1) % HEADLINE_WORDS.length);
        setIsWordVisible(true);
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollCue(window.scrollY < 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePointerMove = useCallback((event) => {
    const node = heroRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setParallax({ x, y });
  }, []);

  const scrollToProduct = useCallback((event) => {
    event.preventDefault();
    const target = document.getElementById("product");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="hero" ref={heroRef} onMouseMove={handlePointerMove}>
      <div
        className="hero-glow hero-glow-one"
        style={{
          transform: `translate(${parallax.x * -30}px, ${parallax.y * -30}px)`
        }}
      ></div>
      <div
        className="hero-glow hero-glow-two"
        style={{
          transform: `translate(${parallax.x * 40}px, ${parallax.y * 40}px)`
        }}
      ></div>

      <div className={`container hero-content${isLoaded ? " is-loaded" : ""}`}>
        <div className="eyebrow" style={{ transitionDelay: "60ms" }}>
          <span className="status-dot"></span>
          Developer workflow, simplified
        </div>

        <h1 style={{ transitionDelay: "140ms" }}>
          Ship software
          <span className={isWordVisible ? "is-visible" : ""}>
            {" "}
            {HEADLINE_WORDS[wordIndex]}
          </span>
        </h1>

        <p className="hero-description" style={{ transitionDelay: "220ms" }}>
          DevFlow brings projects, deployments, CI/CD and team activity
          together in one focused workspace built for modern engineering teams.
        </p>

        <div className="hero-actions" style={{ transitionDelay: "300ms" }}>
          <a href="#start" className="primary-button">
            Start building
            <ArrowRight size={18} />
          </a>

          <a href="#product" className="secondary-button" onClick={scrollToProduct}>
            <Play size={16} />
            Explore product
          </a>
        </div>

        <div className="hero-note" style={{ transitionDelay: "380ms" }}>
          No credit card required
        </div>
      </div>

      <button
        type="button"
        className={`scroll-cue${showScrollCue ? " is-visible" : ""}`}
        onClick={scrollToProduct}
        aria-label="Scroll to product"
      >
        <ChevronDown size={18} />
      </button>
    </section>
  );
}

export default Hero;