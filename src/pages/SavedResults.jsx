import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSavedResults, deleteSavedResult, clearAllSavedResults } from '../utils/localStorage';
import ResultReport from '../components/exam/ResultReport';

export default function SavedResults() {
  const [results, setResults] = useState([]);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    setResults(getAllSavedResults());
  }, []);

  const handleDelete = (key) => {
    deleteSavedResult(key);
    setResults(getAllSavedResults());
    setExpandedKey(null);
  };

  const handleClearAll = () => {
    if (!confirm('Delete all saved results?')) return;
    clearAllSavedResults();
    setResults([]);
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return '-';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-slate-800">ExamFlow</Link>
          <Link to="/" className="text-slate-600 hover:text-indigo-600">← Back to Exams</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Saved Results</h1>

        {results.length === 0 ? (
          <p className="text-slate-500 py-10">No saved results. Complete an exam and save your result to see it here.</p>
        ) : (
          <>
            <button
              onClick={handleClearAll}
              className="mb-4 text-sm text-red-600 hover:underline"
            >
              Clear All
            </button>
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r._key} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setExpandedKey(expandedKey === r._key ? null : r._key)}
                    className="w-full px-4 py-4 text-left hover:bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{r.examTitle}</p>
                      <p className="text-sm text-slate-500">{formatDate(r.attemptedAt)} • {r.mode} • Score: {r.score?.finalScore}/{r.score?.totalPossibleMarks}</p>
                    </div>
                    <span className="text-slate-400">{expandedKey === r._key ? '▼' : '▶'}</span>
                  </button>
                  {expandedKey === r._key && (
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <ResultReport result={r} />
                      <button
                        onClick={() => handleDelete(r._key)}
                        className="mt-4 text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
