import React, { useState, useEffect } from 'react';
import { adminService, doctorService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const specialtyColors = {
    'Cardiology':    { bg: '#fff0f3', color: '#c9184a', border: '#ffb3c1', icon: '❤️' },
    'Pediatrics':    { bg: '#f0fdf4', color: '#15803d', border: '#86efac', icon: '👶' },
    'Neurology':     { bg: '#faf5ff', color: '#7e22ce', border: '#d8b4fe', icon: '🧠' },
    'Orthopedics':   { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd', icon: '🦴' },
    'Dermatology':   { bg: '#fff7ed', color: '#c2410c', border: '#fdba74', icon: '🌟' },
};

const getSpecialtyStyle = (spec) =>
    specialtyColors[spec] || { bg: '#f0f9ff', color: '#0369a1', border: '#7dd3fc', icon: '🏥' };

const defaultDoctorForm = {
    name: '', email: '', password: '', specialization: '', department: '', fee: '', experience: '',
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics');
    const [appointmentsReport, setAppointmentsReport] = useState({});
    const [revenueReport, setRevenueReport] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [doctorForm, setDoctorForm] = useState(defaultDoctorForm);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchReports();
        fetchDoctors();
    }, []);

    const fetchReports = async () => {
        try {
            const [appRes, revRes] = await Promise.all([
                adminService.getAppointmentsReport(),
                adminService.getRevenueReport()
            ]);
            setAppointmentsReport(appRes.data);
            setRevenueReport(revRes.data);
        } catch (err) { console.error(err); }
    };

    const fetchDoctors = async () => {
        try {
            const res = await doctorService.search('');
            setDoctors(res.data);
        } catch (err) { console.error(err); }
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3000);
    };

    const openAddModal = () => {
        setEditingDoctor(null);
        setDoctorForm(defaultDoctorForm);
        setShowModal(true);
    };

    const openEditModal = (doc) => {
        setEditingDoctor(doc);
        setDoctorForm({
            name: doc.name || '',
            email: doc.email || '',
            password: '',
            specialization: doc.specialization || '',
            department: doc.department || '',
            fee: doc.fee || '',
            experience: doc.experience || '',
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
    };

    const handleSaveDoctor = async () => {
        try {
            const payload = { ...doctorForm, fee: parseFloat(doctorForm.fee) || 0 };
            if (editingDoctor) {
                await doctorService.update(editingDoctor.id, payload);
                showToast('Doctor updated successfully!');
            } else {
                await doctorService.create(payload);
                showToast('Doctor added successfully!');
            }
            setShowModal(false);
            fetchDoctors();
        } catch (err) {
            showToast('Failed to save doctor.', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await doctorService.delete(id);
            showToast('Doctor deleted successfully.');
            setDeleteConfirm(null);
            fetchDoctors();
        } catch {
            showToast('Failed to delete doctor.', 'error');
        }
    };

    const totalRevenue = Object.values(revenueReport).reduce((a, b) => a + b, 0);
    const totalAppointments = Object.values(appointmentsReport).reduce((a, b) => a + b, 0);
    const maxAppointments = Math.max(...Object.values(appointmentsReport), 1);

    const [showSlotModal, setShowSlotModal] = useState(false);
    const [selectedDoctorForSlot, setSelectedDoctorForSlot] = useState(null);
    const [slotFormValues, setSlotFormValues] = useState({ date: '', startTime: '', endTime: '', capacity: 10 });

    const openSlotModal = (doc) => {
        setSelectedDoctorForSlot(doc);
        setShowSlotModal(true);
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            await doctorService.addSlot(selectedDoctorForSlot.id, { ...slotFormValues, bookedCount: 0 });
            showToast('Slot added for doctor successfully!');
            setShowSlotModal(false);
            setSlotFormValues({ date: '', startTime: '', endTime: '', capacity: 10 });
        } catch {
            showToast('Failed to add slot.', 'error');
        }
    };

    const styles = {
        root: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            padding: '28px 32px',
            color: '#e2e8f0',
        },
        toast: (type) => ({
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            padding: '14px 22px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: type === 'error' ? '#450a0a' : '#052e16',
            color: type === 'error' ? '#fca5a5' : '#86efac',
            border: `1px solid ${type === 'error' ? '#991b1b' : '#166534'}`,
            animation: 'slideIn 0.3s ease',
        }),
        overlay: {
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
        },
        modalBox: {
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 20,
            padding: '32px',
            minWidth: 340,
            maxWidth: 520,
            width: '90%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        },
        modalTitle: {
            fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#f1f5f9',
        },
        modalP: { color: '#94a3b8', fontSize: 14, marginBottom: 24 },
        modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
        btnCancel: {
            padding: '10px 20px', borderRadius: 10, border: '1px solid #334155',
            background: 'transparent', color: '#94a3b8', cursor: 'pointer',
            fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
        },
        btnDelete: {
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
        },
        btnSave: {
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
        },
        formGrid: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        },
        formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
        formLabel: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
        formInput: {
            padding: '10px 14px', borderRadius: 10,
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#e2e8f0', fontSize: 14,
            outline: 'none', transition: 'border 0.2s',
        },
        header: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28,
        },
        headerTitle: { fontSize: 28, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' },
        headerSub: { fontSize: 14, color: '#64748b', marginTop: 2 },
        tabGroup: {
            display: 'flex', background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 14, padding: 4, gap: 4,
        },
        tabBtn: (active) => ({
            padding: '9px 20px', borderRadius: 10, border: 'none',
            background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
            color: active ? '#fff' : '#64748b',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: active ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
        }),
        statsRow: {
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16, marginBottom: 28,
        },
        statCard: (accent) => ({
            background: '#1e293b',
            border: `1px solid #334155`,
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }),
        statAccentBar: (color) => ({
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3, background: color,
        }),
        statIcon: (bg) => ({
            width: 48, height: 48, borderRadius: 14,
            background: bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, flexShrink: 0,
        }),
        statLabel: { fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
        statValue: { fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginTop: 4 },
        analyticsGrid: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        },
        card: {
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 18,
            padding: '24px',
        },
        cardTitle: {
            fontSize: 15, fontWeight: 700, color: '#f1f5f9',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
        },
        reportRow: {
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 14, fontSize: 14,
        },
        reportName: { width: 120, color: '#cbd5e1', flexShrink: 0, fontSize: 13 },
        reportBarWrap: {
            flex: 1, background: '#0f172a', borderRadius: 6, height: 8, overflow: 'hidden',
        },
        reportBar: (pct) => ({
            height: '100%', borderRadius: 6,
            background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
            width: `${pct}%`, transition: 'width 0.6s ease',
        }),
        reportCount: { width: 28, textAlign: 'right', color: '#94a3b8', fontWeight: 700, fontSize: 13 },
        revRow: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0', borderBottom: '1px solid #1e293b', fontSize: 14,
        },
        revDept: { color: '#cbd5e1' },
        revAmount: {
            fontWeight: 700, color: '#34d399',
            background: '#052e16', padding: '3px 10px',
            borderRadius: 8, fontSize: 13,
        },
        docTableWrap: { overflowX: 'auto', marginTop: 8 },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
        th: {
            padding: '12px 16px', textAlign: 'left',
            color: '#64748b', fontWeight: 600, fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            borderBottom: '1px solid #334155',
        },
        td: {
            padding: '14px 16px', borderBottom: '1px solid #1e293b',
            verticalAlign: 'middle',
        },
        docAvatar: (bg) => ({
            width: 38, height: 38, borderRadius: 10,
            background: bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }),
        docName: { fontWeight: 600, color: '#f1f5f9', fontSize: 14 },
        docEmail: { fontSize: 12, color: '#64748b', marginTop: 2 },
        specPill: (bg, color, border) => ({
            display: 'inline-block',
            padding: '4px 10px', borderRadius: 8,
            background: bg, color: color,
            border: `1px solid ${border}`,
            fontSize: 12, fontWeight: 600,
        }),
        feeBadge: {
            fontWeight: 700, color: '#fbbf24',
        },
        btnEdit: {
            padding: '6px 14px', borderRadius: 8,
            border: '1px solid #334155',
            background: 'transparent', color: '#93c5fd',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
        },
        btnDelRow: {
            padding: '6px 14px', borderRadius: 8,
            border: '1px solid #450a0a',
            background: 'transparent', color: '#fca5a5',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            transition: 'all 0.2s',
        },
        btnAddDoctor: {
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', cursor: 'pointer', fontWeight: 700,
            fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
        },
        cardHeaderRow: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
        },
        emptyState: { color: '#475569', textAlign: 'center', padding: '24px 0', fontSize: 14 },
    };

    return (
        <div style={styles.root}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
                @keyframes slideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
                input:focus { border-color: #6366f1 !important; }
                tr:hover td { background: rgba(99,102,241,0.05); }
            `}</style>

            {/* Toast */}
            {toast.text && <div style={styles.toast(toast.type)}>{toast.text}</div>}

            {/* Delete Modal */}
            {deleteConfirm && (
                <div style={styles.overlay} onClick={() => setDeleteConfirm(null)}>
                    <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalTitle}>⚠️ Confirm Delete</div>
                        <p style={styles.modalP}>
                            Remove <strong style={{ color: '#f1f5f9' }}>{deleteConfirm.name}</strong> from the system? This cannot be undone.
                        </p>
                        <div style={styles.modalActions}>
                            <button style={styles.btnCancel} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button style={styles.btnDelete} onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={{ ...styles.modalBox, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalTitle}>{editingDoctor ? '✏️ Edit Doctor' : '➕ Add New Doctor'}</div>
                        <div style={styles.formGrid}>
                            {[
                                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Dr. Full Name' },
                                { label: 'Email', name: 'email', type: 'email', placeholder: 'doctor@hms.com' },
                                { label: 'Password', name: 'password', type: 'password', placeholder: editingDoctor ? 'Leave blank to keep' : 'Password' },
                                { label: 'Specialization', name: 'specialization', type: 'text', placeholder: 'e.g. Cardiology' },
                                { label: 'Department', name: 'department', type: 'text', placeholder: 'e.g. Cardiology Dept' },
                                { label: 'Fee (₹)', name: 'fee', type: 'number', placeholder: '500' },
                                { label: 'Experience', name: 'experience', type: 'text', placeholder: 'e.g. 10 years' },
                            ].map(f => (
                                <div key={f.name} style={styles.formGroup}>
                                    <label style={styles.formLabel}>{f.label}</label>
                                    <input
                                        style={styles.formInput}
                                        type={f.type} name={f.name}
                                        placeholder={f.placeholder}
                                        value={doctorForm[f.name]}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={styles.modalActions}>
                            <button style={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                            <button style={styles.btnSave} onClick={handleSaveDoctor}>
                                {editingDoctor ? 'Save Changes' : 'Add Doctor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Slot Modal */}
            {showSlotModal && (
                <div style={styles.overlay} onClick={() => setShowSlotModal(false)}>
                    <div style={{ ...styles.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalTitle}>📅 Add Slot for {selectedDoctorForSlot?.name}</div>
                        <form onSubmit={handleAddSlot}>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Date</label>
                                <input style={styles.formInput} type="date" required value={slotFormValues.date} onChange={e => setSlotFormValues({...slotFormValues, date: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Start</label>
                                    <input style={styles.formInput} type="time" required value={slotFormValues.startTime} onChange={e => setSlotFormValues({...slotFormValues, startTime: e.target.value})} />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>End</label>
                                    <input style={styles.formInput} type="time" required value={slotFormValues.endTime} onChange={e => setSlotFormValues({...slotFormValues, endTime: e.target.value})} />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Capacity</label>
                                <input style={styles.formInput} type="number" required value={slotFormValues.capacity} onChange={e => setSlotFormValues({...slotFormValues, capacity: parseInt(e.target.value)})} />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" style={styles.btnCancel} onClick={() => setShowSlotModal(false)}>Cancel</button>
                                <button type="submit" style={styles.btnSave}>Add Slot</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.headerTitle}>Admin Dashboard</h1>
                    <p style={styles.headerSub}>Welcome back, {user?.name} 👋</p>
                </div>
                <div style={styles.tabGroup}>
                    <button style={styles.tabBtn(activeTab === 'analytics')} onClick={() => setActiveTab('analytics')}>
                        📊 Analytics
                    </button>
                    <button style={styles.tabBtn(activeTab === 'doctors')} onClick={() => setActiveTab('doctors')}>
                        👨‍⚕️ Doctors
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div style={styles.statsRow}>
                {[
                    { label: 'Total Doctors', value: doctors.length, icon: '🩺', accent: '#6366f1', iconBg: 'rgba(99,102,241,0.15)' },
                    { label: 'Est. Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: '💰', accent: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
                    { label: 'Productivity', value: '94.2%', icon: '📈', accent: '#f59e0b', iconBg: 'rgba(245,158,11,0.15)' },
                    { label: 'Appointments', value: totalAppointments, icon: '🏥', accent: '#ec4899', iconBg: 'rgba(236,72,153,0.15)' },
                ].map(s => (
                    <div key={s.label} style={styles.statCard(s.accent)}>
                        <div style={styles.statAccentBar(s.accent)} />
                        <div style={styles.statIcon(s.iconBg)}>{s.icon}</div>
                        <div>
                            <div style={styles.statLabel}>{s.label}</div>
                            <div style={styles.statValue}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div style={styles.analyticsGrid}>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>📋 Appointments per Doctor</div>
                        {Object.keys(appointmentsReport).length === 0 ? (
                            <div style={styles.emptyState}>No appointment data yet.</div>
                        ) : Object.entries(appointmentsReport).map(([name, count]) => (
                            <div key={name} style={styles.reportRow}>
                                <span style={styles.reportName}>{name}</span>
                                <div style={styles.reportBarWrap}>
                                    <div style={styles.reportBar(Math.round((count / maxAppointments) * 100))} />
                                </div>
                                <span style={styles.reportCount}>{count}</span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>💰 Revenue per Department</div>
                        {Object.keys(revenueReport).length === 0 ? (
                            <div style={styles.emptyState}>No revenue data yet.</div>
                        ) : Object.entries(revenueReport).map(([dept, rev]) => (
                            <div key={dept} style={styles.revRow}>
                                <span style={styles.revDept}>{dept}</span>
                                <span style={styles.revAmount}>₹{rev.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
                <div style={styles.card}>
                    <div style={styles.cardHeaderRow}>
                        <div style={styles.cardTitle}>👨‍⚕️ All Doctors</div>
                        <button style={styles.btnAddDoctor} onClick={openAddModal}>
                            ➕ Add Doctor
                        </button>
                    </div>
                    <div style={styles.docTableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {['Doctor', 'Specialization', 'Department', 'Experience', 'Fee', 'Actions'].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doc => {
                                    const s = getSpecialtyStyle(doc.specialization);
                                    return (
                                        <tr key={doc.id}>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={styles.docAvatar(s.bg)}>{s.icon}</div>
                                                    <div>
                                                        <div style={styles.docName}>{doc.name}</div>
                                                        <div style={styles.docEmail}>{doc.email || '—'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.specPill(s.bg, s.color, s.border)}>
                                                    {doc.specialization}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, color: '#94a3b8' }}>{doc.department}</td>
                                            <td style={{ ...styles.td, color: '#94a3b8' }}>{doc.experience || '—'}</td>
                                            <td style={{ ...styles.td, ...styles.feeBadge }}>₹{doc.fee}</td>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button style={styles.btnEdit} onClick={() => openEditModal(doc)}>✏️ Edit</button>
                                                    <button style={styles.btnEdit} onClick={() => openSlotModal(doc)}>📅 +Slot</button>
                                                    <button style={styles.btnDelRow} onClick={() => setDeleteConfirm(doc)}>🗑️ Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;