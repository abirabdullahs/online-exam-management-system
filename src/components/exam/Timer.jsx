export default function Timer({ seconds, danger = false }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: danger ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 8,
      padding: '0.35rem 0.75rem',
      transition: 'all 0.3s',
    }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 12 12" style={{ color: danger ? '#f87171' : '#64748b' }}>
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontWeight: 600,
        fontSize: '0.88rem',
        color: danger ? '#f87171' : '#94a3b8',
        letterSpacing: '0.05em',
        animation: danger ? 'timerPulse 1s ease-in-out infinite' : 'none',
      }}>
        {str}
      </span>
      <style>{`@keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
    </div>
  );
}
