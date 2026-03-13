import { useState } from 'react';
import { RenderMath } from '../../utils/mathParser';

const OPTIONS = ['A', 'B', 'C', 'D'];

export default function QuestionEditor({ onSave, onSaveAndClose, initialOrder, initialData }) {
  const [questionText, setQuestionText] = useState(initialData?.questionText || '');
  const [questionImageUrl, setQuestionImageUrl] = useState(initialData?.questionImageUrl || '');
  const [options, setOptions] = useState(
    initialData?.options?.length
      ? OPTIONS.map(l => {
          const o = initialData.options.find(x => x.label === l);
          return o ? { label: o.label, text: o.text || '', imageUrl: o.imageUrl || '' } : { label: l, text: '', imageUrl: '' };
        })
      : OPTIONS.map(l => ({ label: l, text: '', imageUrl: '' }))
  );
  const [correctOption, setCorrectOption] = useState(initialData?.correctOption || 'A');
  const [timeSeconds, setTimeSeconds] = useState(initialData?.timeSeconds ?? 0);

  const handleOptionChange = (label, field, value) => {
    setOptions(prev => prev.map(o =>
      o.label === label ? { ...o, [field]: value } : o
    ));
  };

  const handleSave = (andClose = false) => {
    const data = {
      questionText,
      questionImageUrl: questionImageUrl.trim() || '',
      options: options.map(o => ({
        label: o.label,
        text: o.text,
        imageUrl: (o.imageUrl || '').trim()
      })),
      correctOption,
      timeSeconds: Number(timeSeconds) || 0,
      order: initialData ? initialData.order : initialOrder
    };
    if (andClose) {
      onSaveAndClose?.(data);
    } else {
      onSave?.(data);
      if (!initialData) {
        setQuestionText('');
        setQuestionImageUrl('');
        setOptions(OPTIONS.map(l => ({ label: l, text: '', imageUrl: '' })));
        setCorrectOption('A');
        setTimeSeconds(0);
      }
    }
  };

  return (
    <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-white">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question text (LaTeX: $$...$$)</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Find $$x^2 + 1 = 0$$"
        />
        <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
          <span className="text-slate-600">Preview: </span>
          <RenderMath text={questionText} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Question image URL</label>
        <input
          type="url"
          value={questionImageUrl}
          onChange={(e) => setQuestionImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="https://..."
        />
        {questionImageUrl && (
          <img src={questionImageUrl} alt="Question" className="mt-2 max-w-xs h-24 object-contain border rounded" onError={(e) => e.target.style.display = 'none'} />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
        {OPTIONS.map(l => (
          <div key={l} className="mb-3 flex gap-2 items-start">
            <span className="font-medium w-6">{l}.</span>
            <div className="flex-1">
              <input
                value={options.find(o => o.label === l)?.text || ''}
                onChange={(e) => handleOptionChange(l, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-1"
                placeholder={`Option ${l}`}
              />
              <input
                value={options.find(o => o.label === l)?.imageUrl || ''}
                onChange={(e) => handleOptionChange(l, 'imageUrl', e.target.value)}
                className="w-full px-3 py-1 text-sm border border-slate-200 rounded"
                placeholder="Image URL (optional)"
              />
            </div>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="correctOption"
                value={l}
                checked={correctOption === l}
                onChange={() => setCorrectOption(l)}
              />
              <span className="text-sm">Correct</span>
            </label>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Time override (sec, 0 = use exam default)</label>
        <input
          type="number"
          value={timeSeconds}
          onChange={(e) => setTimeSeconds(e.target.value)}
          min={0}
          className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleSave(false)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save & Next
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}
