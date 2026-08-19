import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardPreview from "./components/DashboardPreview";
import Features from "./components/Features";
import Workflow from "./components/Workflow";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
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