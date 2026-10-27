import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, CheckCircle, Circle, Copy, Check, FileSearch, ArrowRight, BookOpen, Zap } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getLatestAnalysis, getImprovementProgress, saveImprovementProgress, getScoreColor } from '../utils/storage';
import './ImprovePage.css';

const tips = [
    'Use clear, descriptive headings for each resume section.',
    'Keep formatting consistent throughout — same font, text size, and date format.',
    'Use relevant keywords from the job description throughout your resume.',
    'Avoid spelling and grammar errors — proofread carefully.',
    'Focus on relevant skills and achievements for the target role.',
    'Keep your resume to 1–2 pages for most positions.',
    'Use active verbs: "Led", "Built", "Increased", "Designed".',
    'Quantify achievements wherever possible (e.g., "Increased sales by 35%").',
];

const beforeExp = 'Worked on the company website and fixed bugs.';
const afterExp = 'Led development of company website overhaul, reducing page load time by 40% and increasing user engagement by 25%.';

const beforeProject = 'Built a todo app using React.';
const afterProject = 'Developed a full-stack task management application using React, Node.js, and MongoDB, enabling real-time collaboration for teams of up to 20 users.';

const ImprovePage = () => {
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [progress, setProgress] = useState({});
    const [copied, setCopied] = useState('');

    useEffect(() => {
        setAnalysis(getLatestAnalysis());
        setProgress(getImprovementProgress());
    }, []);

    const toggleProgress = (key) => {
        const updated = { ...progress, [key]: !progress[key] };
        setProgress(updated);
        saveImprovementProgress(updated);
    };

    const copyToClipboard = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(key);
            setTimeout(() => setCopied(''), 2000);
        } catch {
            setCopied('');
        }
    };

    const completedCount = Object.values(progress).filter(Boolean).length;
    const totalTasks = tips.length + (analysis ? analysis.recommendations?.length || 0 : 0);

    if (!analysis) {
        return (
            <DashboardLayout>
                <div className="improve-page">
                    <div className="improve-header">
                        <h1>Improve Your <span className="gradient-text">Resume</span></h1>
                        <p>Turn your analysis insights into a stronger, job-ready resume.</p>
                    </div>
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon"><FileSearch size={32} /></div>
                            <h3>No Analysis Found</h3>
                            <p>Please analyze your resume first to get personalized improvement suggestions.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
                                <Zap size={16} /> Analyze My Resume
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const sampleSummaryImproved = `Results-driven ${analysis.jobRole || 'professional'} with a strong background in ${analysis.matchedSkills?.slice(0, 3).join(', ') || 'relevant technologies'}. Adept at delivering high-quality solutions and collaborating cross-functionally to achieve business goals.`;

    return (
        <DashboardLayout>
            <div className="improve-page">
                <div className="improve-header">
                    <h1>Improve Your <span className="gradient-text">Resume</span></h1>
                    <p>Turn your analysis insights into a stronger, job-ready resume.</p>
                </div>

                {/* Summary Banner */}
                <div className="card improve-summary">
                    <div className="improve-summary-left">
                        <div className="improve-score-badge" style={{ color: getScoreColor(analysis.atsScore) }}>
                            {analysis.atsScore}<span>/100</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>Latest ATS Score — {analysis.jobRole}</div>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                {analysis.recommendations?.length || 0} recommendations · {analysis.missingSkills?.length || 0} missing skills
                            </div>
                        </div>
                    </div>
                    <div className="improve-progress-info">
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                            Progress: {completedCount} / {totalTasks} completed
                        </div>
                        <div className="progress-bar" style={{ width: 180 }}>
                            <div className="progress-fill" style={{ width: `${(completedCount / totalTasks) * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Recommendations Checklist */}
                {analysis.recommendations?.length > 0 && (
                    <div className="card">
                        <h3 className="improve-section-title"><Lightbulb size={18} style={{ color: 'var(--color-warning)' }} /> Priority Improvements</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                            Check off each item as you complete it. Progress is saved automatically.
                        </p>
                        {analysis.recommendations.map((rec, i) => {
                            const key = `rec_${i}`;
                            return (
                                <div
                                    key={key}
                                    className={`checkbox-item ${progress[key] ? 'completed' : ''}`}
                                    onClick={() => toggleProgress(key)}
                                >
                                    {progress[key] ? (
                                        <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                                    ) : (
                                        <Circle size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                                    )}
                                    <span style={{ fontSize: '0.875rem' }}>{rec}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Professional Summary */}
                <div className="card">
                    <h3 className="improve-section-title">📝 Professional Summary Optimization</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                        A strong professional summary immediately tells recruiters why you are the right candidate.
                    </p>
                    <div className="before-after">
                        <div className="before-block">
                            <div className="ba-label">⚠️ Example Before (Generic)</div>
                            <p>Experienced professional looking for a challenging role in a dynamic organization.</p>
                        </div>
                        <ArrowRight size={20} style={{ color: 'var(--color-purple)', flexShrink: 0, margin: '0 8px' }} />
                        <div className="after-block">
                            <div className="ba-label">✅ Improved Version (Tailored)</div>
                            <p>{sampleSummaryImproved}</p>
                            <button className="btn btn-ghost btn-sm copy-btn" onClick={() => copyToClipboard(sampleSummaryImproved, 'summary')}>
                                {copied === 'summary' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Skills Optimization */}
                <div className="card">
                    <h3 className="improve-section-title">⚡ Skills Optimization</h3>
                    <div className="skills-improve-grid">
                        {analysis.matchedSkills?.length > 0 && (
                            <div>
                                <div className="skill-section-label" style={{ color: 'var(--color-success)', marginBottom: 10 }}>✅ Already Listed — Keep These</div>
                                <div className="keyword-tags-improve">
                                    {analysis.matchedSkills.map(s => (
                                        <span key={s} className="keyword-tag matched">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.missingSkills?.length > 0 && (
                            <div>
                                <div className="skill-section-label" style={{ color: 'var(--color-error)', marginBottom: 10 }}>❌ Missing — Add to Resume</div>
                                <div className="keyword-tags-improve">
                                    {analysis.missingSkills.map(s => (
                                        <span key={s} className="keyword-tag missing">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.suggestedSkills?.length > 0 && (
                            <div>
                                <div className="skill-section-label" style={{ color: 'var(--color-warning)', marginBottom: 10 }}>💡 Suggested — Consider Adding</div>
                                <div className="keyword-tags-improve">
                                    {analysis.suggestedSkills.map(s => (
                                        <span key={s} className="keyword-tag suggested">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Experience Enhancement */}
                <div className="card">
                    <h3 className="improve-section-title">💼 Experience Enhancement</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
                        Transform vague responsibilities into powerful, achievement-focused bullet points.
                    </p>
                    <div className="before-after">
                        <div className="before-block">
                            <div className="ba-label">❌ Weak (Responsibility-focused)</div>
                            <p>{beforeExp}</p>
                        </div>
                        <ArrowRight size={20} style={{ color: 'var(--color-purple)', flexShrink: 0 }} />
                        <div className="after-block">
                            <div className="ba-label">✅ Strong (Achievement-focused)</div>
                            <p>{afterExp}</p>
                            <button className="btn btn-ghost btn-sm copy-btn" onClick={() => copyToClipboard(afterExp, 'exp')}>
                                {copied === 'exp' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Description */}
                <div className="card">
                    <h3 className="improve-section-title">🚀 Project Description Improvement</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
                        Use action verbs, technical skills, and measurable results to make projects stand out.
                    </p>
                    <div className="before-after">
                        <div className="before-block">
                            <div className="ba-label">❌ Vague</div>
                            <p>{beforeProject}</p>
                        </div>
                        <ArrowRight size={20} style={{ color: 'var(--color-purple)', flexShrink: 0 }} />
                        <div className="after-block">
                            <div className="ba-label">✅ Detailed & Impactful</div>
                            <p>{afterProject}</p>
                            <button className="btn btn-ghost btn-sm copy-btn" onClick={() => copyToClipboard(afterProject, 'proj')}>
                                {copied === 'proj' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tips Checklist */}
                <div className="card">
                    <h3 className="improve-section-title"><BookOpen size={18} style={{ color: 'var(--color-purple)' }} /> Resume Writing Tips</h3>
                    {tips.map((tip, i) => {
                        const key = `tip_${i}`;
                        return (
                            <div
                                key={key}
                                className={`checkbox-item ${progress[key] ? 'completed' : ''}`}
                                onClick={() => toggleProgress(key)}
                            >
                                {progress[key] ? (
                                    <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                                ) : (
                                    <Circle size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                                )}
                                <span style={{ fontSize: '0.875rem' }}>{tip}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="improve-actions">
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
                        <FileSearch size={18} /> Re-Analyze Resume
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ImprovePage;
