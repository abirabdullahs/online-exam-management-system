import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import { getSessions, getSubjects, getChapters, getExams } from '../../firebase/firestore';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function Dashboard() {
  const [stats, setStats] = useState({ subjects: 0, chapters: 0, exams: 0, questions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sessions, subjects, chapters, exams] = await Promise.all([
          getSessions(),
          getSubjects(),
          getChapters(),
          getExams()
        ]);
        const questionsSnap = await getDocs(collection(db, 'questions'));
        setStats({
          sessions: sessions.length,
          subjects: subjects.length,
          chapters: chapters.length,
          exams: exams.length,
          questions: questionsSnap.size
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="flex justify-center py-20">
          <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  const cards = [
    { label: 'Sessions', value: stats.sessions, to: '/admin/sessions', bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' },
    { label: 'Subjects', value: stats.subjects, to: '/admin/subjects', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
    { label: 'Chapters', value: stats.chapters, to: '/admin/chapters', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' },
    { label: 'Exams', value: stats.exams, to: '/admin/exams', bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600' },
    { label: 'Questions', value: stats.questions, to: '/admin/exams', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', text: 'text-fuchsia-600' }
  ];

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, to, bg, border, text }) => (
            <Link
              key={label}
              to={to}
              className={`p-6 rounded-xl ${bg} border ${border} hover:shadow-md transition`}
            >
              <p className="text-slate-600 text-sm">{label}</p>
              <p className={`text-3xl font-bold ${text}`}>{value}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
