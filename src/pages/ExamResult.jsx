import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ResultReport from '../components/exam/ResultReport';
import { saveResult } from '../utils/localStorage';

export default function ExamResult() {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem(`examResult_${examCode}`);
    if (!data) { navigate(`/exam/${examCode}`); return; }
    setResult(JSON.parse(data));
  }, [examCode, navigate]);

  const handleSave = () => {
    if (!result) return;
    saveResult(examCode, result);
    setSaved(true);
  };

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pct = result.score
    ? Math.round((result.score.finalScore / (result.score.totalPossibleMarks || 1)) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .result-page { animation: fadeUp 0.35s ease both; }
        .action-btn { padding: 0.65rem 1.25rem; border-radius: 10px; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; }
        .save-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; }
        .save-btn:hover:not(:disabled) { opacity: 0.85; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .outline-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #64748b; }
        .outline-btn:hover { background: rgba(255,255,255,0.04); color: #94a3b8; border-color: rgba(255,255,255,0.15); }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0d14', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 14 14"><path d="M2 11L5 4l3 5 2-3 2 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0', letterSpacing: '-0.02em' }}>Proshno</span>
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#374151', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.25rem 0.65rem', borderRadius: 6, fontWeight: 500 }}>
          Result
        </span>
      </header>

      <main className="result-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        {/* Result hero */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6366f1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Exam Completed
              </p>
              <h1 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{result.examTitle}</h1>
              <p style={{ color: '#475569', fontSize: '0.8rem' }}>
                {result.subjectName && `${result.subjectName} · `}{result.chapterName}
                {' · '}{result.mode === 'practice' ? 'Practice' : 'Exam'} Mode
              </p>
            </div>
            {/* Percentage ring display */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `conic-gradient(#6366f1 ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#111118', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#a5b4fc' }}>{pct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ResultReport result={result} />

        {/* Action buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleSave} disabled={saved} className="action-btn save-btn">
            {saved ? (
              <><svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 7l3.5 3.5L12 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved for 30 days!</>
            ) : (
              <><svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1v7M4 5l3-3 3 3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>Save Result</>
            )}
          </button>
          <Link to={`/exam/${examCode}`} className="action-btn outline-btn">
            <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M6.5 1v6M3 3.5L6.5 1 10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="9" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.1"/></svg>
            Retry
          </Link>
          <Link to="/" className="action-btn outline-btn">
            <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M2 7h9M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
