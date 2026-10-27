import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Target, Save, Trash2, Eye, LogOut, FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getProfile, saveProfile, getAnalyses, deleteAnalysis, getScoreColor, formatDate } from '../utils/storage';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState({ name: '', careerGoal: '', targetRole: '' });
    const [analyses, setAnalyses] = useState([]);
    const [saved, setSaved] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (user?.email) {
            const p = getProfile(user.email);
            setProfile({
                name: p?.name || user?.name || '',
                careerGoal: p?.careerGoal || '',
                targetRole: p?.targetRole || '',
            });
        }
        setAnalyses(getAnalyses());
    }, [user]);

    const handleSave = () => {
        if (user?.email) {
            saveProfile(user.email, profile);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
    };

    const handleDelete = (id) => {
        if (deleteConfirm === id) {
            deleteAnalysis(id);
            setAnalyses(getAnalyses());
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const handleViewAnalysis = (analysis) => {
        localStorage.setItem('resumeai_view_analysis', JSON.stringify(analysis));
        navigate('/analyze');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = profile.name
        ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <DashboardLayout>
            <div className="profile-page">
                <div className="profile-header">
                    <h1>Profile & <span className="gradient-text">History</span></h1>
                    <p>Manage your profile and view your analysis history.</p>
                </div>

                <div className="profile-grid">
                    {/* Profile Card */}
                    <div className="card profile-card">
                        <div className="profile-avatar-wrap">
                            <div className="profile-avatar">{initials}</div>
                            <div>
                                <div className="profile-display-name">{profile.name || user?.name || 'User'}</div>
                                <div className="profile-email">{user?.email}</div>
                            </div>
                        </div>

                        {user?.isDemo && (
                            <div className="demo-badge-info">
                                🎯 Demo Account — changes won&apos;t persist after session
                            </div>
                        )}

                        <div className="divider" />

                        <div className="profile-form">
                            <div className="input-group">
                                <label><User size={14} style={{ display: 'inline' }} /> Full Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="input-group">
                                <label><Mail size={14} style={{ display: 'inline' }} /> Email</label>
                                <input type="email" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
                            </div>

                            <div className="input-group">
                                <label><Target size={14} style={{ display: 'inline' }} /> Career Goal</label>
                                <input
                                    type="text"
                                    value={profile.careerGoal}
                                    onChange={e => setProfile(p => ({ ...p, careerGoal: e.target.value }))}
                                    placeholder="e.g. Land a senior engineering role at a top tech company"
                                />
                            </div>

                            <div className="input-group">
                                <label><Briefcase size={14} style={{ display: 'inline' }} /> Target Job Role</label>
                                <input
                                    type="text"
                                    value={profile.targetRole}
                                    onChange={e => setProfile(p => ({ ...p, targetRole: e.target.value }))}
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>

                            <button className="btn btn-primary w-full" onClick={handleSave}>
                                {saved ? <><Save size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                            </button>

                            <button className="btn btn-danger w-full" onClick={handleLogout}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Analysis History */}
                    <div className="profile-history">
                        <div className="card">
                            <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
                                <h3 className="history-title">Analysis History</h3>
                                <span className="badge badge-purple">{analyses.length} records</span>
                            </div>

                            {analyses.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon"><FileText size={32} /></div>
                                    <h3>No Analyses Yet</h3>
                                    <p>Start analyzing your resume to build your history.</p>
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/analyze')}>
                                        Analyze Resume
                                    </button>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {analyses.map((a) => (
                                        <div key={a.id} className="history-item">
                                            <div className="history-item-left">
                                                <div className="history-file">
                                                    <FileText size={16} style={{ color: 'var(--color-purple)', flexShrink: 0 }} />
                                                    <span>{a.filename || 'resume.pdf'}</span>
                                                </div>
                                                <div className="history-meta">
                                                    <span className="history-role">{a.jobRole}</span>
                                                    <span>·</span>
                                                    <span>{formatDate(a.date)}</span>
                                                </div>
                                            </div>
                                            <div className="history-item-right">
                                                <div className="history-score" style={{ color: getScoreColor(a.atsScore) }}>
                                                    {a.atsScore}<span>/100</span>
                                                </div>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleViewAnalysis(a)}
                                                    title="View analysis"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${deleteConfirm === a.id ? 'btn-danger' : 'btn-ghost'}`}
                                                    onClick={() => handleDelete(a.id)}
                                                    title={deleteConfirm === a.id ? 'Click again to confirm' : 'Delete'}
                                                >
                                                    <Trash2 size={14} />
                                                    {deleteConfirm === a.id ? 'Confirm' : ''}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
