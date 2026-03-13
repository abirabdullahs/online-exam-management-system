import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExamCard from '../components/exam/ExamCard';
import FilterBar from '../components/shared/FilterBar';
import { getSubjects, getChapters, getExams } from '../firebase/firestore';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, c, e] = await Promise.all([
        getSubjects(),
        getChapters(),
        getExams(true)
      ]);
      setSubjects(s);
      setChapters(c);
      setExams(e);
      setLoading(false);
    }
    load();
  }, []);

  let filtered = exams;
  if (subjectFilter) filtered = filtered.filter(ex => ex.subjectId === subjectFilter);
  if (chapterFilter) filtered = filtered.filter(ex => ex.chapterId === chapterFilter);

  const getSubjectName = (id) => subjects.find(s => s.id === id)?.name || '-';
  const getChapterName = (id) => chapters.find(c => c.id === id)?.name || '-';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-slate-800">ExamFlow</Link>
          <div className="flex gap-4">
            <Link to="/" className="text-slate-600 hover:text-indigo-600">Exams</Link>
            <Link to="/saved-results" className="text-slate-600 hover:text-indigo-600">Saved Results</Link>
            <Link to="/admin" className="text-indigo-600 font-medium">Admin</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Available Exams</h1>
        <div className="mb-6">
          <FilterBar
            subjects={subjects}
            chapters={chapters}
            onSubjectChange={setSubjectFilter}
            onChapterChange={setChapterFilter}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 py-10">No exams found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(exam => (
              <ExamCard
                key={exam.id}
                exam={exam}
                subjectName={getSubjectName(exam.subjectId)}
                chapterName={getChapterName(exam.chapterId)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
