import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import { getSubjects, getChapters, getExams, updateExam, deleteExam } from '../../firebase/firestore';
import { getQuestions } from '../../firebase/firestore';

export default function Exams() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const [s, c, e] = await Promise.all([getSubjects(), getChapters(), getExams()]);
    setSubjects(s);
    setChapters(c);
    setExams(e);
    const counts = {};
    for (const exam of e) {
      const q = await getQuestions(exam.id);
      counts[exam.id] = q.length;
    }
    setQuestionCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name || '-';
  const getChapterName = (id) => chapters.find(c => c.id === id)?.name || '-';

  const handleTogglePublish = async (exam) => {
    await updateExam(exam.id, { isPublished: !exam.isPublished });
    showToast(exam.isPublished ? 'Unpublished' : 'Published');
    load();
  };

  const handleCopyLink = (exam) => {
    const url = `${window.location.origin}/exam/${exam.examCode}`;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this exam? All questions will be deleted.')) return;
    await deleteExam(id);
    showToast('Exam deleted!');
    load();
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Exams</h1>
          <Link to="/admin/exams/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Create New Exam
          </Link>
        </div>

        {toast && (
          <div className="fixed top-20 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        {loading ? (
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Chapter</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Questions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{exam.title}</td>
                    <td className="px-4 py-3">{getSubjectName(exam.subjectId)}</td>
                    <td className="px-4 py-3">{getChapterName(exam.chapterId)}</td>
                    <td className="px-4 py-3">{questionCounts[exam.id] ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCopyLink(exam)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Copy link
                        </button>
                        <button onClick={() => handleTogglePublish(exam)} className="text-sm text-indigo-600 hover:underline">
                          {exam.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link to={`/admin/exams/${exam.id}/questions`} className="text-sm text-indigo-600 hover:underline">
                          Questions
                        </Link>
                        <Link to={`/admin/exams/${exam.id}`} className="text-sm text-indigo-600 hover:underline">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(exam.id)} className="text-sm text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
