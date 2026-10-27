import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Target, TrendingUp, Sparkles, Upload, BarChart3, CheckCircle, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAnalyze = () => navigate(user ? '/analyze' : '/auth');

    return (
        <div className="landing">
            <Navbar />

            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-orb hero-bg-orb-1" />
                <div className="hero-bg-orb hero-bg-orb-2" />
                <div className="container hero-inner">
                    <div className="badge badge-purple hero-badge">
                        <Sparkles size={14} />
                        Powered by AI
                    </div>
                    <h1 className="hero-title">
                        Transform Your Resume with{' '}
                        <span className="gradient-text">AI Intelligence</span>
                    </h1>
                    <p className="hero-desc">
                        Get instant, AI-driven feedback on your resume. Discover strengths, weaknesses,
                        and missing keywords to land your dream job.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={handleAnalyze}>
                            <Zap size={18} />
                            Analyze Resume Free
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                            Watch Demo
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        {[
                            { icon: Star, value: '98%', label: 'Accuracy Rate' },
                            { icon: BarChart3, value: '10K+', label: 'Resumes Analyzed' },
                            { icon: Clock, value: '24/7', label: 'AI Availability' },
                        ].map(({ icon: Icon, value, label }) => (
                            <div key={label} className="stat-card card">
                                <div className="stat-icon">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <div className="stat-value gradient-text">{value}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="hero-disclaimer">* Illustrative demo statistics for demonstration purposes</p>
                </div>
            </section>

            {/* Features */}
            <section className="section features" id="features">
                <div className="container">
                    <div className="text-center mb-section">
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>Features</div>
                        <h2 className="section-title">Powerful Features for <span className="gradient-text">Resume Success</span></h2>
                        <p className="section-desc">Everything you need to create a standout resume.</p>
                    </div>
                    <div className="cards-grid cards-grid-4 features-grid">
                        {[
                            { icon: Target, title: 'ATS Score Analysis', desc: 'Understand how well your resume matches ATS requirements.' },
                            { icon: TrendingUp, title: 'Keyword Matching', desc: 'Identify relevant keywords from your target job description.' },
                            { icon: Zap, title: 'Skill Gap Detection', desc: 'Discover skills you may need to develop for your target role.' },
                            { icon: Sparkles, title: 'AI-Powered Suggestions', desc: 'Get practical recommendations to improve your resume.' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="feature-card card">
                                <div className="feature-icon">
                                    <Icon size={24} />
                                </div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section how-it-works" id="how-it-works">
                <div className="container">
                    <div className="text-center mb-section">
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>Process</div>
                        <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
                        <p className="section-desc">Three simple steps to a stronger resume.</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { step: '01', icon: Upload, title: 'Upload Your Resume', desc: 'Upload your resume in PDF or DOCX format. It\'s quick and secure.' },
                            { step: '02', icon: Brain, title: 'Analyse Your Resume', desc: 'Our AI analyses your resume against your target job description instantly.' },
                            { step: '03', icon: TrendingUp, title: 'Improve Your Resume', desc: 'Get detailed recommendations and improve your resume to stand out.' },
                        ].map(({ step, icon: Icon, title, desc }) => (
                            <div key={step} className="step-card card">
                                <div className="step-number">{step}</div>
                                <div className="step-icon">
                                    <Icon size={28} />
                                </div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section benefits">
                <div className="container benefits-inner">
                    <div className="benefits-text">
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>Benefits</div>
                        <h2 className="section-title">Why Choose <span className="gradient-text">ResumeAI</span>?</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                            Our AI-powered platform helps you craft the perfect resume that gets noticed by employers and ATS systems alike.
                        </p>
                        {[
                            'Get instant feedback in seconds, not days',
                            'Tailored recommendations for your target role',
                            'Increase your interview callback rate',
                            'ATS-optimized resume scoring',
                            'Completely free to start analyzing',
                        ].map(item => (
                            <div key={item} className="benefit-item">
                                <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div className="benefits-visual">
                        <div className="visual-card card">
                            <div className="visual-score-ring">
                                <svg viewBox="0 0 120 120" className="score-ring-svg">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="8" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                                        strokeDasharray="314" strokeDashoffset="50" strokeLinecap="round"
                                        transform="rotate(-90 60 60)" />
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7C3AED" />
                                            <stop offset="100%" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="visual-score-text">
                                    <span className="visual-score-num gradient-text">84</span>
                                    <span className="visual-score-label">ATS Score</span>
                                </div>
                            </div>
                            <div className="visual-tags">
                                <span className="tag tag-purple">React.js ✓</span>
                                <span className="tag tag-purple">Python ✓</span>
                                <span className="tag tag-pink">SQL Missing</span>
                                <span className="tag tag-purple">Leadership ✓</span>
                                <span className="tag tag-pink">Docker Missing</span>
                            </div>
                            <div className="visual-bar-row">
                                <span>Keywords</span>
                                <div className="progress-bar" style={{ flex: 1 }}>
                                    <div className="progress-fill" style={{ width: '78%' }} />
                                </div>
                                <span>78%</span>
                            </div>
                            <div className="visual-bar-row">
                                <span>Skills</span>
                                <div className="progress-bar" style={{ flex: 1 }}>
                                    <div className="progress-fill" style={{ width: '85%' }} />
                                </div>
                                <span>85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-orb" />
                        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>Get Started Free</div>
                        <h2 className="section-title">Ready to Land Your <span className="gradient-text">Dream Job</span>?</h2>
                        <p className="section-desc" style={{ marginBottom: '32px' }}>
                            Join thousands of job seekers who improved their resumes with ResumeAI.
                        </p>
                        <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-lg" onClick={handleAnalyze}>
                                <Zap size={18} />
                                Start Analyzing Free
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/auth')}>
                                Create Account
                            </button>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '16px' }}>
                            No credit card required • Demo environment
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <div className="navbar-logo" style={{ marginBottom: '8px' }}>
                                <div className="navbar-logo-icon"><Brain size={18} /></div>
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>Resume<span className="gradient-text">AI</span></span>
                            </div>
                            <p>AI-powered resume analysis for your next career milestone.</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-col">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#how-it-works">How It Works</a>
                                <a href="#features">Pricing</a>
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="#">About</a>
                                <a href="#">Contact</a>
                                <a href="#">Privacy</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2024 ResumeAI. Demo application for educational purposes.</p>
                        <div className="flex gap-4">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
