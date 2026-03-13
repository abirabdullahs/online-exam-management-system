import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamByCode } from '../firebase/firestore';

export default function ExamEntry() {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState('');
  const [attemptAll, setAttemptAll] = useState(false);
  const [mode, setMode] = useState('practice');

  useEffect(() => {
    async function load() {
      const e = await getExamByCode(examCode);
      setExam(e);
      setLoading(false);
    }
    load();
  }, [examCode]);

  useEffect(() => {
    if (exam && attemptAll) {
      setQuestionCount(String(exam.totalQuestions));
    }
  }, [attemptAll, exam]);

  const handleStart = () => {
    const count = attemptAll ? exam.totalQuestions : parseInt(questionCount, 10);
    if (!count || count < 1 || count > exam.totalQuestions) {
      alert(`Please enter a number between 1 and ${exam.totalQuestions}`);
      return;
    }
    navigate(`/exam/${examCode}/session`, { state: { questionCount: count, mode } });
  };

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (exam.totalQuestions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800">No questions yet</h1>
          <p className="text-slate-600 mt-2">This exam has no questions. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800">{exam.title}</h1>
        <p className="text-slate-600 mt-2">{exam.description || 'MCQ Exam'}</p>
        <div className="mt-4 text-sm text-slate-500">
          Total questions: {exam.totalQuestions} • {exam.marksPerCorrect} mark each
          {exam.negativeMarks > 0 && ` • −${exam.negativeMarks} per wrong`}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">How many questions to attempt?</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={questionCount}
                onChange={(e) => { setQuestionCount(e.target.value); setAttemptAll(false); }}
                min={1}
                max={exam.totalQuestions}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={attemptAll} onChange={(e) => setAttemptAll(e.target.checked)} />
                <span className="text-sm">Attempt all ({exam.totalQuestions})</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mode</label>
            <div className="space-y-2">
              <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="mode" value="practice" checked={mode === 'practice'} onChange={() => setMode('practice')} />
                <div>
                  <span className="font-medium">Practice Mode</span>
                  <p className="text-sm text-slate-500">No time limit. See correct answers immediately after each question.</p>
                </div>
              </label>
              <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="mode" value="exam" checked={mode === 'exam'} onChange={() => setMode('exam')} />
                <div>
                  <span className="font-medium">Exam Mode</span>
                  <p className="text-sm text-slate-500">Timed exam. Results shown at the end.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
