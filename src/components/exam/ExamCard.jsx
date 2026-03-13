import { Link } from 'react-router-dom';

const SUBJECT_COLORS = [
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', accent: '#818cf8', dot: '#6366f1' },
  { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)', accent: '#2dd4bf', dot: '#14b8a6' },
  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', accent: '#fbbf24', dot: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', accent: '#f87171', dot: '#ef4444' },
  { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', accent: '#c084fc', dot: '#a855f7' },
  { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', accent: '#4ade80', dot: '#22c55e' },
];

function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

export default function ExamCard({ exam, subjectName, chapterName }) {
  const color = getColor(exam.subjectId || subjectName);

  return (
    <Link
      to={`/exam/${exam.examCode}`}
      style={{
        display: 'block',
        background: '#111118',
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 16,
        padding: '1.25rem',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color.border;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${color.dot}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color.dot}, transparent)`, opacity: 0.6 }} />

      {/* Subject badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color.dot, flexShrink: 0 }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: color.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {subjectName}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.4, marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
        {exam.title}
      </h3>

      {/* Chapter */}
      <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1rem' }}>
        {chapterName}
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
          {exam.totalQuestions} questions
        </span>
        <span style={{ fontSize: '0.72rem', color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
          +{exam.marksPerCorrect} each
        </span>
        {exam.negativeMarks > 0 && (
          <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
            −{exam.negativeMarks} wrong
          </span>
        )}
      </div>

      {/* Arrow */}
      <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', color: '#374151' }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </Link>
  );
}
