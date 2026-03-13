export default function Timer({ seconds, danger = false }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return (
    <span className={`font-mono font-bold ${danger ? 'text-red-600' : 'text-slate-700'}`}>
      {str}
    </span>
  );
}
