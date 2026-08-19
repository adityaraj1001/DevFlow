import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock3,
  GitBranch,
  MoreHorizontal,
  Rocket,
  Users,
  RefreshCw,
  Download,
  SlidersHorizontal
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: Activity,
    welcome: "Good morning",
    heading: "Engineering overview"
  },
  {
    id: "projects",
    label: "Projects",
    icon: GitBranch,
    welcome: "12 active",
    heading: "Projects in flight"
  },
  {
    id: "deployments",
    label: "Deployments",
    icon: Rocket,
    welcome: "3 today",
    heading: "Deployment history"
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    welcome: "8 online",
    heading: "Team activity"
  }
];

const CHART_POINTS = [
  { x: 0, y: 175 },
  { x: 140, y: 155 },
  { x: 270, y: 135 },
  { x: 405, y: 105 },
  { x: 520, y: 95 },
  { x: 650, y: 75 },
  { x: 700, y: 40 }
];

const INITIAL_ACTIVITY = [
  { id: 1, initials: "AR", title: "Production deployed", time: "2 minutes ago" },
  { id: 2, initials: "SK", title: "Pull request merged", time: "18 minutes ago" },
  { id: 3, initials: "RM", title: "Pipeline completed", time: "34 minutes ago" },
  { id: 4, initials: "JD", title: "New project created", time: "1 hour ago" }
];

const LIVE_EVENTS = [
  { initials: "MT", title: "Staging deployed" },
  { initials: "EW", title: "Code review approved" },
  { initials: "PL", title: "Build passed" },
  { initials: "NC", title: "Hotfix shipped" }
];

function useCountUp(target, isActive, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}

function formatDeploySeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function DashboardPreview() {
  const sectionRef = useRef(null);
  const chartPathRef = useRef(null);
  const menuRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activity, setActivity] = useState(INITIAL_ACTIVITY);
  const [pathLength, setPathLength] = useState(0);

  const deployments = useCountUp(128, isVisible);
  const successRate = useCountUp(98.7, isVisible, 1);
  const deploySeconds = useCountUp(252, isVisible);

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
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (chartPathRef.current) {
      setPathLength(chartPathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const next = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
      setActivity((prev) => [
        { id: Date.now(), initials: next.initials, title: next.title, time: "just now", isNew: true },
        ...prev.slice(0, 3)
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChartMove = useCallback((event) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * 700;

    let closest = CHART_POINTS[0];
    let minDist = Infinity;
    CHART_POINTS.forEach((point) => {
      const dist = Math.abs(point.x - relativeX);
      if (dist < minDist) {
        minDist = dist;
        closest = point;
      }
    });

    setHoveredPoint(closest);
  }, []);

  const activeView = NAV_ITEMS.find((item) => item.id === activeNav) ?? NAV_ITEMS[0];

  const pathD =
    "M0 175 C70 165 85 145 140 155 C190 165 215 120 270 135 C320 148 350 90 405 105 C455 120 475 80 520 95 C565 110 610 55 650 75 C670 82 685 55 700 40";

  return (
    <section className="dashboard-section" id="product" ref={sectionRef}>
      <div className="container">
        <div className="section-heading centered">
          <div className="section-label">The workspace</div>
          <h2>Everything your team needs.</h2>
          <p>
            A clear view of what is shipping, what needs attention and where
            your engineering time is going.
          </p>
        </div>

        <div className="dashboard-shell">
          <div className="dashboard-topbar">
            <div className="dashboard-brand">
              <span className="mini-logo">D</span>
              <span>DevFlow</span>
            </div>

            <div className="dashboard-project">
              <span className="project-dot"></span>
              production
            </div>

            <div className="dashboard-user">
              <span>AR</span>
            </div>
          </div>

          <div className="dashboard-body">
            <aside className="dashboard-sidebar">
              <div className="side-title">Workspace</div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`side-item${activeNav === item.id ? " active" : ""}`}
                    onClick={() => setActiveNav(item.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <Icon size={16} />
                    {item.label}
                  </div>
                );
              })}
            </aside>

            <div className="dashboard-main">
              <div className="dashboard-heading-row">
                <div>
                  <div className="dashboard-welcome">{activeView.welcome}</div>
                  <h3>{activeView.heading}</h3>
                </div>

                <div className="more-menu" ref={menuRef}>
                  <button
                    className="more-button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {isMenuOpen && (
                    <div className="more-dropdown">
                      <div className="more-dropdown-item">
                        <RefreshCw size={14} />
                        Refresh data
                      </div>
                      <div className="more-dropdown-item">
                        <Download size={14} />
                        Export CSV
                      </div>
                      <div className="more-dropdown-item">
                        <SlidersHorizontal size={14} />
                        Configure widgets
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Rocket size={17} />
                  </div>
                  <span>Deployments</span>
                  <strong>{deployments}</strong>
                  <small className="positive">
                    <ArrowUp size={13} /> 18.4%
                  </small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckCircle2 size={17} />
                  </div>
                  <span>Success rate</span>
                  <strong>{successRate}%</strong>
                  <small className="positive">
                    <ArrowUp size={13} /> 2.1%
                  </small>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Clock3 size={17} />
                  </div>
                  <span>Avg. deploy</span>
                  <strong>{formatDeploySeconds(deploySeconds)}</strong>
                  <small className="positive">
                    <ArrowDown size={13} /> 11.8%
                  </small>
                </div>
              </div>

              <div className="dashboard-lower">
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <span>Deployment activity</span>
                      <strong>342 deploys</strong>
                    </div>

                    <span className="chart-period">Last 30 days</span>
                  </div>

                  <div className="chart">
                    <div className="chart-lines">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <svg
                      viewBox="0 0 700 220"
                      preserveAspectRatio="none"
                      className="chart-svg"
                      onMouseMove={handleChartMove}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopOpacity="0.2" />
                          <stop offset="100%" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <path d={`${pathD} L700 220 L0 220 Z`} fill="url(#area)" />

                      <path
                        ref={chartPathRef}
                        d={pathD}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: pathLength,
                          strokeDashoffset: isVisible ? 0 : pathLength,
                          transition: "stroke-dashoffset 1.4s ease"
                        }}
                      />

                      {hoveredPoint && (
                        <g>
                          <line
                            x1={hoveredPoint.x}
                            y1="0"
                            x2={hoveredPoint.x}
                            y2="220"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.3"
                          />
                          <circle
                            cx={hoveredPoint.x}
                            cy={hoveredPoint.y}
                            r="5"
                            fill="currentColor"
                          />
                        </g>
                      )}
                    </svg>

                    {hoveredPoint && (
                      <div
                        className="chart-tooltip"
                        style={{
                          left: `${(hoveredPoint.x / 700) * 100}%`,
                          top: `${(hoveredPoint.y / 220) * 100}%`
                        }}
                      >
                        {Math.round(220 - hoveredPoint.y)} deploys
                      </div>
                    )}
                  </div>
                </div>

                <div className="activity-card">
                  <div className="activity-header">
                    <span>Recent activity</span>
                    <span className="live-label">Live</span>
                  </div>

                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className={`activity-item${item.isNew ? " is-new" : ""}`}
                    >
                      <div className="activity-avatar">{item.initials}</div>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;