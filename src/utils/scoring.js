/**
 * Calculate exam score from answers
 * @param {Object} answers - { [questionId]: selectedOption }
 * @param {Array} questions - Array of question objects with id, correctOption
 * @param {number} marksPerCorrect
 * @param {number} negativeMarks
 */
export function calculateScore(answers, questions, marksPerCorrect, negativeMarks) {
  let correct = 0, wrong = 0, skipped = 0;
  questions.forEach(q => {
    const selected = answers[q.id];
    if (!selected) { skipped++; return; }
    if (selected === q.correctOption) correct++;
    else wrong++;
  });
  const marksEarned = correct * marksPerCorrect;
  const negativeDeducted = wrong * negativeMarks;
  const finalScore = marksEarned - negativeDeducted;
  const totalPossibleMarks = questions.length * marksPerCorrect;
  return {
    correct,
    wrong,
    skipped,
    marksEarned,
    negativeDeducted,
    finalScore,
    totalPossibleMarks
  };
}
