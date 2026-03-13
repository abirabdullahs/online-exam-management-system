import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSavedResults, deleteSavedResult, clearAllSavedResults } from '../utils/localStorage';
import ResultReport from '../components/exam/ResultReport';

export default function SavedResults() {
  const [results, setResults] = useState([]);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    setResults(getAllSavedResults());
  }, []);

  const handleDelete = (key) => {
    deleteSavedResult(key);
    setResults(getAllSavedResults());
    setExpandedKey(null);
  };

  const handleClearAll = () => {
    if (!confirm('Delete all saved results?')) return;
    clearAllSavedResults();
    setResults([]);
  };

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch { return '-'; }
  };

  const daysLeft = (r) => {
    if (!r.expiresAt) return null;
    const days = Math.ceil((r.expiresAt - Date.now()) / (86400 * 1000));
    return Math.max(0, days);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .result-row { animation: fadeUp 0.3s ease both; }
        .expand-btn { width: 100%; padding: 1rem 1.25rem; background: transparent; border: none; cursor: pointer; font-family: inherit; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; transition: background 0.15s; }
        .expand-btn:hover { background: rgba(255,255,255,0.02); }
        .delete-link { font-size: 0.78rem; color: #7f1d1d; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.15s; }
        .delete-link:hover { color: #f87171; }
        .clear-btn { font-size: 0.78rem; color: #374151; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); padding: 0.35rem 0.75rem; border-radius: 7px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .clear-btn:hover { color: #f87171; border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.1); }
        .nav-link { color: #475569; font-size: 0.82rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; transition: color 0.15s; }
        .nav-link:hover { color: #94a3b8; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0d14', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 14 14"><path d="M2 11L5 4l3 5 2-3 2 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0', letterSpacing: '-0.02em' }}>Proshno</span>
        </Link>
        <Link to="/" className="nav-link">
          <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M8 2L3 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Exams
        </Link>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
        {/* Page title */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6366f1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Local Storage</p>
            <h1 style={{ fontWeight: 700, fontSize: '1.4rem', color: '#e2e8f0', letterSpacing: '-0.02em' }}>Saved Results</h1>
          </div>
          {results.length > 0 && (
            <button onClick={handleClearAll} className="clear-btn">Clear All</button>
          )}
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.3 }}>◉</div>
            <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>
              No saved results yet.<br />
              Complete an exam and hit "Save Result" to see it here.
            </p>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem', color: '#6366f1', fontSize: '0.85rem', textDecoration: 'none', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '0.5rem 1rem', borderRadius: 8 }}>
              Browse Exams →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {results.map((r, idx) => {
              const pct = r.score
                ? Math.round((r.score.finalScore / (r.score.totalPossibleMarks || 1)) * 100)
                : 0;
              const days = daysLeft(r);
              const isExpanded = expandedKey === r._key;

              return (
                <div
                  key={r._key}
                  className="result-row"
                  style={{ animationDelay: `${idx * 0.04}s`, background: '#111118', border: `1px solid ${isExpanded ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}
                >
                  <button
                    className="expand-btn"
                    onClick={() => setExpandedKey(isExpanded ? null : r._key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      {/* Score ring */}
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: `conic-gradient(#6366f1 ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#111118', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#a5b4fc' }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.examTitle}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', color: '#374151' }}>{formatDate(r.attemptedAt)}</span>
                          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#2d2d3a' }} />
                          <span style={{ fontSize: '0.7rem', color: r.mode === 'practice' ? '#4ade80' : '#fb923c', background: r.mode === 'practice' ? 'rgba(34,197,94,0.08)' : 'rgba(251,146,60,0.08)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                            {r.mode}
                          </span>
                          {days !== null && days <= 7 && (
                            <span style={{ fontSize: '0.68rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                              Expires in {days}d
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score chips */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                      {r.score && (
                        <>
                          <span style={{ fontSize: '0.68rem', color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '0.15rem 0.45rem', borderRadius: 5 }}>✓{r.score.correct}</span>
                          <span style={{ fontSize: '0.68rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '0.15rem 0.45rem', borderRadius: 5 }}>✗{r.score.wrong}</span>
                        </>
                      )}
                      <svg width="14" height="14" fill="none" viewBox="0 0 14 14" style={{ color: '#374151', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ paddingTop: '1rem' }}>
                        <ResultReport result={r} />
                      </div>
                      <button onClick={() => handleDelete(r._key)} className="delete-link" style={{ marginTop: '1rem' }}>
                        Delete this result
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
