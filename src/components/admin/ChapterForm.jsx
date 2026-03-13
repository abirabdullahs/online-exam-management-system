import { useState } from 'react';
import { slugify } from '../../utils/slugify';

export default function ChapterForm({ subjects, onSubmit, initialData, onCancel }) {
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [name, setName] = useState(initialData?.name || '');
  const [order, setOrder] = useState(initialData?.order ?? 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = slugify(name);
    onSubmit({ subjectId, name, slug, order });
    if (!initialData) {
      setSubjectId('');
      setName('');
      setOrder(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          className="px-3 py-2 border border-slate-300 rounded-lg w-44 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 border border-slate-300 rounded-lg w-56 focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Chapter 1: Atomic Structure"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          min={0}
          className="px-3 py-2 border border-slate-300 rounded-lg w-20 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {initialData ? 'Update' : 'Add'} Chapter
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
