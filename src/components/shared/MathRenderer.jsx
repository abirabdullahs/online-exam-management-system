import { RenderMath } from '../../utils/mathParser';

export default function MathRenderer({ text, className }) {
  return <RenderMath text={text} className={className} />;
}
