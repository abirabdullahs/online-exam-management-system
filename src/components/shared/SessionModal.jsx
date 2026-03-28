const STORAGE_KEY = 'proshno_selected_session';

export function getStoredSession() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredSession(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (e) {}
}

export default function SessionModal({ onSelect }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '2.5rem',
          maxWidth: 420,
          width: '90%',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Select your exam session
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => { setStoredSession('SSC'); onSelect('SSC'); }}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            SSC
          </button>
          <button
            onClick={() => { setStoredSession('HSC'); onSelect('HSC'); }}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            HSC
          </button>
        </div>
      </div>
    </div>
  );
}
