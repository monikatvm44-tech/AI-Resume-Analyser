import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Lightbulb, History, TrendingUp, Calendar, BarChart2, Zap, Brain, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getAnalyses, formatDate, getScoreColor, getScoreLabel } from '../utils/storage';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [analyses, setAnalyses] = useState([]);

    useEffect(() => {
        setAnalyses(getAnalyses());
    }, []);

    const avgScore = analyses.length > 0
        ? Math.round(analyses.reduce((s, a) => s + a.atsScore, 0) / analyses.length)
        : 0;

    const totalSuggestions = analyses.reduce((s, a) => s + (a.recommendations?.length || 0), 0);
    const lastDate = analyses.length > 0 ? formatDate(analyses[0].date) : 'Never';

    const stats = [
        { icon: FileSearch, label: 'Resumes Analyzed', value: analyses.length, color: 'var(--color-purple)' },
        { icon: BarChart2, label: 'Average ATS Score', value: avgScore ? `${avgScore}%` : '—', color: getScoreColor(avgScore) },
        { icon: Lightbulb, label: 'Total Suggestions', value: totalSuggestions || '—', color: 'var(--color-warning)' },
        { icon: Calendar, label: 'Last Analysis', value: lastDate, color: 'var(--color-pink)' },
    ];

    return (
        <DashboardLayout>
            <div className="dashboard">
                {/* Welcome */}
                <div className="dashboard-welcome">
                    <div>
                        <h1>Welcome Back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}!</span></h1>
                        <p>Track your resume performance and get ready for your next career opportunity.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
                        <Plus size={18} />
                        Analyze New Resume
                    </button>
                </div>

                {/* Stats */}
                <div className="cards-grid cards-grid-4" style={{ marginBottom: 32 }}>
                    {stats.map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="card stat-dash-card">
                            <div className="stat-dash-icon" style={{ background: `${color}20`, color }}>
                                <Icon size={22} />
                            </div>
                            <div className="stat-dash-value">{value}</div>
                            <div className="stat-dash-label">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Recent Analyses */}
                    <div className="card dashboard-main-card">
                        <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
                            <h3 className="dash-card-title">Recent Analyses</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>View All</button>
                        </div>

                        {analyses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"><Brain size={32} /></div>
                                <h3>No analyses yet</h3>
                                <p>Upload your resume to get your first ATS score.</p>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate('/analyze')}>
                                    Analyze My Resume
                                </button>
                            </div>
                        ) : (
                            <div className="recent-list">
                                {analyses.slice(0, 5).map((a) => (
                                    <div key={a.id} className="recent-item">
                                        <div className="recent-item-info">
                                            <div className="recent-file">📄 {a.jobRole || 'Resume Analysis'}</div>
                                            <div className="recent-date">{formatDate(a.date)}</div>
                                        </div>
                                        <div className="recent-score" style={{ color: getScoreColor(a.atsScore) }}>
                                            <span className="recent-score-val">{a.atsScore}</span>
                                            <span className="recent-score-label">/ 100</span>
                                        </div>
                                        <span className="badge" style={{
                                            background: `${getScoreColor(a.atsScore)}20`,
                                            color: getScoreColor(a.atsScore),
                                            border: `1px solid ${getScoreColor(a.atsScore)}40`,
                                            fontSize: '0.75rem',
                                            padding: '4px 10px'
                                        }}>
                                            {getScoreLabel(a.atsScore)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions + ATS Overview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="dash-card-title" style={{ marginBottom: 16 }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button className="btn btn-primary w-full" onClick={() => navigate('/analyze')}>
                                    <FileSearch size={18} /> Analyze Resume
                                </button>
                                <button className="btn btn-secondary w-full" onClick={() => navigate('/improve')}>
                                    <Lightbulb size={18} /> Improve My Resume
                                </button>
                                <button className="btn btn-ghost w-full" onClick={() => navigate('/profile')}>
                                    <History size={18} /> View Analysis History
                                </button>
                            </div>
                        </div>

                        {/* ATS Overview */}
                        {analyses.length > 0 && (
                            <div className="card">
                                <h3 className="dash-card-title" style={{ marginBottom: 16 }}>ATS Score Overview</h3>
                                {analyses.slice(0, 3).map((a) => (
                                    <div key={a.id} style={{ marginBottom: 14 }}>
                                        <div className="flex justify-between" style={{ marginBottom: 6, fontSize: '0.8rem' }}>
                                            <span style={{ color: 'var(--color-text-secondary)' }}>{a.jobRole}</span>
                                            <span style={{ color: getScoreColor(a.atsScore), fontWeight: 700 }}>{a.atsScore}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${a.atsScore}%` }} />
                                        </div>
                                    </div>
                                ))}
                                <button className="btn btn-ghost btn-sm w-full" onClick={() => navigate('/analyze')}>
                                    <TrendingUp size={16} /> New Analysis
                                </button>
                            </div>
                        )}

                        {/* Resume Improvement Progress */}
                        <div className="card">
                            <h3 className="dash-card-title" style={{ marginBottom: 14 }}>Resume Improvement</h3>
                            {analyses.length > 0 ? (
                                <>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 12 }}>
                                        Your latest analysis has {analyses[0]?.recommendations?.length || 0} actionable recommendations.
                                    </p>
                                    <button className="btn btn-primary btn-sm w-full" onClick={() => navigate('/improve')}>
                                        <Zap size={16} /> View Improvements
                                    </button>
                                </>
                            ) : (
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                    Complete an analysis to see improvement suggestions.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
