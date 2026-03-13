import { Link } from 'react-router-dom';

export default function ExamCard({ exam, subjectName, chapterName }) {
  return (
    <Link
      to={`/exam/${exam.examCode}`}
      className="block p-5 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition bg-white"
    >
      <h3 className="font-semibold text-slate-800">{exam.title}</h3>
      <p className="text-sm text-slate-500 mt-1">{subjectName} — {chapterName}</p>
      <div className="flex gap-3 mt-3 text-sm text-slate-600">
        <span>{exam.totalQuestions} questions</span>
        <span>{exam.marksPerCorrect} mark each</span>
        {exam.negativeMarks > 0 && <span>−{exam.negativeMarks} wrong</span>}
      </div>
    </Link>
  );
}
