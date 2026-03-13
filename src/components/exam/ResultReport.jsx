import { RenderMath } from '../../utils/mathParser';

export default function ResultReport({ result }) {
  const { score, answers: answerList } = result || {};

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Score grid */}
      {score && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {[
            { label: 'Correct', value: score.correct, color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: '✓' },
            { label: 'Wrong', value: score.wrong, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '✗' },
            { label: 'Skipped', value: score.skipped, color: '#94a3b8', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', icon: '—' },
            { label: 'Final Score', value: `${score.finalScore}/${score.totalPossibleMarks}`, color: '#a5b4fc', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', icon: '★' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1rem', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: s.color, fontWeight: 700 }}>{s.icon}</span>
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Marks breakdown */}
      {score && (score.negativeDeducted > 0 || score.marksEarned > 0) && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Earned: <span style={{ color: '#4ade80', fontWeight: 600 }}>+{score.marksEarned}</span>
          </span>
          {score.negativeDeducted > 0 && (
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Deducted: <span style={{ color: '#f87171', fontWeight: 600 }}>−{score.negativeDeducted}</span>
            </span>
          )}
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Net: <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{score.finalScore}</span>
          </span>
        </div>
      )}

      {/* Question review */}
      {answerList && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Question Review</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {answerList.map((a, i) => {
              const status = !a.selectedOption ? 'skipped' : a.isCorrect ? 'correct' : 'wrong';
              const statusColors = {
                correct: { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', tag: '#4ade80', tagBg: 'rgba(34,197,94,0.12)' },
                wrong: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.18)', tag: '#f87171', tagBg: 'rgba(239,68,68,0.12)' },
                skipped: { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.07)', tag: '#64748b', tagBg: 'rgba(255,255,255,0.05)' },
              }[status];

              return (
                <div key={i} style={{ background: statusColors.bg, border: `1px solid ${statusColors.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Question header */}
                  <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', borderBottom: `1px solid ${statusColors.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.68rem', color: '#374151', fontWeight: 600 }}>Q{i + 1}</span>
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                        <RenderMath text={a.questionText} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: statusColors.tag, background: statusColors.tagBg, padding: '0.2rem 0.55rem', borderRadius: 5, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Wrong' : '— Skipped'}
                    </span>
                  </div>

                  {/* Image */}
                  {a.questionImageUrl && (
                    <div style={{ padding: '0 1rem 0.5rem' }}>
                      <img src={a.questionImageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}

                  {/* Options */}
                  <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {a.options?.map(opt => {
                      const isCorrect = opt.label === a.correctOption;
                      const isSelected = opt.label === a.selectedOption;
                      let optStyle = {};
                      if (isCorrect) optStyle = { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' };
                      else if (isSelected && !isCorrect) optStyle = { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' };
                      else optStyle = { background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' };

                      return (
                        <div key={opt.label} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.6rem', ...optStyle }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                            background: isCorrect ? 'rgba(34,197,94,0.2)' : isSelected && !isCorrect ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)',
                            color: isCorrect ? '#4ade80' : isSelected && !isCorrect ? '#f87171' : '#374151',
                            fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: isCorrect ? '#86efac' : isSelected && !isCorrect ? '#fca5a5' : '#475569' }}>
                            <RenderMath text={opt.text} />
                          </span>
                          {isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#4ade80' }}>✓ correct</span>}
                          {isSelected && !isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#f87171' }}>your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
