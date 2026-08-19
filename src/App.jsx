import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardPreview from "./components/DashboardPreview";
import Features from "./components/Features";
import Workflow from "./components/Workflow";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];

    let position = 0;

    const handleKeyDown = (event) => {
      const key = event.key.length === 1
        ? event.key.toLowerCase()
        : event.key;

      if (key === konamiCode[position]) {
        position++;

        if (position === konamiCode.length) {
          document.body.classList.add("devflow-secret");

          setTimeout(() => {
            document.body.classList.remove("devflow-secret");
          }, 3000);

          position = 0;
        }
      } else {
        position = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <Workflow />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default App;