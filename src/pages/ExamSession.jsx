import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getExamByCode, getQuestions } from '../firebase/firestore';
import { getSubjects, getChapters } from '../firebase/firestore';
import { calculateScore } from '../utils/scoring';
import Timer from '../components/exam/Timer';
import QuestionDisplay from '../components/exam/QuestionDisplay';

const SESSION_KEY = 'examSession';

export default function ExamSession() {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { questionCount, mode } = location.state || {};

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState({});

  const isPractice = mode === 'practice';

  useEffect(() => {
    if (!questionCount || !mode) {
      navigate(`/exam/${examCode}`);
      return;
    }
    let cancelled = false;
    (async () => {
      const examData = await getExamByCode(examCode);
      if (!examData || cancelled) { navigate('/'); return; }
      const allQ = await getQuestions(examData.id);
      const qs = allQ.slice(0, Math.min(questionCount, allQ.length));
      setExam(examData);
      setQuestions(qs);

      if (mode === 'exam') {
        const stored = sessionStorage.getItem(`${SESSION_KEY}_${examCode}`);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
            const remaining = Math.max(0, examData.totalTimeSeconds - elapsed);
            setTimeLeft(remaining);
            setTimerStart(data.startTime);
            if (data.answers) setAnswers(data.answers);
            if (data.currentIndex != null) setCurrentIndex(Math.min(data.currentIndex, qs.length - 1));
          } catch {
            setTimeLeft(examData.totalTimeSeconds);
            setTimerStart(Date.now());
          }
        } else {
          setTimeLeft(examData.totalTimeSeconds);
          setTimerStart(Date.now());
          sessionStorage.setItem(`${SESSION_KEY}_${examCode}`, JSON.stringify({ startTime: Date.now(), answers: {}, currentIndex: 0 }));
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [examCode, questionCount, mode, navigate]);

  useEffect(() => {
    if (!isPractice && timeLeft !== null && timeLeft > 0 && !submitted) {
      const id = setInterval(() => setTimeLeft(prev => prev <= 0 ? 0 : prev - 1), 1000);
      return () => clearInterval(id);
    }
  }, [isPractice, submitted, timeLeft]);

  const handleSubmitInternal = useCallback(() => {
    if (submitted || !exam || !questions.length) return;
    setSubmitted(true);
    (async () => {
      const [subjects, chapters] = await Promise.all([getSubjects(), getChapters()]);
      const subjectName = subjects.find(s => s.id === exam.subjectId)?.name || '';
      const chapterName = chapters.find(c => c.id === exam.chapterId)?.name || '';
      const score = calculateScore(answers, questions, exam.marksPerCorrect, exam.negativeMarks);
      const result = {
        examId: exam.id, examCode: exam.examCode, examTitle: exam.title,
        subjectName, chapterName, mode,
        attemptedAt: new Date().toISOString(),
        questionsAttempted: questions.length, totalQuestions: questions.length,
        score,
        answers: questions.map(q => ({
          questionId: q.id, questionText: q.questionText, questionImageUrl: q.questionImageUrl,
          options: q.options, correctOption: q.correctOption,
          selectedOption: answers[q.id] ?? null,
          isCorrect: answers[q.id] ? answers[q.id] === q.correctOption : false,
          timeTaken: 0
        }))
      };
      sessionStorage.removeItem(`${SESSION_KEY}_${examCode}`);
      sessionStorage.setItem(`examResult_${examCode}`, JSON.stringify(result));
      navigate(`/exam/${examCode}/result`);
    })();
  }, [submitted, answers, questions, exam, examCode, navigate]);

  useEffect(() => {
    if (!isPractice && timeLeft === 0 && !submitted) handleSubmitInternal();
  }, [timeLeft, isPractice, submitted, handleSubmitInternal]);

  useEffect(() => {
    if (exam && mode === 'exam' && timerStart) {
      sessionStorage.setItem(`${SESSION_KEY}_${examCode}`, JSON.stringify({ startTime: timerStart, answers, currentIndex }));
    }
  }, [answers, currentIndex, examCode, exam, mode, timerStart]);

  const handleSelect = useCallback((qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
    if (isPractice) setShowFeedback(prev => ({ ...prev, [qId]: true }));
  }, [submitted, isPractice]);

  const handleClear = useCallback((qId) => {
    if (submitted) return;
    setAnswers(prev => { const n = { ...prev }; delete n[qId]; return n; });
    setShowFeedback(prev => { const n = { ...prev }; delete n[qId]; return n; });
  }, [submitted]);

  if (loading || !exam) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const answeredCount = Object.keys(answers).length;
  const progressPct = (answeredCount / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .q-nav-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid; font-size: 0.72rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-family: inherit; }
        .nav-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #64748b; border-radius: 10px; padding: 0.6rem 1.25rem; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.07); color: #94a3b8; }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .submit-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 10px; padding: 0.55rem 1.1rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.2s; white-space: nowrap; }
        .submit-btn:hover { opacity: 0.85; }
        .session-layout { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; min-height: calc(100vh - 72px); }
        .session-sidebar { width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.85rem 1rem; background: #0d0d14; }
        .session-legend { display: flex; flex-direction: row; gap: 0.75rem; margin-top: 0.75rem; flex-wrap: wrap; }
        .session-main { flex: 1; padding: 1.25rem 1rem; max-width: 720px; width: 100%; }
        @media (min-width: 768px) {
          .session-layout { flex-direction: row; }
          .session-sidebar { width: 200px; flex-shrink: 0; border-bottom: none; border-right: 1px solid rgba(255,255,255,0.05); padding: 1.25rem 1rem; min-height: calc(100vh - 72px); }
          .session-legend { flex-direction: column; gap: 0.35rem; margin-top: 1.25rem; }
          .session-main { padding: 2rem 1.5rem; }
        }
      `}</style>

      {/* Top bar */}
      <header style={{ background: '#0d0d14', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '30ch' }}>{exam.title}</div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.1rem' }}>
              {isPractice ? '● Practice Mode' : '● Exam Mode'} · {answeredCount}/{questions.length} answered
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!isPractice && timeLeft !== null && <Timer seconds={timeLeft} danger={timeLeft <= 60} />}
            <button onClick={() => { if (window.confirm('Submit exam?')) handleSubmitInternal(); }} className="submit-btn">
              Submit
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ maxWidth: 1100, margin: '0.5rem auto 0', height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </header>

      <div className="session-layout">

        {/* Sidebar - question grid */}
        <aside className="session-sidebar">
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>Questions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', gap: '0.35rem' }}>
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className="q-nav-btn"
                style={{
                  borderColor: i === currentIndex ? '#6366f1' : answers[q.id] ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.06)',
                  background: i === currentIndex ? '#6366f1' : answers[q.id] ? 'rgba(34,197,94,0.1)' : 'transparent',
                  color: i === currentIndex ? 'white' : answers[q.id] ? '#4ade80' : '#374151',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="session-legend">
            {[
              { color: '#6366f1', label: 'Current' },
              { color: '#4ade80', label: 'Answered' },
              { color: '#374151', label: 'Skipped' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', color: '#374151' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main question area */}
        <main className="session-main">
          {/* Question counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 6 }}>
                Q{currentIndex + 1}
              </span>
              <span style={{ color: '#374151', fontSize: '0.8rem' }}>of {questions.length}</span>
            </div>
            {isPractice && showFeedback[currentQ.id] && (
              <span style={{ fontSize: '0.72rem', color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                Answer revealed
              </span>
            )}
          </div>

          <QuestionDisplay
            question={currentQ}
            selectedOption={answers[currentQ.id]}
            onSelect={(opt) => handleSelect(currentQ.id, opt)}
            onClear={() => handleClear(currentQ.id)}
            showFeedback={showFeedback[currentQ.id]}
            mode={mode}
          />

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="nav-btn"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="nav-btn"
              style={{ marginLeft: 'auto', background: currentIndex < questions.length - 1 ? 'rgba(99,102,241,0.1)' : undefined, borderColor: currentIndex < questions.length - 1 ? 'rgba(99,102,241,0.3)' : undefined, color: currentIndex < questions.length - 1 ? '#818cf8' : undefined }}
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}