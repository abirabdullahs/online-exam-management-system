import { RenderMath } from '../../utils/mathParser';

export default function QuestionDisplay({ question, selectedOption, onSelect, onClear, showFeedback, mode }) {
  const isPractice = mode === 'practice';
  const showCorrect = isPractice && showFeedback;

  const getOptionStyle = (opt) => {
    if (!showCorrect) {
      return selectedOption === opt.label ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300';
    }
    if (opt.label === question.correctOption) return 'border-green-600 bg-green-50';
    if (opt.label === selectedOption && selectedOption !== question.correctOption) return 'border-red-600 bg-red-50';
    return 'border-slate-200 opacity-60';
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-800 text-lg">
        <RenderMath text={question.questionText} />
      </p>
      {question.questionImageUrl && (
        <img src={question.questionImageUrl} alt="Question" className="max-w-full h-auto rounded border" onError={(e) => e.target.style.display = 'none'} />
      )}
      <div className="space-y-2">
        {question.options?.map(opt => (
          <button
            key={opt.label}
            onClick={() => !showCorrect && onSelect(opt.label)}
            className={`w-full text-left p-4 border rounded-lg transition ${getOptionStyle(opt)}`}
          >
            <span className="font-medium">{opt.label}.</span>{' '}
            <RenderMath text={opt.text} />
            {opt.imageUrl && (
              <img src={opt.imageUrl} alt="" className="mt-2 max-w-xs" onError={(e) => e.target.style.display = 'none'} />
            )}
          </button>
        ))}
      </div>
      {selectedOption && !showCorrect && (
        <button onClick={onClear} className="text-sm text-slate-500 hover:text-slate-700">
          Clear answer
        </button>
      )}
    </div>
  );
}
