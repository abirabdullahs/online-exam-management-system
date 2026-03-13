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
    <div className="min-h-screen" style={{ background: '#0a0a0f', fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .nav-link { color: #888; transition: color 0.2s; font-size: 0.875rem; font-weight: 500; }
        .nav-link:hover { color: #e2e8f0; }
        .hero-gradient { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.25) 0%, transparent 70%); }
        .hero-line { height: 1px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent); }
        .exam-count-badge { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 999px; }
        .spinner-ring { width: 40px; height: 40px; border: 2px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-glow { color: #4a4a6a; }
        .section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #6366f1; }
        .admin-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; transition: opacity 0.2s; }
        .admin-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Navbar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', background: 'rgba(10,10,15,0.85)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 11L5 4l3 5 2-3 2 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0', letterSpacing: '-0.02em' }}>Proshno</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/" className="nav-link">Exams</Link>
            <Link to="/saved-results" className="nav-link">Saved Results</Link>
            <Link to="/admin" className="admin-btn">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="hero-gradient" style={{ padding: '3.5rem 1rem 2.5rem' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>Radiance Coaching Center</p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Available Exams
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Practice and sharpen your skills — unlimited attempts, instant results.
          </p>
          <div className="hero-line" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter + count row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <FilterBar
            subjects={subjects}
            chapters={chapters}
            onSubjectChange={setSubjectFilter}
            onChapterChange={setChapterFilter}
          />
          {!loading && (
            <span className="exam-count-badge">
              {filtered.length} exam{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div className="spinner-ring" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="empty-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>◉</div>
            <p style={{ color: '#4a4a6a', fontSize: '0.95rem' }}>No exams found for the selected filters.</p>
          </div>
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
