import { useState, useEffect } from 'react';

export default function ExamForm({ subjects, chapters, onSubmit, initialData, onCancel }) {
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [chapterId, setChapterId] = useState(initialData?.chapterId || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [marksPerCorrect, setMarksPerCorrect] = useState(initialData?.marksPerCorrect ?? 1);
  const [negativeMarks, setNegativeMarks] = useState(initialData?.negativeMarks ?? 0);
  const [defaultTimePerQuestion, setDefaultTimePerQuestion] = useState(initialData?.defaultTimePerQuestion ?? 60);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(initialData?.totalTimeSeconds ?? 1800);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);

  const filteredChapters = subjectId
    ? chapters.filter(c => c.subjectId === subjectId)
    : chapters;

  useEffect(() => {
    if (subjectId && !filteredChapters.find(c => c.id === chapterId)) {
      setChapterId('');
    }
  }, [subjectId, filteredChapters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSubject = subjects.find(s => s.id === subjectId);
    onSubmit({
      subjectId,
      chapterId,
      sessionId: selectedSubject?.sessionId,
      title,
      description,
      marksPerCorrect: Number(marksPerCorrect),
      negativeMarks: Number(negativeMarks),
      defaultTimePerQuestion: Number(defaultTimePerQuestion),
      totalTimeSeconds: Number(totalTimeSeconds),
      isPublished
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <select
          value={subjectId}
          onChange={(e) => { setSubjectId(e.target.value); setChapterId(''); }}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Chapter</label>
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select</option>
          {filteredChapters.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="MCQ Test - Chemical Bonding"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Marks per correct</label>
          <input
            type="number"
            value={marksPerCorrect}
            onChange={(e) => setMarksPerCorrect(e.target.value)}
            min={0}
            step={0.5}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Negative marks per wrong</label>
          <input
            type="number"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(e.target.value)}
            min={0}
            step={0.25}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default time per question (sec)</label>
          <input
            type="number"
            value={defaultTimePerQuestion}
            onChange={(e) => setDefaultTimePerQuestion(e.target.value)}
            min={0}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total exam time (sec)</label>
          <input
            type="number"
            value={totalTimeSeconds}
            onChange={(e) => setTotalTimeSeconds(e.target.value)}
            min={0}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isPublished" className="text-sm text-slate-700">Published (visible to students)</label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {initialData ? 'Update' : 'Create'} Exam
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
