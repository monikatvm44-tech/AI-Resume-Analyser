import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, findAccount, saveAccount } from '../utils/storage';
import './AuthPage.css';

const DEMO_EMAIL = 'demo@resumeai.com';
const DEMO_PASS = 'Demo1234';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

    if (user) {
        navigate('/dashboard');
        return null;
    }

    const set = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        setErrors(e => ({ ...e, [k]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (mode === 'signup' && !form.name.trim()) errs.name = 'Full name is required.';
        if (!form.email.trim()) errs.email = 'Email is required.';
        else if (!validateEmail(form.email)) errs.email = 'Please enter a valid email.';
        if (!form.password) errs.password = 'Password is required.';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
        if (mode === 'signup') {
            if (!form.confirm) errs.confirm = 'Please confirm your password.';
            else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);

        await new Promise(r => setTimeout(r, 800));

        if (mode === 'login') {
            const isDemoLogin =
                form.email.toLowerCase() === DEMO_EMAIL && form.password === DEMO_PASS;
            const account = findAccount(form.email);
            if (isDemoLogin) {
                login({ email: DEMO_EMAIL, name: 'Demo User', isDemo: true });
                navigate('/dashboard');
            } else if (account && account.password === form.password) {
                login({ email: account.email, name: account.name });
                navigate('/dashboard');
            } else {
                setErrors({ general: 'Invalid email or password. Try the demo login below.' });
            }
        } else {
            const exists = findAccount(form.email);
            if (exists) {
                setErrors({ email: 'An account with this email already exists.' });
            } else {
                saveAccount({ email: form.email, name: form.name, password: form.password });
                login({ email: form.email, name: form.name });
                navigate('/dashboard');
            }
        }
        setLoading(false);
    };

    const demoLogin = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        login({ email: DEMO_EMAIL, name: 'Demo User', isDemo: true });
        navigate('/dashboard');
        setLoading(false);
    };

    const switchMode = (m) => {
        setMode(m);
        setErrors({});
        setForm({ name: '', email: '', password: '', confirm: '' });
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-orb auth-orb-1" />
            <div className="auth-bg-orb auth-orb-2" />

            <div className={`auth-card ${mode === 'signup' ? 'signup-mode' : ''}`}>
                {/* Left Panel - Form */}
                <div className="auth-left">
                    <div className="auth-logo">
                        <div className="sidebar-logo-icon" style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Brain size={18} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Resume<span className="gradient-text">AI</span></span>
                    </div>

                    <h2 className="auth-heading">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                    <p className="auth-subheading">
                        {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Start your AI resume journey.'}
                    </p>

                    {errors.general && (
                        <div className="auth-error-banner">{errors.general}</div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {mode === 'signup' && (
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <User size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                    />
                                </div>
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>
                        )}

                        <div className="input-group">
                            <div className="input-wrapper">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <Lock size={16} className="input-icon" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    className="has-right-icon"
                                />
                                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        {mode === 'signup' && (
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <Lock size={16} className="input-icon" />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Confirm Password"
                                        value={form.confirm}
                                        onChange={e => set('confirm', e.target.value)}
                                        className="has-right-icon"
                                    />
                                    <button type="button" className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirm && <span className="error-text">{errors.confirm}</span>}
                            </div>
                        )}

                        {mode === 'login' && (
                            <button type="button" className="auth-forgot">Forgot Password?</button>
                        )}

                        <button type="submit" className="btn btn-primary w-full auth-submit" disabled={loading}>
                            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : null}
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <>
                            <div className="auth-divider"><span>or</span></div>
                            <button className="btn btn-ghost w-full" onClick={demoLogin} disabled={loading}>
                                🎯 Use Demo Account
                            </button>
                            <p className="auth-demo-hint">
                                Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASS}</strong>
                            </p>
                        </>
                    )}

                    <p className="auth-switch-mobile">
                        {mode === 'login' ? (
                            <>Don&apos;t have an account? <button onClick={() => switchMode('signup')} className="auth-link">Sign Up</button></>
                        ) : (
                            <>Already have an account? <button onClick={() => switchMode('login')} className="auth-link">Sign In</button></>
                        )}
                    </p>

                    <p className="auth-disclaimer">
                        This demo uses browser LocalStorage — not for production use.
                    </p>
                </div>

                {/* Right Panel */}
                <div className="auth-right">
                    <div className="auth-right-orb" />
                    {mode === 'login' ? (
                        <>
                            <h2 className="auth-right-heading">Hello, Friend!</h2>
                            <p className="auth-right-desc">
                                Enter your personal details and start your journey with us.
                            </p>
                            <button className="btn auth-right-btn" onClick={() => switchMode('signup')}>
                                Sign Up <ArrowRight size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="auth-right-heading">Welcome Back!</h2>
                            <p className="auth-right-desc">
                                Already have an account? Sign in to continue your journey.
                            </p>
                            <button className="btn auth-right-btn" onClick={() => switchMode('login')}>
                                Sign In <ArrowRight size={16} />
                            </button>
                        </>
                    )}
                    <div className="auth-right-visual">
                        <div className="auth-visual-card">
                            <div className="auth-visual-score gradient-text">84</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>ATS Score</div>
                            <div className="progress-bar" style={{ marginTop: 8 }}>
                                <div className="progress-fill" style={{ width: '84%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
