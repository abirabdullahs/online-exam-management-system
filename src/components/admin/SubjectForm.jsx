import { useState } from 'react';
import { slugify } from '../../utils/slugify';

export default function SubjectForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [order, setOrder] = useState(initialData?.order ?? 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = slugify(name);
    onSubmit({ name, slug, order });
    if (!initialData) {
      setName('');
      setOrder(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 border border-slate-300 rounded-lg w-48 focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Chemistry"
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
          {initialData ? 'Update' : 'Add'} Subject
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
