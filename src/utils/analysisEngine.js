// Demo analysis engine
// This generates illustrative demo analysis results based on the job description.
// It does NOT actually parse resume content - results are for demonstration purposes only.

const skillSets = {
    software: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'REST APIs', 'TypeScript', 'AWS'],
    data: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Tableau', 'Statistics', 'R', 'TensorFlow'],
    design: ['Figma', 'UI/UX Design', 'Adobe XD', 'Prototyping', 'User Research', 'CSS', 'Wireframing', 'Accessibility', 'Sketch'],
    marketing: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media', 'Email Marketing', 'CRM', 'Copywriting', 'A/B Testing'],
    management: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Stakeholder Management', 'JIRA', 'Risk Management', 'PMP'],
    default: ['Communication', 'Problem Solving', 'Teamwork', 'Analytical Thinking', 'Time Management', 'Attention to Detail'],
};

const detectDomain = (text) => {
    const t = text.toLowerCase();
    if (t.includes('software') || t.includes('developer') || t.includes('engineer') || t.includes('react') || t.includes('javascript')) return 'software';
    if (t.includes('data') || t.includes('analyst') || t.includes('machine learning') || t.includes('python')) return 'data';
    if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('figma')) return 'design';
    if (t.includes('marketing') || t.includes('seo') || t.includes('content')) return 'marketing';
    if (t.includes('manager') || t.includes('project') || t.includes('agile') || t.includes('scrum')) return 'management';
    return 'default';
};

const getRandomSubset = (arr, min, max) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

export const generateDemoAnalysis = (jobRole, jobDescription) => {
    const domain = detectDomain(`${jobRole} ${jobDescription}`);
    const domainSkills = skillSets[domain];
    const commonSkills = skillSets.default;

    const allSkills = [...domainSkills, ...commonSkills];
    const matchedSkills = getRandomSubset(allSkills, 4, 7);
    const missingSkills = getRandomSubset(allSkills.filter(s => !matchedSkills.includes(s)), 3, 5);
    const suggestedSkills = getRandomSubset(domainSkills.filter(s => !matchedSkills.includes(s) && !missingSkills.includes(s)), 2, 4);

    const atsScore = Math.floor(Math.random() * 30) + 55; // 55-84

    const keywords = jobDescription.split(/\s+/).filter(w => w.length > 5).slice(0, 10);
    const missingKeywords = getRandomSubset(keywords.length > 3 ? keywords : ['leadership', 'communication', 'results-driven', 'cross-functional', 'agile'], 2, 4);

    return {
        id: Date.now().toString(),
        jobRole,
        jobDescription: jobDescription.slice(0, 500),
        atsScore,
        date: new Date().toISOString(),
        matchedSkills,
        missingSkills,
        suggestedSkills,
        missingKeywords,
        strengths: [
            'Clear and professional formatting structure',
            'Relevant work experience sections included',
            'Educational background clearly presented',
            'Action verbs used in experience descriptions',
            'Contact information properly formatted',
        ].slice(0, Math.floor(Math.random() * 2) + 3),
        sectionFeedback: {
            summary: atsScore >= 70
                ? { rating: 'Good', comment: 'Your professional summary is concise and highlights key qualifications.' }
                : { rating: 'Needs Improvement', comment: 'Add a tailored professional summary that includes the job title and key skills.' },
            skills: { rating: 'Average', comment: `Add missing keywords like "${missingSkills.slice(0, 2).join(', ')}" to improve ATS score.` },
            experience: { rating: 'Good', comment: 'Use quantifiable achievements (e.g. "Increased sales by 20%") for stronger impact.' },
            education: { rating: 'Excellent', comment: 'Educational qualifications are clearly presented and relevant.' },
            projects: { rating: atsScore >= 65 ? 'Good' : 'Needs Improvement', comment: 'Include specific technologies used and measurable outcomes for each project.' },
        },
        recommendations: [
            `Add missing keywords: ${missingSkills.slice(0, 2).join(', ')} to target "${jobRole}" roles.`,
            'Quantify your achievements with specific numbers and percentages.',
            'Tailor your professional summary to match the job description.',
            'List your technical skills in a dedicated, clearly-labelled section.',
            'Use consistent formatting for dates and job titles throughout.',
            'Add links to relevant projects, GitHub, or portfolio.',
        ],
    };
};
