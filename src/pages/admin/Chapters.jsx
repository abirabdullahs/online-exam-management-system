import { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import ChapterForm from '../../components/admin/ChapterForm';
import { getSubjects, getChapters, addChapter, updateChapter, deleteChapter } from '../../firebase/firestore';

export default function Chapters() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([getSubjects(), getChapters()]);
    setSubjects(s);
    setChapters(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdd = async (data) => {
    await addChapter(data);
    showToast('Chapter added!');
    load();
  };

  const handleUpdate = async (data) => {
    await updateChapter(editingId, data);
    showToast('Chapter updated!');
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this chapter?')) return;
    await deleteChapter(id);
    showToast('Chapter deleted!');
    load();
  };

  const filtered = subjectFilter
    ? chapters.filter(c => c.subjectId === subjectFilter)
    : chapters;
  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name || '-';

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Chapters</h1>

        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="text-sm font-medium text-slate-600 mb-3">Add Chapter</h2>
          <ChapterForm
            subjects={subjects}
            onSubmit={editingId ? handleUpdate : handleAdd}
            initialData={editingId ? chapters.find(c => c.id === editingId) : null}
            onCancel={editingId ? () => setEditingId(null) : null}
          />
        </div>

        {toast && (
          <div className="fixed top-20 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm text-slate-600 mr-2">Filter by subject:</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">All</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div>
                  <span className="font-medium">{c.name}</span>
                  <span className="text-slate-500 text-sm ml-2">— {getSubjectName(c.subjectId)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(editingId === c.id ? null : c.id)} className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
