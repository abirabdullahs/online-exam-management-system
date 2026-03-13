import { RenderMath } from '../../utils/mathParser';

export default function ResultReport({ result }) {
  const { score, answers: answerList } = result || {};

  return (
    <div className="space-y-6">
      {score && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">Correct</p>
            <p className="text-2xl font-bold text-green-800">{score.correct}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">Wrong</p>
            <p className="text-2xl font-bold text-red-800">{score.wrong}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-700">Skipped</p>
            <p className="text-2xl font-bold text-slate-800">{score.skipped}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-700">Final Score</p>
            <p className="text-2xl font-bold text-indigo-800">{score.finalScore} / {score.totalPossibleMarks}</p>
          </div>
        </div>
      )}

      {answerList && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Question Review</h2>
          {answerList.map((a, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-lg bg-white">
              <p className="text-slate-600 text-sm mb-2">Question {i + 1}</p>
              <p className="text-slate-800 mb-2"><RenderMath text={a.questionText} /></p>
              {a.questionImageUrl && (
                <img src={a.questionImageUrl} alt="" className="max-w-xs mb-2" onError={(e) => e.target.style.display = 'none'} />
              )}
              <div className="space-y-1">
                {a.options?.map(opt => {
                  let bg = '';
                  if (opt.label === a.correctOption) bg = 'bg-green-100 border-green-300';
                  else if (opt.label === a.selectedOption) bg = 'bg-red-100 border-red-300';
                  return (
                    <div key={opt.label} className={`p-2 rounded border ${bg}`}>
                      <span className="font-medium">{opt.label}.</span> <RenderMath text={opt.text} />
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-sm">
                Your answer: <span className="font-medium">{a.selectedOption || 'Skipped'}</span>
                {a.selectedOption && (
                  <span className={a.isCorrect ? ' text-green-600' : ' text-red-600'}>
                    {a.isCorrect ? ' ✓ Correct' : ' ✗ Wrong'}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
