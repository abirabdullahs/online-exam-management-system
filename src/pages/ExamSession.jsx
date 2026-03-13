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
      if (!examData || cancelled) {
        navigate('/');
        return;
      }
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
          sessionStorage.setItem(`${SESSION_KEY}_${examCode}`, JSON.stringify({
            startTime: Date.now(),
            answers: {},
            currentIndex: 0
          }));
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [examCode, questionCount, mode, navigate]);

  useEffect(() => {
    if (!isPractice && timeLeft !== null && timeLeft > 0 && !submitted) {
      const id = setInterval(() => {
        setTimeLeft(prev => prev <= 0 ? 0 : prev - 1);
      }, 1000);
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
        examId: exam.id,
        examCode: exam.examCode,
        examTitle: exam.title,
        subjectName,
        chapterName,
        mode,
        attemptedAt: new Date().toISOString(),
        questionsAttempted: questions.length,
        totalQuestions: questions.length,
        score,
        answers: questions.map(q => ({
          questionId: q.id,
          questionText: q.questionText,
          questionImageUrl: q.questionImageUrl,
          options: q.options,
          correctOption: q.correctOption,
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
    if (!isPractice && timeLeft === 0 && !submitted) {
      handleSubmitInternal();
    }
  }, [timeLeft, isPractice, submitted, handleSubmitInternal]);

  useEffect(() => {
    if (exam && mode === 'exam' && timerStart) {
      sessionStorage.setItem(`${SESSION_KEY}_${examCode}`, JSON.stringify({
        startTime: timerStart,
        answers,
        currentIndex
      }));
    }
  }, [answers, currentIndex, examCode, exam, mode, timerStart]);

  const handleSelect = useCallback((qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
    if (isPractice) setShowFeedback(prev => ({ ...prev, [qId]: true }));
  }, [submitted, isPractice]);

  const handleClear = useCallback((qId) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setShowFeedback(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  }, [submitted]);

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <span className="font-medium">{exam.title}</span>
        <div className="flex items-center gap-4">
          {!isPractice && timeLeft !== null && (
            <Timer seconds={timeLeft} danger={timeLeft <= 60} />
          )}
          <button
            onClick={() => confirm('Submit exam?') && handleSubmitInternal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-48 p-4 border-r bg-white min-h-[calc(100vh-56px)]">
          <p className="text-sm text-slate-600 mb-2">Questions</p>
          <div className="grid grid-cols-5 gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded text-sm ${
                  i === currentIndex
                    ? 'bg-indigo-600 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8 max-w-2xl">
          <p className="text-slate-500 text-sm mb-4">Question {currentIndex + 1} of {questions.length}</p>
          <QuestionDisplay
            question={currentQ}
            selectedOption={answers[currentQ.id]}
            onSelect={(opt) => handleSelect(currentQ.id, opt)}
            onClear={() => handleClear(currentQ.id)}
            showFeedback={showFeedback[currentQ.id]}
            mode={mode}
          />
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
