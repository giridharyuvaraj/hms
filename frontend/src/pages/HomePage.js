import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "DOCTOR") navigate("/doctor");
      else navigate("/patient");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={css.root}>
      <style>{globalStyles}</style>

      <section style={css.hero}>
        <div style={css.gridOverlay}></div>

        <div style={css.heroContent}>
          <div style={css.badge}>
            <span style={{ color: "#818cf8" }}>✦</span>
            Smart Hospital Management System
          </div>

          <h1 style={css.heroTitle}>
            Welcome to <br />
            <span style={css.gradientText}>SmartHMS</span>
          </h1>

          <p style={css.heroSubtitle}>
            Your all-in-one Smart Hospital Management System. Seamlessly
            connecting patients, doctors, and administrators with intelligent
            tools and real-time insights.
          </p>

          <div style={css.heroActions}>
            <button style={css.btnPrimary} onClick={handleGetStarted}>
              {user ? "Open Dashboard" : "Get Started Free"} →
            </button>

            <button style={css.btnSecondary}>
              Explore Portals
            </button>
          </div>

          <div style={css.statsRow}>
            <div style={css.statItem}>
              <span style={css.statNum}>2.4k+</span>
              <span style={css.statLabel}>Active Users</span>
            </div>

            <div style={css.statDivider}></div>

            <div style={css.statItem}>
              <span style={css.statNum}>120+</span>
              <span style={css.statLabel}>Specialists</span>
            </div>

            <div style={css.statDivider}></div>

            <div style={css.statItem}>
              <span style={css.statNum}>99.9%</span>
              <span style={css.statLabel}>Uptime</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

/* ---------------- CSS ---------------- */

const css = {
  root: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    color: "#e2e8f0",
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },

  hero: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 30,
    padding: "120px 20px",
    width: "100%",
  },

  heroContent: {
    maxWidth: 700,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 50,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: "#a5b4fc",
    marginBottom: 28,
  },

  heroTitle: {
    fontSize: "clamp(42px,6vw,70px)",
    fontWeight: 900,
    lineHeight: 1.1,
    color: "#f8fafc",
    marginBottom: 24,
  },

  gradientText: {
    background: "linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#38bdf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#94a3b8",
    lineHeight: 1.7,
    marginBottom: 40,
    maxWidth: 600,
  },

  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 50,
  },

  btnPrimary: {
    padding: "14px 32px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
  },

  btnSecondary: {
    padding: "14px 32px",
    borderRadius: 12,
    border: "1px solid #334155",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },

  statsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    flexWrap: "wrap",
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  statNum: {
    fontSize: 26,
    fontWeight: 800,
    color: "#f1f5f9",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
  },

  statDivider: {
    width: 1,
    height: 36,
    background: "#1e293b",
  },
};

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

*{
box-sizing:border-box;
margin:0;
padding:0;
}

button:hover{
transform:translateY(-2px);
opacity:0.95;
}
`;

export default HomePage;