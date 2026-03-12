import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authService.login(formData.email, formData.password);
            login(res.data);
            const role = res.data.role;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'DOCTOR') navigate('/doctor');
            else navigate('/patient');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
    <div className="auth-logo">🏥</div>
    <h1>SmartHMS Portal</h1>
    <p>Login to access your hospital dashboard</p>
</div>



                {error && (
                    <p style={{
                        color: 'red',
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '1px solid red',
                        borderRadius: '5px',
                        marginTop: '10px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </p>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading"><span className="spinner"></span> Signing in...</span>
                        ) : (
                            <span>🔑 Sign In</span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    New to SmartHMS? <a href="/signup">Register your account</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
