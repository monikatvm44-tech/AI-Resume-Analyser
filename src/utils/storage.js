// LocalStorage keys
export const KEYS = {
  USER: 'resumeai_user',
  SESSION: 'resumeai_session',
  ACCOUNTS: 'resumeai_accounts',
  ANALYSES: 'resumeai_analyses',
  PROFILE: 'resumeai_profile',
  IMPROVEMENT_PROGRESS: 'resumeai_improvement_progress',
};

// Auth utilities
export const getSession = () => {
  try {
    const s = localStorage.getItem(KEYS.SESSION);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const setSession = (user) => {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION);
};

export const getAccounts = () => {
  try {
    const a = localStorage.getItem(KEYS.ACCOUNTS);
    return a ? JSON.parse(a) : [];
  } catch { return []; }
};

export const saveAccount = (account) => {
  const accounts = getAccounts();
  accounts.push(account);
  localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const findAccount = (email) => {
  const accounts = getAccounts();
  return accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
};

// Analysis utilities
export const getAnalyses = () => {
  try {
    const a = localStorage.getItem(KEYS.ANALYSES);
    return a ? JSON.parse(a) : [];
  } catch { return []; }
};

export const saveAnalysis = (analysis) => {
  const analyses = getAnalyses();
  analyses.unshift(analysis);
  localStorage.setItem(KEYS.ANALYSES, JSON.stringify(analyses.slice(0, 50)));
};

export const deleteAnalysis = (id) => {
  const analyses = getAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(KEYS.ANALYSES, JSON.stringify(analyses));
};

export const getLatestAnalysis = () => {
  const analyses = getAnalyses();
  return analyses.length > 0 ? analyses[0] : null;
};

// Profile utilities
export const getProfile = (email) => {
  try {
    const p = localStorage.getItem(KEYS.PROFILE + '_' + email);
    return p ? JSON.parse(p) : null;
  } catch { return null; }
};

export const saveProfile = (email, data) => {
  localStorage.setItem(KEYS.PROFILE + '_' + email, JSON.stringify(data));
};

// Improvement progress
export const getImprovementProgress = () => {
  try {
    const p = localStorage.getItem(KEYS.IMPROVEMENT_PROGRESS);
    return p ? JSON.parse(p) : {};
  } catch { return {}; }
};

export const saveImprovementProgress = (data) => {
  localStorage.setItem(KEYS.IMPROVEMENT_PROGRESS, JSON.stringify(data));
};

// Validation
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Score color helper
export const getScoreColor = (score) => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return '#60a5fa';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-error)';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Work';
};

// Date formatting
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
