import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// ─── paste your target examId here (or pass as prop) ───
const DEFAULT_EXAM_ID = '';

export default function BulkUpload() {
  const [examId, setExamId] = useState(DEFAULT_EXAM_ID);
  const [startOrder, setStartOrder] = useState(1);
  const [questions, setQuestions] = useState(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null); // null | 'preview' | 'uploading' | 'done' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed)) throw new Error('JSON must be an array');
        // basic validation
        parsed.forEach((q, i) => {
          if (!q.questionText) throw new Error(`Question ${i + 1}: missing questionText`);
          if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`Question ${i + 1}: must have exactly 4 options`);
          if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) throw new Error(`Question ${i + 1}: correctOption must be A/B/C/D`);
        });
        setQuestions(parsed);
        setStatus('preview');
        setErrorMsg('');
      } catch (err) {
        setErrorMsg(err.message);
        setStatus('error');
        setQuestions(null);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!examId.trim()) { setErrorMsg('examId is required'); setStatus('error'); return; }
    if (!questions || questions.length === 0) return;

    setStatus('uploading');
    setProgress(0);
    setUploadedCount(0);

    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await addDoc(collection(db, 'questions'), {
          examId: examId.trim(),
          order: startOrder + i,
          questionText: q.questionText || '',
          questionImageUrl: q.questionImageUrl || '',
          options: q.options.map(o => ({
            label: o.label,
            text: o.text || '',
            imageUrl: o.imageUrl || '',
          })),
          correctOption: q.correctOption,
          timeSeconds: q.timeSeconds ?? 0,
          createdAt: serverTimestamp(),
        });
        setUploadedCount(i + 1);
        setProgress(Math.round(((i + 1) / questions.length) * 100));
      }
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const reset = () => {
    setQuestions(null);
    setFileName('');
    setStatus(null);
    setProgress(0);
    setUploadedCount(0);
    setErrorMsg('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Sora', sans-serif", padding: '2rem 1rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .upload-card { animation: fadeUp 0.35s ease both; background: #111118; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; }
        .field-label { font-size: 0.72rem; font-weight: 600; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem; display: block; }
        .text-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #e2e8f0; padding: 0.6rem 0.9rem; font-size: 0.88rem; width: 100%; outline: none; font-family: inherit; transition: border-color 0.2s; box-sizing: border-box; }
        .text-input:focus { border-color: rgba(99,102,241,0.5); }
        .primary-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 10px; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.2s; width: 100%; }
        .primary-btn:hover:not(:disabled) { opacity: 0.88; }
        .primary-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ghost-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #64748b; border-radius: 10px; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .ghost-btn:hover { color: #94a3b8; border-color: rgba(255,255,255,0.18); }
        .q-row:nth-child(odd) { background: rgba(255,255,255,0.015); }
        .progress-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 4px; transition: width 0.2s; }
      `}</style>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6366f1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Admin Tool</p>
          <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#e2e8f0', letterSpacing: '-0.02em' }}>Bulk Question Upload</h1>
          <p style={{ color: '#475569', fontSize: '0.82rem', marginTop: '0.25rem' }}>JSON ফাইল দিয়ে একসাথে অনেক question upload করো Firestore-এ।</p>
        </div>

        {/* Config card */}
        <div className="upload-card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label className="field-label">Exam ID</label>
              <input
                className="text-input"
                value={examId}
                onChange={e => setExamId(e.target.value)}
                placeholder="e.g. Syd6u5bxsdJFGUNpbM5s"
              />
            </div>
            <div>
              <label className="field-label">Start Order #</label>
              <input
                className="text-input"
                type="number"
                value={startOrder}
                onChange={e => setStartOrder(Number(e.target.value))}
                style={{ width: 80 }}
                min={1}
              />
            </div>
          </div>
        </div>

        {/* File upload card */}
        {status !== 'done' && (
          <div className="upload-card" style={{ marginBottom: '1rem' }}>
            <label className="field-label">JSON File</label>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1.5px dashed rgba(99,102,241,0.25)', borderRadius: 12, padding: '2rem',
              cursor: 'pointer', transition: 'border-color 0.2s', background: 'rgba(99,102,241,0.03)',
              gap: '0.5rem',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28" style={{ color: '#4a4a6a' }}>
                <path d="M14 4v14M8 10l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 20v2a1 1 0 001 1h16a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                {fileName ? <span style={{ color: '#a5b4fc' }}>{fileName}</span> : 'Click to select JSON file'}
              </span>
              <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
            </label>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.85rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>
            ✗ {errorMsg}
          </div>
        )}

        {/* Preview */}
        {(status === 'preview' || status === 'uploading') && questions && (
          <div className="upload-card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.92rem' }}>{questions.length} questions ready</span>
                <span style={{ color: '#374151', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
                  → orders {startOrder} to {startOrder + questions.length - 1}
                </span>
              </div>
              <button className="ghost-btn" onClick={reset} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                Clear
              </button>
            </div>

            {/* Question list preview */}
            <div style={{ maxHeight: 320, overflowY: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              {questions.map((q, i) => (
                <div key={i} className="q-row" style={{ padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4a4a6a', minWidth: 28, paddingTop: '0.05rem' }}>
                    {startOrder + i}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', flex: 1, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {q.questionText}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80', background: 'rgba(34,197,94,0.1)', padding: '0.15rem 0.45rem', borderRadius: 5, flexShrink: 0 }}>
                    {q.correctOption}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar during upload */}
            {status === 'uploading' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Uploading...</span>
                  <span style={{ fontSize: '0.78rem', color: '#a5b4fc' }}>{uploadedCount} / {questions.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Done state */}
        {status === 'done' && (
          <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, padding: '1.5rem', textAlign: 'center', marginBottom: '1rem', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
            <p style={{ fontWeight: 600, color: '#4ade80', fontSize: '1rem', marginBottom: '0.25rem' }}>
              {uploadedCount} questions uploaded!
            </p>
            <p style={{ color: '#374151', fontSize: '0.82rem', marginBottom: '1rem' }}>
              Exam ID: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{examId}</span>
              {' · '}Orders {startOrder}–{startOrder + uploadedCount - 1}
            </p>
            <button className="ghost-btn" onClick={reset}>Upload More</button>
          </div>
        )}

        {/* Upload button */}
        {status === 'preview' && (
          <button
            className="primary-btn"
            onClick={handleUpload}
            disabled={!examId.trim() || !questions}
          >
            Upload {questions?.length} Questions to Firestore →
          </button>
        )}

        {status === 'uploading' && (
          <button className="primary-btn" disabled>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Uploading {uploadedCount}/{questions?.length}...
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
