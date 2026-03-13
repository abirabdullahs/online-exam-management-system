import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders text with LaTeX support. Use $$...$$ for inline math.
 * Example: "Find $$x^2 + y^2$$ when x=1"
 */
export function RenderMath({ text, className = '' }) {
  if (!text) return null;
  const parts = text.split(/(\$\$[^$]+\$\$)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('$$') && part.endsWith('$$') ? (
          <InlineMath key={i} math={part.slice(2, -2)} />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
