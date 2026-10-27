import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, AlertCircle, CheckCircle, XCircle, ChevronRight, Lightbulb, RotateCcw, LayoutDashboard, Zap, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { generateDemoAnalysis } from '../utils/analysisEngine';
import { saveAnalysis, getScoreColor, getScoreLabel } from '../utils/storage';
import './AnalyzePage.css';

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXT = ['.pdf', '.docx'];

const AnalyzePage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        const ext = '.' + f.name.split('.').pop().toLowerCase();
        if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.includes(ext)) {
            setErrors(e => ({ ...e, file: 'Only PDF and DOCX files are supported.' }));
            return;
        }
        setFile(f);
        setErrors(e => ({ ...e, file: '' }));
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const validate = () => {
        const errs = {};
        if (!file) errs.file = 'Please upload your resume file.';
        if (!jobRole.trim()) errs.jobRole = 'Job role is required.';
        if (!jobDesc.trim()) errs.jobDesc = 'Job description is required.';
        else if (jobDesc.trim().length < 20) errs.jobDesc = 'Please provide a more detailed job description.';
        return errs;
    };

    const analyze = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setResults(null);
        await new Promise(r => setTimeout(r, 2200));
        const analysis = generateDemoAnalysis(jobRole, jobDesc);
        analysis.filename = file.name;
        saveAnalysis(analysis);
        setResults(analysis);
        setLoading(false);
        setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const reset = () => {
        setFile(null);
        setJobRole('');
        setJobDesc('');
        setResults(null);
        setErrors({});
    };

    const scoreColor = results ? getScoreColor(results.atsScore) : '#fff';

    const sectionRatingColor = (r) => {
        if (r === 'Excellent') return 'var(--color-success)';
        if (r === 'Good') return '#60a5fa';
        if (r === 'Average') return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    return (
        <DashboardLayout>
            <div className="analyze-page">
                {/* Header */}
                <div className="analyze-header">
                    <h1>AI Resume <span className="gradient-text">Analyzer</span></h1>
                    <p>Discover how well your resume matches your dream job.</p>
                    <div className="demo-notice">
                        <Info size={14} />
                        <span>Demo Mode: Results are illustrative examples, not real AI analysis of your resume content.</span>
                    </div>
                </div>

                {/* Upload Card */}
                <div className="card analyze-upload-card">
                    {/* Drop Zone */}
                    <div
                        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                        onClick={() => !file && fileRef.current.click()}
                    >
                        {file ? (
                            <div className="file-selected">
                                <FileText size={32} style={{ color: 'var(--color-purple)' }} />
                                <div>
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
                                </div>
                                <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); setFile(null); }}>
                                    <X size={14} /> Remove
                                </button>
                            </div>
                        ) : (
                            <div className="drop-zone-content">
                                <div className="drop-icon"><Upload size={32} /></div>
                                <h3>Drag & drop your resume here</h3>
                                <p>PDF and DOCX files supported</p>
                                <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                                    Browse Files
                                </button>
                            </div>
                        )}
                    </div>
                    {errors.file && <span className="error-text">{errors.file}</span>}

                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.docx"
                        style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files[0])}
                    />

                    <div className="analyze-form-fields">
                        <div className="input-group">
                            <label>Target Job Role *</label>
                            <input
                                type="text"
                                placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
                                value={jobRole}
                                onChange={e => { setJobRole(e.target.value); setErrors(x => ({ ...x, jobRole: '' })); }}
                            />
                            {errors.jobRole && <span className="error-text">{errors.jobRole}</span>}
                        </div>

                        <div className="input-group">
                            <label>Job Description *</label>
                            <textarea
                                rows={5}
                                placeholder="Paste the job description here. Include responsibilities, requirements, and required skills..."
                                value={jobDesc}
                                onChange={e => { setJobDesc(e.target.value); setErrors(x => ({ ...x, jobDesc: '' })); }}
                                style={{ minHeight: 120 }}
                            />
                            {errors.jobDesc && <span className="error-text">{errors.jobDesc}</span>}
                        </div>

                        <div className="analyze-actions">
                            <button className="btn btn-primary btn-lg" onClick={analyze} disabled={loading}>
                                {loading ? (
                                    <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
                                ) : (
                                    <><Zap size={18} /> Analyze Resume</>
                                )}
                            </button>
                            {(file || jobRole || jobDesc || results) && (
                                <button className="btn btn-ghost" onClick={reset} disabled={loading}>
                                    <RotateCcw size={16} /> Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner" style={{ width: 48, height: 48 }} />
                            <h3>Analyzing your resume...</h3>
                            <p>Checking ATS compatibility, keywords, and skills match.</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                {results && !loading && (
                    <div id="results-section" className="results-section animate-fade-up">
                        {/* Score */}
                        <div className="card results-score-card">
                            <h2 className="results-section-title">Overall ATS Compatibility Score</h2>
                            <div className="score-display">
                                <div className="score-circle-wrap">
                                    <svg viewBox="0 0 120 120" className="score-svg">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="10" />
                                        <circle
                                            cx="60" cy="60" r="50" fill="none"
                                            stroke="url(#sg)"
                                            strokeWidth="10"
                                            strokeDasharray="314"
                                            strokeDashoffset={314 - (314 * results.atsScore / 100)}
                                            strokeLinecap="round"
                                            transform="rotate(-90 60 60)"
                                        />
                                        <defs>
                                            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#7C3AED" />
                                                <stop offset="100%" stopColor="#EC4899" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="score-inner">
                                        <span className="score-num" style={{ color: scoreColor }}>{results.atsScore}</span>
                                        <span className="score-denom">/100</span>
                                        <span className="score-label" style={{ color: scoreColor }}>{getScoreLabel(results.atsScore)}</span>
                                    </div>
                                </div>
                                <div className="score-meta">
                                    <div><span className="meta-label">Resume File:</span> {results.filename}</div>
                                    <div><span className="meta-label">Target Role:</span> {results.jobRole}</div>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: 8 }}>
                                        {results.atsScore >= 75
                                            ? '✅ Your resume is well-optimized for this role!'
                                            : results.atsScore >= 55
                                                ? '⚠️ Good start — a few improvements will boost your score.'
                                                : '❗ Significant improvements needed to pass ATS filters.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="results-grid">
                            {/* Strengths */}
                            <div className="card">
                                <h3 className="results-section-title"><CheckCircle size={18} style={{ color: 'var(--color-success)' }} /> Resume Strengths</h3>
                                <ul className="result-list">
                                    {results.strengths.map((s, i) => (
                                        <li key={i} className="result-list-item success">
                                            <CheckCircle size={14} /> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Missing Keywords */}
                            <div className="card">
                                <h3 className="results-section-title"><XCircle size={18} style={{ color: 'var(--color-error)' }} /> Missing Keywords</h3>
                                <div className="keyword-tags">
                                    {results.missingKeywords.map(k => (
                                        <span key={k} className="keyword-tag missing">{k}</span>
                                    ))}
                                </div>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: 12 }}>
                                    Add these keywords naturally to your resume to improve ATS matching.
                                </p>
                            </div>

                            {/* Skills Match */}
                            <div className="card">
                                <h3 className="results-section-title" style={{ marginBottom: 16 }}>Skills Match</h3>
                                <div style={{ marginBottom: 12 }}>
                                    <div className="skill-section-label success">✅ Matched Skills</div>
                                    <div className="keyword-tags">
                                        {results.matchedSkills.map(s => (
                                            <span key={s} className="keyword-tag matched">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="skill-section-label missing">❌ Missing Skills</div>
                                    <div className="keyword-tags">
                                        {results.missingSkills.map(s => (
                                            <span key={s} className="keyword-tag missing">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                {results.suggestedSkills.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        <div className="skill-section-label" style={{ color: 'var(--color-warning)' }}>💡 Suggested Skills</div>
                                        <div className="keyword-tags">
                                            {results.suggestedSkills.map(s => (
                                                <span key={s} className="keyword-tag suggested">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section Feedback */}
                            <div className="card">
                                <h3 className="results-section-title">Resume Section Feedback</h3>
                                {Object.entries(results.sectionFeedback).map(([key, { rating, comment }]) => (
                                    <div key={key} className="section-feedback-item">
                                        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{key === 'summary' ? 'Professional Summary' : key}</span>
                                            <span className="badge" style={{
                                                background: `${sectionRatingColor(rating)}20`,
                                                color: sectionRatingColor(rating),
                                                border: `1px solid ${sectionRatingColor(rating)}40`,
                                                fontSize: '0.7rem',
                                                padding: '3px 10px'
                                            }}>{rating}</span>
                                        </div>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.825rem' }}>{comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="card">
                            <h3 className="results-section-title"><Lightbulb size={18} style={{ color: 'var(--color-warning)' }} /> Improvement Recommendations</h3>
                            <div className="recommendations-list">
                                {results.recommendations.map((r, i) => (
                                    <div key={i} className="recommendation-item">
                                        <div className="rec-number">{i + 1}</div>
                                        <p>{r}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="results-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/improve')}>
                                <Lightbulb size={18} /> Improve My Resume
                            </button>
                            <button className="btn btn-secondary" onClick={reset}>
                                <RotateCcw size={16} /> Analyze Another Resume
                            </button>
                            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                                <LayoutDashboard size={16} /> Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AnalyzePage;
