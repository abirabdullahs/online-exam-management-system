import { useState, useEffect } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import SubjectForm from '../../components/admin/SubjectForm';
import { getSubjects, addSubject, updateSubject, deleteSubject } from '../../firebase/firestore';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdd = async (data) => {
    await addSubject(data);
    showToast('Subject added!');
    load();
  };

  const handleUpdate = async (data) => {
    await updateSubject(editingId, data);
    showToast('Subject updated!');
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject? Chapters and exams under it may break.')) return;
    await deleteSubject(id);
    showToast('Subject deleted!');
    load();
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Subjects</h1>

        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="text-sm font-medium text-slate-600 mb-3">Add Subject</h2>
          <SubjectForm
            onSubmit={editingId ? handleUpdate : handleAdd}
            initialData={editingId ? subjects.find(s => s.id === editingId) : null}
            onCancel={editingId ? () => setEditingId(null) : null}
          />
        </div>

        {toast && (
          <div className="fixed top-20 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        {loading ? (
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        ) : (
          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-500 text-sm ml-2">({s.slug})</span>
                  <span className="text-slate-400 text-sm ml-2">order: {s.order}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
