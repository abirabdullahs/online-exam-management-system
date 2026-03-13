import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import ExamForm from '../../components/admin/ExamForm';
import { getSubjects, getChapters, addExam } from '../../firebase/firestore';
import { generateExamCode } from '../../utils/examCode';

export default function ExamNew() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [s, c] = await Promise.all([getSubjects(), getChapters()]);
      setSubjects(s);
      setChapters(c);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (data) => {
    const examCode = generateExamCode();
    const examLink = `${window.location.origin}/exam/${examCode}`;
    const id = await addExam({
      ...data,
      totalQuestions: 0,
      examCode,
      examLink
    });
    navigate(`/admin/exams/${id}/questions`);
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Exam</h1>
        {loading ? (
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        ) : (
          <ExamForm subjects={subjects} chapters={chapters} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
