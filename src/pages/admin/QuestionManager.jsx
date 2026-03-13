import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import QuestionEditor from '../../components/admin/QuestionEditor';
import { getExamById, getQuestions, addQuestion, updateQuestion, deleteQuestion, updateExam } from '../../firebase/firestore';
import { RenderMath } from '../../utils/mathParser';

export default function QuestionManager() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    const [e, q] = await Promise.all([getExamById(examId), getQuestions(examId)]);
    setExam(e);
    setQuestions(q);
    setLoading(false);
  };

  useEffect(() => { load(); }, [examId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async (data) => {
    await addQuestion({ ...data, examId });
    await updateExam(examId, { totalQuestions: questions.length + 1 });
    showToast('Question added!');
    load();
  };

  const handleSaveAndClose = async (data) => {
    if (editingId) {
      await updateQuestion(editingId, data);
      showToast('Question updated!');
      setEditingId(null);
    } else {
      await addQuestion({ ...data, examId });
      await updateExam(examId, { totalQuestions: questions.length + 1 });
      showToast('Question added!');
    }
    setShowEditor(false);
    load();
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await deleteQuestion(id);
    await updateExam(examId, { totalQuestions: Math.max(0, questions.length - 1) });
    showToast('Question deleted!');
    load();
  };

  if (loading || !exam) {
    return (
      <>
        <AdminNav />
        <div className="flex justify-center py-20">
          <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/admin/exams" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">← Back to Exams</Link>
            <h1 className="text-2xl font-bold text-slate-800">Questions: {exam.title}</h1>
            <p className="text-slate-600 text-sm">Exam code: {exam.examCode} • {questions.length} questions</p>
          </div>
          <button
            onClick={() => { setShowEditor(true); setEditingId(null); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Question
          </button>
        </div>

        {toast && (
          <div className="fixed top-20 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        {showEditor && (
          <div className="mb-8">
            <QuestionEditor
              initialOrder={questions.length + 1}
              initialData={editingId ? questions.find(q => q.id === editingId) : null}
              onSave={handleSave}
              onSaveAndClose={handleSaveAndClose}
            />
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="font-medium text-slate-500">#{q.order}</span>
                  <span className="ml-2">Correct: {q.correctOption}</span>
                  <p className="mt-1 text-slate-800"><RenderMath text={q.questionText?.slice(0, 100)} />{q.questionText?.length > 100 ? '...' : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(q)} className="text-indigo-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
