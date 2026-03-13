import { RenderMath } from '../../utils/mathParser';

export default function QuestionDisplay({ question, selectedOption, onSelect, onClear, showFeedback, mode }) {
  const isPractice = mode === 'practice';
  const showCorrect = isPractice && showFeedback;

  const getOptionStyle = (opt) => {
    const base = {
      width: '100%',
      textAlign: 'left',
      padding: '0.85rem 1rem',
      border: '1px solid',
      borderRadius: 12,
      cursor: showCorrect ? 'default' : 'pointer',
      transition: 'all 0.15s',
      background: 'transparent',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.65rem',
    };

    if (showCorrect) {
      if (opt.label === question.correctOption) {
        return { ...base, borderColor: 'rgba(34,197,94,0.5)', background: 'rgba(34,197,94,0.08)', cursor: 'default' };
      }
      if (opt.label === selectedOption && selectedOption !== question.correctOption) {
        return { ...base, borderColor: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.08)', cursor: 'default' };
      }
      return { ...base, borderColor: 'rgba(255,255,255,0.05)', opacity: 0.45, cursor: 'default' };
    }

    if (selectedOption === opt.label) {
      return { ...base, borderColor: 'rgba(99,102,241,0.6)', background: 'rgba(99,102,241,0.1)' };
    }
    return { ...base, borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' };
  };

  const getLabelColor = (opt) => {
    if (showCorrect) {
      if (opt.label === question.correctOption) return { color: '#4ade80', bg: 'rgba(34,197,94,0.15)' };
      if (opt.label === selectedOption) return { color: '#f87171', bg: 'rgba(239,68,68,0.15)' };
    }
    if (selectedOption === opt.label) return { color: '#818cf8', bg: 'rgba(99,102,241,0.2)' };
    return { color: '#475569', bg: 'rgba(255,255,255,0.04)' };
  };

  return (
    <div>
      <style>{`
        .option-btn:hover:not(:disabled) { border-color: rgba(99,102,241,0.35) !important; background: rgba(99,102,241,0.06) !important; }
      `}</style>

      {/* Question text */}
      <div style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem', fontWeight: 400 }}>
        <RenderMath text={question.questionText} />
      </div>

      {/* Question image */}
      {question.questionImageUrl && (
        <div style={{ marginBottom: '1.25rem' }}>
          <img
            src={question.questionImageUrl}
            alt="Question"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}
            onError={e => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {question.options?.map(opt => {
          const labelColors = getLabelColor(opt);
          return (
            <button
              key={opt.label}
              onClick={() => !showCorrect && onSelect(opt.label)}
              style={getOptionStyle(opt)}
              className="option-btn"
              disabled={showCorrect}
            >
              {/* Label badge */}
              <span style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: labelColors.bg,
                color: labelColors.color,
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.05rem',
                transition: 'all 0.15s',
              }}>
                {opt.label}
              </span>

              {/* Option content */}
              <div style={{ flex: 1 }}>
                <span style={{ color: showCorrect && opt.label === question.correctOption ? '#86efac' : showCorrect && opt.label === selectedOption ? '#fca5a5' : selectedOption === opt.label ? '#c7d2fe' : '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  <RenderMath text={opt.text} />
                </span>
                {opt.imageUrl && (
                  <img
                    src={opt.imageUrl}
                    alt=""
                    style={{ marginTop: '0.5rem', maxWidth: '200px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
              </div>

              {/* Correct / Wrong indicator */}
              {showCorrect && opt.label === question.correctOption && (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
                  <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.2)"/>
                  <path d="M5 8l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {showCorrect && opt.label === selectedOption && selectedOption !== question.correctOption && (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
                  <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.2)"/>
                  <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Clear answer */}
      {selectedOption && !showCorrect && (
        <button
          onClick={onClear}
          style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Clear answer
        </button>
      )}
    </div>
  );
}
