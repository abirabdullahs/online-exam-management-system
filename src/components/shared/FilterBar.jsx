import { useState, useEffect } from 'react';

export default function FilterBar({ subjects, chapters, onSubjectChange, onChapterChange }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);

  useEffect(() => {
    if (selectedSubjectId) {
      setFilteredChapters(chapters.filter(c => c.subjectId === selectedSubjectId));
      setSelectedChapterId('');
      onChapterChange('');
    } else {
      setFilteredChapters(chapters);
    }
  }, [selectedSubjectId, chapters]);

  const handleSubjectChange = (e) => {
    const id = e.target.value;
    setSelectedSubjectId(id);
    onSubjectChange(id);
  };

  const handleChapterChange = (e) => {
    const id = e.target.value;
    setSelectedChapterId(id);
    onChapterChange(id);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div>
        <label className="sr-only">Subject</label>
        <select
          value={selectedSubjectId}
          onChange={handleSubjectChange}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="sr-only">Chapter</label>
        <select
          value={selectedChapterId}
          onChange={handleChapterChange}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Chapters</option>
          {filteredChapters.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
