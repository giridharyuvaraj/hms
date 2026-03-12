import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api.js';
import { User, Mail, Lock, UserPlus, ShieldCheck, Hospital } from '../components/Icons.js';
import '../styles/Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PATIENT'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating account. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
    <Hospital size={48} className="mx-auto mb-4" style={{color: '#4f46e5'}} />
    <h1>Create SmartHMS Account</h1>
    <p>Register to manage appointments, patients, and healthcare records.</p>
</div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error" style={{ color: 'red', marginBottom: '10px' }}>
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <input 
                                type="text" 
                                name="name"
                                placeholder="John Doe" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <input 
                                type="email" 
                                name="email"
                                placeholder="name@company.com" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        <div className="d-flex align-center justify-center">
                            {loading ? (
                                <span>Creating Account...</span>
                            ) : (
                                <>
                                    <UserPlus size={20} className="mr-2" />
                                    <span>Register Account</span>
                                </>
                            )}
                        </div>
                    </button>
                </form>

                <div className="auth-footer">
                    Already registered? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
