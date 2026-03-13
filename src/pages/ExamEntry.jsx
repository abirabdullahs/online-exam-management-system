import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamByCode } from '../firebase/firestore';

export default function ExamEntry() {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState('');
  const [attemptAll, setAttemptAll] = useState(false);
  const [mode, setMode] = useState('practice');

  useEffect(() => {
    async function load() {
      const e = await getExamByCode(examCode);
      setExam(e);
      setLoading(false);
    }
    load();
  }, [examCode]);

  useEffect(() => {
    if (exam && attemptAll) {
      setQuestionCount(String(exam.totalQuestions));
    }
  }, [attemptAll, exam]);

  const handleStart = () => {
    const count = attemptAll ? exam.totalQuestions : parseInt(questionCount, 10);
    if (!count || count < 1 || count > exam.totalQuestions) {
      alert(`Please enter a number between 1 and ${exam.totalQuestions}`);
      return;
    }
    navigate(`/exam/${examCode}/session`, { state: { questionCount: count, mode } });
  };

  if (loading || !exam) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (exam.totalQuestions === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>No questions yet</h1>
          <p>This exam has no questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Sora', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .entry-card { animation: fadeUp 0.4s ease both; }
        .mode-card { border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: transparent; width: 100%; text-align: left; }
        .mode-card:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.04); }
        .mode-card.selected { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.08); }
        .start-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 12px; padding: 0.9rem; font-size: 0.95rem; font-weight: 600; width: 100%; cursor: pointer; transition: opacity 0.2s, transform 0.1s; font-family: inherit; letter-spacing: -0.01em; }
        .start-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .start-btn:active { transform: translateY(0); }
        .num-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #e2e8f0; padding: 0.6rem 0.85rem; font-size: 0.9rem; width: 80px; outline: none; font-family: inherit; transition: border-color 0.2s; }
        .num-input:focus { border-color: rgba(99,102,241,0.5); }
        .attempt-all-check { appearance: none; width: 16px; height: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; cursor: pointer; position: relative; flex-shrink: 0; transition: background 0.2s, border-color 0.2s; background: transparent; }
        .attempt-all-check:checked { background: #6366f1; border-color: #6366f1; }
        .attempt-all-check:checked::after { content: ''; position: absolute; left: 3px; top: 0px; width: 5px; height: 9px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(45deg); }
      `}</style>

      <div className="entry-card" style={{ width: '100%', maxWidth: 480 }}>
        {/* Back link */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 500 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Exams
        </a>

        {/* Card */}
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
          {/* Header band */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MCQ Exam</span>
            </div>
            <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#e2e8f0', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{exam.title}</h1>
            {exam.description && (
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.35rem' }}>{exam.description}</p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { label: 'Questions', value: exam.totalQuestions },
              { label: 'Per correct', value: `+${exam.marksPerCorrect}` },
              { label: 'Per wrong', value: exam.negativeMarks > 0 ? `−${exam.negativeMarks}` : 'None', red: exam.negativeMarks > 0 },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, padding: '0.85rem', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: stat.red ? '#f87171' : '#a5b4fc' }}>{stat.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.15rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Question count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
                QUESTIONS TO ATTEMPT
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => { setQuestionCount(e.target.value); setAttemptAll(false); }}
                  min={1}
                  max={exam.totalQuestions}
                  placeholder="e.g. 20"
                  className="num-input"
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={attemptAll}
                    onChange={(e) => setAttemptAll(e.target.checked)}
                    className="attempt-all-check"
                  />
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>All {exam.totalQuestions} questions</span>
                </label>
              </div>
            </div>

            {/* Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
                EXAM MODE
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  {
                    val: 'practice',
                    icon: '◎',
                    title: 'Practice Mode',
                    desc: 'No time limit. See correct/wrong after each answer.',
                    color: '#4ade80',
                  },
                  {
                    val: 'exam',
                    icon: '⏱',
                    title: 'Exam Mode',
                    desc: 'Timed. Results shown at the end.',
                    color: '#fb923c',
                  },
                ].map(m => (
                  <button
                    key={m.val}
                    onClick={() => setMode(m.val)}
                    className={`mode-card${mode === m.val ? ' selected' : ''}`}
                    style={{ fontFamily: 'inherit' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1rem', marginTop: '0.05rem', lineHeight: 1 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: mode === m.val ? '#e2e8f0' : '#94a3b8', marginBottom: '0.15rem' }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>{m.desc}</div>
                      </div>
                      {mode === m.val && (
                        <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStart} className="start-btn">
              Start Exam →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
