import { useState } from 'react';

export default function FilterBar({ subjects, chapters, onSubjectChange, onChapterChange }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const filteredChapters = selectedSubject
    ? chapters.filter(c => c.subjectId === selectedSubject)
    : chapters;

  const handleSubjectChange = (val) => {
    setSelectedSubject(val);
    setSelectedChapter('');
    onSubjectChange(val);
    onChapterChange('');
  };

  const handleChapterChange = (val) => {
    setSelectedChapter(val);
    onChapterChange(val);
  };

  const selectStyle = {
    background: '#111118',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#94a3b8',
    fontSize: '0.82rem',
    padding: '0.5rem 2rem 0.5rem 0.85rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.6rem center',
    minWidth: 150,
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <select
          value={selectedSubject}
          onChange={e => handleSubjectChange(e.target.value)}
          style={selectStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={selectedChapter}
          onChange={e => handleChapterChange(e.target.value)}
          style={{ ...selectStyle, opacity: filteredChapters.length === 0 ? 0.4 : 1 }}
          disabled={filteredChapters.length === 0}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <option value="">All Chapters</option>
          {filteredChapters.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {(selectedSubject || selectedChapter) && (
        <button
          onClick={() => { handleSubjectChange(''); }}
          style={{ fontSize: '0.75rem', color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '0.45rem 0.75rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.target.style.opacity = '0.7'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Clear
        </button>
      )}
    </div>
  );
}
