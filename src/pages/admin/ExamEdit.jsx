import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import ExamForm from '../../components/admin/ExamForm';
import { getSubjects, getChapters, getExamById, updateExam } from '../../firebase/firestore';

export default function ExamEdit() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      const [s, c, e] = await Promise.all([getSubjects(), getChapters(), getExamById(examId)]);
      setSubjects(s);
      setChapters(c);
      setExam(e);
      setLoading(false);
    }
    load();
  }, [examId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (data) => {
    await updateExam(examId, data);
    showToast('Exam updated!');
    setExam(prev => ({ ...prev, ...data }));
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
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Exam</h1>
        {toast && (
          <div className="fixed top-20 right-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}
        <ExamForm
          subjects={subjects}
          chapters={chapters}
          initialData={exam}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/exams')}
        />
      </div>
    </div>
  );
}
