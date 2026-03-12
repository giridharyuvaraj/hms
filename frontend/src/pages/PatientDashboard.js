import React, { useState, useEffect } from 'react';
import { doctorService, appointmentService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const specialtyColors = {
    'Cardiology': { bg: '#fef3c7', color: '#d97706', icon: '❤️' },
    'Pediatrics': { bg: '#d1fae5', color: '#059669', icon: '👶' },
    'Neurology': { bg: '#ede9fe', color: '#7c3aed', icon: '🧠' },
    'Orthopedics': { bg: '#dbeafe', color: '#1d4ed8', icon: '🦴' },
    'Dermatology': { bg: '#fce7f3', color: '#db2777', icon: '🌟' },
};

const getSpecialtyStyle = (spec) => specialtyColors[spec] || { bg: '#e0f2fe', color: '#0369a1', icon: '🏥' };

const PatientDashboard = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingSlot, setBookingSlot] = useState(null);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [expandedDoctor, setExpandedDoctor] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async (spec = '') => {
        try {
            const res = await doctorService.search(spec);
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors(search);
    };

    const handleBook = async () => {
        if (!bookingSlot || !selectedDoctor) return;
        try {
            const appointment = {
                patientId: user.id,
                doctorId: selectedDoctor.id,
                appointmentDate: bookingSlot.date,
                startTime: bookingSlot.startTime,
                endTime: bookingSlot.endTime,
            };
            await appointmentService.book(appointment);
            showToast(`✅ Appointment with ${selectedDoctor.name} booked successfully!`, 'success');
            setBookingSlot(null);
            setSelectedDoctor(null);
            setExpandedDoctor(null);
        } catch (err) {
            showToast('❌ ' + (err.response?.data?.message || 'Booking failed – slot may be unavailable.'), 'error');
        }
    };

    return (
        <div className="patient-dashboard">
            {toast.text && (
                <div className={`toast toast-${toast.type}`}>{toast.text}</div>
            )}

            <div className="dashboard-header">
                <div>
                    <h1>Find a Specialist</h1>
                    <p className="text-muted">Hello, {user?.name}! Book an appointment with our top doctors.</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="search-bar-form">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by specialization (e.g. Cardiology, Neurology)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-search">Search</button>
                {search && (
                    <button type="button" className="btn-clear" onClick={() => { setSearch(''); fetchDoctors(''); }}>
                        Clear
                    </button>
                )}
            </form>

            <div className="doctors-grid">
                {doctors.length === 0 && (
                    <div className="empty-state-box">
                        <span style={{ fontSize: '3rem' }}>🔎</span>
                        <p>No doctors found for your search.</p>
                        <button onClick={() => { setSearch(''); fetchDoctors(''); }} className="btn-clear-search">Show All Doctors</button>
                    </div>
                )}
                {doctors.map(doc => {
                    const style = getSpecialtyStyle(doc.specialization);
                    const isExpanded = expandedDoctor === doc.id;
                    return (
                        <div key={doc.id} className={`doctor-card ${isExpanded ? 'expanded' : ''}`}>
                            <div className="doctor-card-top">
                                <div className="doc-avatar-sm" style={{ background: style.bg }}>
                                    <span>{style.icon}</span>
                                </div>
                                <div className="doc-info">
                                    <h3>{doc.name}</h3>
                                    <span className="spec-pill" style={{ background: style.bg, color: style.color }}>
                                        {doc.specialization}
                                    </span>
                                    <p className="text-muted small">{doc.department}</p>
                                </div>
                            </div>

                            <div className="doc-meta-row">
                                <span className="meta-item">💰 ₹{doc.fee}/visit</span>
                                {doc.experience && <span className="meta-item">⭐ {doc.experience}</span>}
                                <span className="meta-item">📅 {doc.availableSlots?.length || 0} slots</span>
                            </div>

                            <button
                                className={`btn-see-slots ${isExpanded ? 'active' : ''}`}
                                onClick={() => {
                                    setExpandedDoctor(isExpanded ? null : doc.id);
                                    setSelectedDoctor(null);
                                    setBookingSlot(null);
                                }}
                            >
                                {isExpanded ? '▲ Hide Slots' : '📅 See Available Slots'}
                            </button>

                            {isExpanded && (
                                <div className="slots-panel">
                                    <h5>Available Appointment Slots</h5>
                                    {doc.availableSlots?.length === 0 ? (
                                        <p className="text-muted small">No slots available currently.</p>
                                    ) : (
                                        doc.availableSlots.map((slot, i) => (
                                            <button
                                                key={i}
                                                className={`slot-btn ${bookingSlot === slot && selectedDoctor?.id === doc.id ? 'selected-slot' : ''}`}
                                                onClick={() => {
                                                    setSelectedDoctor(doc);
                                                    setBookingSlot(slot);
                                                }}
                                            >
                                                📅 {slot.date} &nbsp;•&nbsp; 🕐 {slot.startTime} – {slot.endTime}
                                            </button>
                                        ))
                                    )}
                                    {selectedDoctor?.id === doc.id && bookingSlot && (
                                        <button className="btn-confirm-booking" onClick={handleBook}>
                                            ✅ Confirm Appointment
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientDashboard;
