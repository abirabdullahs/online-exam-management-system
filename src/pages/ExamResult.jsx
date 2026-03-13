import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ResultReport from '../components/exam/ResultReport';
import { saveResult } from '../utils/localStorage';

export default function ExamResult() {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem(`examResult_${examCode}`);
    if (!data) {
      navigate(`/exam/${examCode}`);
      return;
    }
    setResult(JSON.parse(data));
  }, [examCode, navigate]);

  const handleSave = () => {
    if (!result) return;
    saveResult(examCode, result);
    setSaved(true);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Exam Result</h1>
        <p className="text-slate-600 mb-6">{result.examTitle}</p>

        <ResultReport result={result} />

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saved ? 'Saved for 30 days!' : 'Save Result'}
          </button>
          <Link
            to={`/exam/${examCode}`}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white"
          >
            Retry
          </Link>
          <Link to="/" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
