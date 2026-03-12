import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const statusConfig = {
    BOOKED:    { color: '#818cf8', bg: 'rgba(99,102,241,0.15)', border: '#4f46e5', label: 'Booked',    icon: '📋' },
    CONFIRMED: { color: '#34d399', bg: 'rgba(16,185,129,0.15)', border: '#059669', label: 'Confirmed', icon: '✅' },
    COMPLETED: { color: '#94a3b8', bg: 'rgba(71,85,105,0.2)',   border: '#475569', label: 'Completed', icon: '🏁' },
    CANCELLED: { color: '#f87171', bg: 'rgba(239,68,68,0.15)',  border: '#dc2626', label: 'Cancelled', icon: '❌' },
};

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (user?.id) fetchSchedule();
    }, [user]);

    const fetchSchedule = async () => {
        try {
            const res = await appointmentService.getDoctorSchedule(user.id);
            setAppointments(res.data);
        } catch (err) { console.error(err); }
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3000);
    };

    const handleConfirm = async (id) => {
        try {
            await appointmentService.confirm(id, user.id);
            showToast('Appointment confirmed!');
            fetchSchedule();
        } catch {
            showToast('Failed to confirm appointment.', 'error');
        }
    };

    const handleComplete = async (id) => {
        try {
            await appointmentService.complete(id, user.id);
            showToast('Appointment marked as completed!');
            fetchSchedule();
        } catch {
            showToast('Failed to complete appointment.', 'error');
        }
    };

    const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
    const counts = appointments.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    const s = {
        root: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            padding: '28px 32px',
            color: '#e2e8f0',
        },
        toast: (type) => ({
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            padding: '14px 22px', borderRadius: 12, fontWeight: 600, fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: type === 'error' ? '#450a0a' : '#052e16',
            color: type === 'error' ? '#fca5a5' : '#86efac',
            border: `1px solid ${type === 'error' ? '#991b1b' : '#166534'}`,
            animation: 'slideIn 0.3s ease',
        }),
        header: {
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 28,
        },
        title: { fontSize: 28, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' },
        subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
        statsRow: {
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16, marginBottom: 28,
        },
        statCard: (cfg) => ({
            background: '#1e293b',
            border: `1px solid #334155`,
            borderRadius: 16,
            padding: '20px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
            position: 'relative', overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }),
        accentBar: (color) => ({
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3, background: color,
        }),
        statIcon: (bg) => ({
            width: 46, height: 46, borderRadius: 13,
            background: bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, flexShrink: 0,
        }),
        statLabel: { fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' },
        statValue: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginTop: 3 },
        filterRow: {
            display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
        },
        filterBtn: (active, cfg) => ({
            padding: '8px 18px', borderRadius: 10, border: 'none',
            background: active ? (cfg ? cfg.bg : 'rgba(99,102,241,0.2)') : 'rgba(255,255,255,0.04)',
            color: active ? (cfg ? cfg.color : '#818cf8') : '#64748b',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
            outline: active ? `1px solid ${cfg ? cfg.border : '#4f46e5'}` : '1px solid transparent',
        }),
        list: { display: 'flex', flexDirection: 'column', gap: 12 },
        emptyBox: {
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 12,
            background: '#1e293b', border: '1px dashed #334155',
            borderRadius: 18, padding: '56px 32px', color: '#475569',
            fontSize: 15, fontWeight: 500,
        },
        apptCard: (cfg) => ({
            background: '#1e293b',
            border: '1px solid #334155',
            borderLeft: `4px solid ${cfg.border}`,
            borderRadius: 16,
            padding: '18px 24px',
            display: 'flex', alignItems: 'center', gap: 20,
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }),
        patientAvatar: (cfg) => ({
            width: 46, height: 46, borderRadius: 13,
            background: cfg.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, flexShrink: 0,
            border: `1px solid ${cfg.border}`,
        }),
        patientName: { fontWeight: 700, fontSize: 15, color: '#f1f5f9' },
        apptSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
        midSection: {
            display: 'flex', gap: 20, flex: 1,
            justifyContent: 'center', flexWrap: 'wrap',
        },
        infoChip: {
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #334155',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 13, color: '#cbd5e1', fontWeight: 500,
        },
        rightSection: {
            display: 'flex', alignItems: 'center', gap: 10,
            marginLeft: 'auto', flexShrink: 0,
        },
        statusBadge: (cfg) => ({
            padding: '5px 12px', borderRadius: 8,
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.border}`,
            fontWeight: 700, fontSize: 12,
            letterSpacing: '0.04em',
        }),
        btnConfirm: {
            padding: '8px 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(99,102,241,0.35)',
            transition: 'opacity 0.2s',
        },
        btnComplete: {
            padding: '8px 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(16,185,129,0.35)',
            transition: 'opacity 0.2s',
        },
    };

    return (
        <div style={s.root}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            {toast.text && <div style={s.toast(toast.type)}>{toast.text}</div>}

            {/* Header */}
            <div style={s.header}>
                <div>
                    <h1 style={s.title}>My Schedule</h1>
                    <p style={s.subtitle}>Welcome back, {user?.name} 👋 &nbsp;·&nbsp; {appointments.length} total appointments</p>
                </div>
            </div>

            {/* Stats */}
            <div style={s.statsRow}>
                {Object.entries(statusConfig).map(([status, cfg]) => (
                    <div
                        key={status}
                        style={s.statCard(cfg)}
                        onClick={() => setFilter(status)}
                    >
                        <div style={s.accentBar(cfg.border)} />
                        <div style={s.statIcon(cfg.bg)}>{cfg.icon}</div>
                        <div>
                            <div style={s.statLabel}>{cfg.label}</div>
                            <div style={s.statValue}>{counts[status] || 0}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={s.filterRow}>
                <button style={s.filterBtn(filter === 'ALL', null)} onClick={() => setFilter('ALL')}>
                    All &nbsp;({appointments.length})
                </button>
                {Object.entries(statusConfig).map(([status, cfg]) => (
                    <button key={status} style={s.filterBtn(filter === status, cfg)} onClick={() => setFilter(status)}>
                        {cfg.icon} &nbsp;{cfg.label} ({counts[status] || 0})
                    </button>
                ))}
            </div>

            {/* Appointment List */}
            <div style={s.list}>
                {filtered.length === 0 && (
                    <div style={s.emptyBox}>
                        <span style={{ fontSize: '2.8rem' }}>📭</span>
                        No appointments in this category.
                    </div>
                )}
                {filtered.map(app => {
                    const cfg = statusConfig[app.status] || statusConfig.BOOKED;
                    return (
                        <div key={app.id} style={s.apptCard(cfg)}>
                            {/* Left */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 180 }}>
                                <div style={s.patientAvatar(cfg)}>👤</div>
                                <div>
                                    <div style={s.patientName}>Patient #{app.patientId}</div>
                                    <div style={s.apptSub}>Appt. #{app.id}</div>
                                </div>
                            </div>

                            {/* Mid */}
                            <div style={s.midSection}>
                                <span style={s.infoChip}>📅 {app.appointmentDate}</span>
                                <span style={s.infoChip}>🕐 {app.startTime} – {app.endTime}</span>
                            </div>

                            {/* Right */}
                            <div style={s.rightSection}>
                                <span style={s.statusBadge(cfg)}>{cfg.label}</span>
                                {app.status === 'BOOKED' && (
                                    <button style={s.btnConfirm} onClick={() => handleConfirm(app.id)}>
                                        ✅ Confirm
                                    </button>
                                )}
                                {app.status === 'CONFIRMED' && (
                                    <button style={s.btnComplete} onClick={() => handleComplete(app.id)}>
                                        🏁 Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DoctorDashboard;