import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const specialtyColors = {
    'Cardiology':    { bg: 'rgba(201,24,74,0.12)',   color: '#fb7185', border: 'rgba(201,24,74,0.3)',   icon: '❤️' },
    'Pediatrics':    { bg: 'rgba(16,185,129,0.12)',   color: '#34d399', border: 'rgba(16,185,129,0.3)',  icon: '👶' },
    'Neurology':     { bg: 'rgba(139,92,246,0.12)',   color: '#a78bfa', border: 'rgba(139,92,246,0.3)',  icon: '🧠' },
    'Orthopedics':   { bg: 'rgba(59,130,246,0.12)',   color: '#60a5fa', border: 'rgba(59,130,246,0.3)',  icon: '🦴' },
    'Dermatology':   { bg: 'rgba(244,114,182,0.12)',  color: '#f472b6', border: 'rgba(244,114,182,0.3)', icon: '🌟' },
    'Diabetology':   { bg: 'rgba(251,146,60,0.12)',   color: '#fb923c', border: 'rgba(251,146,60,0.3)',  icon: '🩸' },
    'ENT':           { bg: 'rgba(34,211,238,0.12)',   color: '#22d3ee', border: 'rgba(34,211,238,0.3)',  icon: '👂' },
    'Ophthalmology': { bg: 'rgba(250,204,21,0.12)',   color: '#facc15', border: 'rgba(250,204,21,0.3)',  icon: '👁️' },
    'Neurosurgery':  { bg: 'rgba(139,92,246,0.12)',   color: '#c084fc', border: 'rgba(139,92,246,0.3)',  icon: '🧠' },
};

const getSpecialtyStyle = (spec) =>
    specialtyColors[spec] || { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: 'rgba(56,189,248,0.3)', icon: '🏥' };

const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const hardcodedDoctors = [
        { 
            id: 1, 
            name: 'Dr. V. Mohan', 
            specialization: 'Diabetology', 
            department: 'Diabetes & Endocrinology', 
            fee: 800, 
            experience: '40+ years' 
        },
        { 
            id: 2, 
            name: 'Dr. Hari', 
            specialization: 'ENT', 
            department: 'Ear, Nose & Throat', 
            fee: 600, 
            experience: '35+ years' 
        },
        { 
            id: 3, 
            name: 'Dr. S.Badrinath', 
            specialization: 'Ophthalmology', 
            department: 'Eye Care', 
            fee: 700, 
            experience: '45+ years' 
        },
        { 
            id: 4, 
            name: 'Dr. Manjula', 
            specialization: 'Neurosurgery', 
            department: 'Neurosciences', 
            fee: 1200, 
            experience: '30+ years' 
        },
    ];

    useEffect(() => {
        doctorService.search('').then(res => {
            setDoctors(res.data.slice(0, 4).length ? res.data.slice(0, 4) : hardcodedDoctors);
            setLoading(false);
        }).catch(() => {
            setDoctors(hardcodedDoctors);
            setLoading(false);
        });
    }, []);

    const handleGetStarted = () => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'DOCTOR') navigate('/doctor');
            else navigate('/patient');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={css.root}>
            <style>{globalStyles}</style>

            {/* ── Hero ── */}
            <section style={css.hero}>
                {/* Background grid lines */}
                <div style={css.gridOverlay} />

                <div style={css.heroContent}>
                    <div style={css.badge}>
                        <span style={{ color: '#818cf8' }}>✦</span>&nbsp; Smart Hospital Management Information System
                    </div>

                    <h1 style={css.heroTitle}>
                        Welcome to<br />
                        <span style={css.gradientText}>SmartHMS</span>
                    </h1>

                    <p style={css.heroSubtitle}>
                        Your all-in-one Smart Hospital Management System.
                        Seamlessly connecting patients, doctors, and administrators
                        with intelligent tools and real-time insights.
                    </p>

                    <div style={css.heroActions}>
                        <button style={css.btnPrimary} onClick={handleGetStarted}>
                            {user ? 'Open Dashboard' : 'Get Started Free'}
                            <span style={{ marginLeft: 10 }}>→</span>
                        </button>
                        <button
                            style={css.btnSecondary}
                            onClick={() => document.getElementById('portals-section').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Portals
                        </button>
                    </div>

                    <div style={css.statsRow}>
                        {[
                            { num: '2.4k+', label: 'Active Users' },
                            { num: '120+',  label: 'Specialists' },
                            { num: '99.9%', label: 'Uptime' },
                        ].map((s, i) => (
                            <React.Fragment key={s.label}>
                                {i > 0 && <div style={css.statDivider} />}
                                <div style={css.statItem}>
                                    <span style={css.statNum}>{s.num}</span>
                                    <span style={css.statLabel}>{s.label}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Hero visual card */}
                {/* <div style={css.heroVisual}> */}
                    {/* <div style={css.heroCard}> */}
                        {/* <div style={css.pulseRing} className="pulse-ring" />
                        <div style={css.heroCardIcon}>🏥</div>
                        <p style={css.heroCardTitle}>SmartHMS</p>
                        <p style={css.heroCardSub}>Hospital Management System</p> */}

                        {/* Floating chips */}
                        {/* <div style={{ ...css.floatChip, top: -18, right: -18 }}>
                            <span>✅</span> 98 Confirmed Today
                        </div>
                        <div style={{ ...css.floatChip, bottom: -18, left: -18 }}>
                            <span>🩺</span> 12 Live Consults
                        </div> */}
                    {/* </div>
                </div> */}
            </section>

            {/* ── Portals ── */}
            {/* <section id="portals-section" style={css.section}>
                <h2 style={css.sectionTitle}>SmartHMS <span style={css.gradientText}>Portals</span></h2>
                <p style={css.sectionSub}>Dedicated workspaces for every role in your hospital</p>

                <div style={css.portalsGrid}>
                    {[
                        {
                            to: '/patient', icon: '🧑‍⚕️', accent: '#6366f1',
                            title: 'Patient Portal',
                            desc: 'Book appointments, track your health history, and consult with SmartHMIS specialists from anywhere.',
                            cta: 'Access Dashboard →',
                        },
                        {
                            to: '/doctor', icon: '👨‍⚕️', accent: '#10b981',
                            title: 'Doctor Workspace',
                            desc: 'View your daily schedule, manage patient consultations, and update records — all in one place.',
                            cta: 'Access Workspace →',
                        },
                        {
                            to: '/admin', icon: '👨‍💼', accent: '#f59e0b',
                            title: 'Admin Console',
                            desc: 'Oversee hospital operations, manage doctors, track revenue, and monitor SmartHMIS analytics.',
                            cta: 'Access Console →',
                        },
                    ].map(p => (
                        <Link key={p.to} to={p.to} style={{ textDecoration: 'none' }}>
                            <div style={css.portalCard} className="portal-card">
                                <div style={{ ...css.portalAccent, background: p.accent }} />
                                <div style={{ ...css.portalIconWrap, background: `${p.accent}22` }}>
                                    <span style={{ fontSize: 28 }}>{p.icon}</span>
                                </div>
                                <h3 style={css.portalTitle}>{p.title}</h3>
                                <p style={css.portalDesc}>{p.desc}</p>
                                <div style={{ ...css.portalCta, color: p.accent }}>{p.cta}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section> */}

            {/* ── Doctors ── */}
            {/* <section style={css.section} id="doctors-section">
                <h2 style={css.sectionTitle}>Our <span style={css.gradientText}>Specialists</span></h2>
                <p style={css.sectionSub}>Meet the specialists available on SmartHMS</p>

                {loading ? (
                    <div style={css.loading}>Loading specialists…</div>
                ) : (
                    <div style={css.doctorsGrid}>
                        {doctors.map(doc => {
                            const sp = getSpecialtyStyle(doc.specialization);
                            return (
                                <div key={doc.id} style={css.docCard} className="doc-card">
                                    <div style={{ ...css.docAvatar, background: sp.bg, border: `1px solid ${sp.border}` }}>
                                        <span style={{ fontSize: 32 }}>{sp.icon}</span>
                                    </div>
                                    <h3 style={css.docName}>{doc.name}</h3>
                                    <span style={{ ...css.specPill, background: sp.bg, color: sp.color, border: `1px solid ${sp.border}` }}>
                                        {doc.specialization}
                                    </span>
                                    <p style={css.docDept}>{doc.department}</p>
                                    <div style={css.docMeta}>
                                        <span style={css.docFee}>₹{doc.fee}</span>
                                        <span style={css.docDivider}>|</span>
                                        <span style={css.docExp}>{doc.experience || 'Senior'}</span>
                                    </div>
                                    <button style={css.btnBook} onClick={handleGetStarted}>
                                        Book Consultation
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section> */}

            {/* ── CTA ── */}
            {/* <section style={css.ctaSection}>
                <div style={css.ctaBox}>
                    <div style={css.ctaGlow} />
                    <h2 style={css.ctaTitle}>
                        Ready to Join <span style={css.gradientText}>SmartHMS?</span>
                    </h2>
                    <p style={css.ctaSub}>Smarter healthcare management starts here. Sign up and take control.</p>
                    <button style={css.btnPrimaryLg} onClick={handleGetStarted}>
                        {user ? 'Return to Dashboard' : 'Get Started with SmartHMIS'} →
                    </button>
                </div>
            </section> */}
        </div>
    );
};

/* ─── Styles ─── */
const css = {
    root: {
        minHeight: '100vh',
        background: '#0f172a',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: '#e2e8f0',
        overflowX: 'hidden',
    },
    gridOverlay: {
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
    },
    hero: {
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 48, padding: '100px 80px',
        minHeight: '90vh',
        overflow: 'hidden',
    },
    heroContent: { flex: 1, maxWidth: 580, position: 'relative', zIndex: 1 },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 100, padding: '8px 18px',
        fontSize: 13, fontWeight: 600, color: '#a5b4fc',
        marginBottom: 28,
    },
    heroTitle: {
        fontSize: 'clamp(48px, 6vw, 80px)',
        fontWeight: 900, lineHeight: 1.05,
        color: '#f8fafc', letterSpacing: '-2px',
        marginBottom: 24,
    },
    gradientText: {
        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
        fontSize: 17, color: '#94a3b8', lineHeight: 1.7,
        marginBottom: 40, maxWidth: 480,
    },
    heroActions: { display: 'flex', gap: 14, marginBottom: 52, flexWrap: 'wrap' },
    btnPrimary: {
        padding: '14px 32px', borderRadius: 14, border: 'none',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
        transition: 'opacity 0.2s',
        fontFamily: 'inherit',
    },
    btnSecondary: {
        padding: '14px 32px', borderRadius: 14,
        border: '1px solid #334155',
        background: 'rgba(255,255,255,0.04)',
        color: '#cbd5e1', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
    },
    statsRow: { display: 'flex', alignItems: 'center', gap: 32 },
    statItem: { display: 'flex', flexDirection: 'column', gap: 4 },
    statNum: { fontSize: 26, fontWeight: 800, color: '#f1f5f9' },
    statLabel: { fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
    statDivider: { width: 1, height: 36, background: '#1e293b' },
    heroVisual: {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
    },
    heroCard: {
        position: 'relative',
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 28, padding: '48px 56px',
        textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    },
    pulseRing: {
        position: 'absolute', inset: -16,
        borderRadius: 40,
        border: '1px solid rgba(99,102,241,0.2)',
        animation: 'pulse 2.5s ease-in-out infinite',
    },
    heroCardIcon: {
        fontSize: 64, marginBottom: 20,
        display: 'block',
    },
    heroCardTitle: { fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 },
    heroCardSub: { fontSize: 13, color: '#64748b', fontWeight: 500 },
    floatChip: {
        position: 'absolute',
        display: 'flex', alignItems: 'center', gap: 7,
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: 10, padding: '8px 14px',
        fontSize: 12, fontWeight: 600, color: '#cbd5e1',
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    },
    section: {
        padding: '80px 80px',
        borderTop: '1px solid #1e293b',
    },
    sectionTitle: {
        fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: 800, textAlign: 'center',
        color: '#f8fafc', letterSpacing: '-1px', marginBottom: 12,
    },
    sectionSub: {
        textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 52,
    },
    portalsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
    },
    portalCard: {
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 20, padding: '32px',
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    portalAccent: {
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    },
    portalIconWrap: {
        width: 60, height: 60, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    portalTitle: { fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    portalDesc: { fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 },
    portalCta: { fontSize: 14, fontWeight: 700 },
    doctorsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
    },
    docCard: {
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 20, padding: '32px 24px',
        textAlign: 'center',
        transition: 'transform 0.2s',
    },
    docAvatar: {
        width: 80, height: 80, borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
    },
    docName: { fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    specPill: {
        display: 'inline-block',
        padding: '4px 12px', borderRadius: 8,
        fontSize: 12, fontWeight: 700,
    },
    docDept: { color: '#64748b', fontSize: 13, margin: '12px 0' },
    docMeta: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 20 },
    docFee: { fontWeight: 800, fontSize: 15, color: '#fbbf24' },
    docDivider: { color: '#334155' },
    docExp: { color: '#94a3b8', fontSize: 14 },
    btnBook: {
        width: '100%', padding: '12px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
    },
    loading: {
        textAlign: 'center', padding: '48px', color: '#475569', fontSize: 15,
    },
    ctaSection: {
        padding: '80px 80px',
        borderTop: '1px solid #1e293b',
    },
    ctaBox: {
        position: 'relative',
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 32, padding: '80px 60px',
        textAlign: 'center', overflow: 'hidden',
    },
    ctaGlow: {
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    ctaTitle: {
        fontSize: 'clamp(28px, 4vw, 52px)',
        fontWeight: 900, color: '#f8fafc',
        letterSpacing: '-1.5px', marginBottom: 16,
        position: 'relative',
    },
    ctaSub: {
        fontSize: 18, color: '#64748b', marginBottom: 40, position: 'relative',
    },
    btnPrimaryLg: {
        padding: '18px 56px', borderRadius: 16, border: 'none',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#fff', fontWeight: 700, fontSize: 17, cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
        fontFamily: 'inherit',
        position: 'relative',
    },
};

const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
    @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50%       { opacity: 0.7; transform: scale(1.03); }
    }
    .portal-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
    .doc-card:hover    { transform: translateY(-4px); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
`;

export default HomePage;