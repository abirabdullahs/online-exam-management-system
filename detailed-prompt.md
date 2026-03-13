# Google AI Studio Prompt — Online Exam System Website

---

## SYSTEM PROMPT (paste into "System Instructions" in AI Studio)

You are an expert full-stack React developer specializing in Firebase, Tailwind CSS, and educational web apps. You write clean, production-quality code with clear comments. You follow modern React 18 patterns using hooks, functional components, and React Router v6. You never use any backend server — Firebase Auth and Firestore are the only backend services.

---

## USER PROMPT (paste into the chat)

---

Build me a complete **Online Exam System** web application using the following specification. The entire app is client-side React + Vite + Tailwind CSS + Firebase (Auth + Firestore). No backend server of any kind.

---

## TECH STACK

- React 18 + Vite
- React Router v6 (client-side routing)
- Tailwind CSS (styling)
- Firebase v9+ modular SDK (Authentication + Firestore)
- KaTeX via `react-katex` + `katex/dist/katex.min.css` (math rendering)
- `nanoid` (unique exam code generation)
- Native `localStorage` (storing student results client-side)

---

## APP STRUCTURE & ROUTES

```
/                          → Home page (public)
/admin                     → Admin login
/admin/dashboard           → Admin dashboard (protected)
/admin/subjects            → Manage subjects (protected)
/admin/chapters            → Manage chapters (protected)
/admin/exams               → List of exams (protected)
/admin/exams/new           → Create new exam (protected)
/admin/exams/:examId       → Edit exam (protected)
/admin/exams/:examId/questions  → Add/edit questions (protected)
/exam/:examCode            → Exam entry/setup (public)
/exam/:examCode/session    → Active exam session (public)
/exam/:examCode/result     → Post-exam result report (public)
/saved-results             → View locally saved past results (public)
```

---

## FIREBASE SCHEMA (Firestore Collections)

### `subjects` collection:
```json
{
  "name": "string",
  "slug": "string",
  "order": "number",
  "createdAt": "timestamp"
}
```

### `chapters` collection:
```json
{
  "subjectId": "string",
  "name": "string",
  "slug": "string",
  "order": "number",
  "createdAt": "timestamp"
}
```

### `exams` collection:
```json
{
  "subjectId": "string",
  "chapterId": "string",
  "title": "string",
  "description": "string",
  "totalQuestions": "number",
  "marksPerCorrect": "number",
  "negativeMarks": "number",
  "defaultTimePerQuestion": "number (seconds)",
  "totalTimeSeconds": "number",
  "examCode": "string (8-char unique, e.g. XK9P2MQA)",
  "examLink": "string (full URL)",
  "isPublished": "boolean",
  "createdAt": "timestamp"
}
```

### `questions` collection:
```json
{
  "examId": "string",
  "order": "number",
  "questionText": "string (supports LaTeX: $$...$$)",
  "questionImageUrl": "string (optional)",
  "options": [
    { "label": "A", "text": "string (supports LaTeX)", "imageUrl": "string (optional)" },
    { "label": "B", "text": "string", "imageUrl": "string (optional)" },
    { "label": "C", "text": "string", "imageUrl": "string (optional)" },
    { "label": "D", "text": "string", "imageUrl": "string (optional)" }
  ],
  "correctOption": "A | B | C | D",
  "timeSeconds": "number (0 = use exam default)",
  "createdAt": "timestamp"
}
```

---

## PAGE-BY-PAGE SPECIFICATION

---

### PAGE: Home `/`

- Header with app name/logo
- Fetch all published exams from Firestore
- Show exam cards in a grid: title, subject, chapter, question count, marks info
- Filter bar: dropdown for Subject, dropdown for Chapter (Chapter dropdown updates based on selected subject)
- Clicking an exam card → navigate to `/exam/:examCode`
- Clean, modern design with Tailwind

---

### PAGE: Admin Login `/admin`

- Email + Password login form
- Use `signInWithEmailAndPassword` from Firebase Auth
- On success → redirect to `/admin/dashboard`
- Show error messages on failure
- No registration (admin created manually in Firebase Console)

---

### PAGE: Admin Dashboard `/admin/dashboard`

- Show stats: total subjects, chapters, exams, questions
- Navigation links to manage subjects, chapters, exams
- Logout button (calls `signOut`)
- Protected route — redirect to `/admin` if not authenticated

---

### PAGE: Manage Subjects `/admin/subjects`

- List all subjects with edit/delete options
- "Add Subject" form: name, order
- Auto-generate slug from name
- Save to Firestore `subjects` collection

---

### PAGE: Manage Chapters `/admin/chapters`

- List all chapters (show subject name)
- Filter by subject
- "Add Chapter" form: select subject, name, order
- Auto-generate slug from name
- Save to Firestore `chapters` collection

---

### PAGE: Manage Exams `/admin/exams`

- Table of all exams with: title, subject, chapter, questions count, published status, actions
- "Create New Exam" button → `/admin/exams/new`
- Edit button → `/admin/exams/:examId`
- "Manage Questions" button → `/admin/exams/:examId/questions`
- Toggle published/unpublished
- Show shareable exam link (copy to clipboard button)

---

### PAGE: Create/Edit Exam `/admin/exams/new` and `/admin/exams/:examId`

Form fields:
- Select Subject (dropdown from Firestore)
- Select Chapter (dropdown filtered by subject)
- Title
- Description (optional)
- Marks per correct answer (number input)
- Negative marks per wrong answer (number input, can be 0)
- Default time per question in seconds (number input)
- Total exam time in seconds (number input, for Exam Mode)
- isPublished toggle

On create: auto-generate `examCode` using `nanoid(8).toUpperCase()` and compute `examLink`
Save to Firestore `exams` collection

---

### PAGE: Question Manager `/admin/exams/:examId/questions`

- Show list of all questions for this exam (ordered by `order` field)
- Each question shows: order number, short question preview, correct answer, edit/delete buttons
- "Add Question" opens an inline editor or modal

**Question Editor form:**
- `questionText` textarea (hint: supports LaTeX $$...$$)
- Live LaTeX preview next to the textarea using react-katex
- `questionImageUrl` text input (optional) — show preview image if URL entered
- For each of 4 options (A, B, C, D):
  - `text` input (supports LaTeX)
  - `imageUrl` input (optional image URL)
- `correctOption` radio button: A / B / C / D
- `timeSeconds` number input (0 = use exam default)
- "Save & Next" button: saves question to Firestore, clears form for next question
- "Save & Close" button: saves and goes back to question list
- Show running total: "X questions added"

Question `order` auto-increments. Save to Firestore `questions` collection.

---

### PAGE: Exam Entry `/exam/:examCode`

- Fetch exam by `examCode` field from Firestore
- Show: Exam title, subject, chapter, total questions available, marks info
- Input: "How many questions do you want to attempt?" (number input, max = exam.totalQuestions)
- Checkbox: "Attempt all questions" (auto-fills max)
- Validate: cannot enter a number greater than `exam.totalQuestions`
- Mode selection: **Practice Mode** | **Exam Mode** (radio buttons with descriptions)
  - Practice Mode: "No time limit. See correct answers immediately."
  - Exam Mode: "Timed exam. Results shown at the end."
- "Start Exam" button → navigate to `/exam/:examCode/session` with state: `{ questionCount, mode }`

---

### PAGE: Exam Session `/exam/:examCode/session`

This is the core exam page.

**Fetch:**
- Exam data from Firestore
- Questions for this exam (ordered by `order`), sliced to `questionCount`

**State to track:**
- `currentIndex` — which question student is on
- `answers` — object `{ [questionId]: selectedOption | null }`
- `timeLeft` — seconds remaining (Exam Mode only)
- `submitted` — boolean

**Layout:**
- Top bar: Exam title | [Exam Mode: countdown timer in red] | Submit button
- Question navigation: grid of numbered buttons (green = answered, gray = skipped/not visited, highlight current)
- Question display area:
  - Question number (e.g., "Question 3 of 20")
  - Question text (render LaTeX with react-katex)
  - Question image (if URL present)
  - 4 option buttons (A, B, C, D):
    - Show option text (render LaTeX)
    - Show option image below text if URL present
    - Clickable to select answer
    - In Practice Mode: immediately after click, show green (correct) or red (wrong) highlight + reveal correct answer
    - In Exam Mode: just highlight selected option, no feedback
  - Previous / Next navigation buttons
  - "Clear Answer" button to un-select

**Timer (Exam Mode):**
- Countdown from `exam.totalTimeSeconds`
- Use `setInterval` in `useEffect`
- Persist timer start time in `sessionStorage` to survive accidental refresh
- When `timeLeft === 0`: auto-submit
- Display format: `MM:SS`
- Turn red when < 60 seconds remaining

**Submit:**
- Manual submit button shows confirmation dialog: "Are you sure you want to submit?"
- On submit: calculate results, store in `sessionStorage`, navigate to `/exam/:examCode/result`

---

### PAGE: Exam Result `/exam/:examCode/result`

- Read result data from `sessionStorage`
- If no data → redirect to `/exam/:examCode`

**Score Summary card:**
- Total Questions Attempted
- Correct | Wrong | Skipped (with colored badges)
- Marks Earned | Negative Marks | Final Score
- Percentage score + pass/fail indicator (optional)

**Detailed Question Review:**
- List every question in order
- For each: question text, question image, all 4 options
- Highlight student's selected option (green if correct, red if wrong)
- Highlight correct option (always green)
- Show "Skipped" badge if unanswered

**Save Result button:**
- Saves full result object to `localStorage`
- Key: `examResult_${examCode}_${Date.now()}`
- Include `expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)`
- Show toast: "Result saved for 30 days!"

**Retry button:** → `/exam/:examCode` (start over)
**Home button:** → `/`

---

### PAGE: Saved Results `/saved-results`

- On mount: read all keys from `localStorage` matching `examResult_*`
- Filter out expired entries (delete them)
- Show result cards: exam title, date, score, mode
- Clicking a result card expands full detail report (same as Result page UI)
- "Delete" button per result
- "Clear All" button

---

## UTILITY FUNCTIONS

### `src/utils/scoring.js`
```javascript
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
  return { correct, wrong, skipped, marksEarned, negativeDeducted, finalScore };
}
```

### `src/utils/examCode.js`
```javascript
import { nanoid } from 'nanoid';
export const generateExamCode = () => nanoid(8).toUpperCase();
```

### `src/utils/mathParser.jsx`
```jsx
import { InlineMath } from 'react-katex';
export function RenderMath({ text }) {
  if (!text) return null;
  const parts = text.split(/(\$\$[^$]+\$\$)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('$$') && part.endsWith('$$')
          ? <InlineMath key={i} math={part.slice(2, -2)} />
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}
```

### `src/utils/localStorage.js`
```javascript
export function saveResult(examCode, resultData) {
  const key = `examResult_${examCode}_${Date.now()}`;
  const data = { ...resultData, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  localStorage.setItem(key, JSON.stringify(data));
}

export function getAllSavedResults() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('examResult_'))
    .map(k => JSON.parse(localStorage.getItem(k)))
    .filter(r => r.expiresAt > Date.now());
}
```

---

## FIREBASE CONFIG

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // REPLACE WITH YOUR FIREBASE CONFIG
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## PROTECTED ROUTE COMPONENT

```jsx
// src/components/ProtectedRoute.jsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin" replace />;
  return children;
}
```

---

## FIRESTORE SECURITY RULES

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /subjects/{id}  { allow read: if true; allow write: if request.auth != null; }
    match /chapters/{id}  { allow read: if true; allow write: if request.auth != null; }
    match /exams/{id}     { allow read: if true; allow write: if request.auth != null; }
    match /questions/{id} { allow read: if true; allow write: if request.auth != null; }
  }
}
```

---

## UI/UX REQUIREMENTS

- Modern, clean design using Tailwind CSS utility classes
- Responsive (mobile-friendly)
- Color scheme: Indigo/purple for admin, clean white/gray for public pages, red accents for timer
- Toast notifications for save/copy actions
- Loading spinners for Firestore fetches
- Smooth transitions between questions
- All forms have proper validation with user-friendly error messages
- Admin navbar: persistent top navbar on all admin pages with links and logout
- Question navigation grid: show answered/unanswered/current at a glance

---

## IMPORTANT CONSTRAINTS

1. NO backend server. All logic is in the React frontend.
2. Students do NOT log in or register. All exams are publicly accessible.
3. Student results are stored ONLY in localStorage, never in Firestore.
4. Admin uses Firebase email/password authentication only.
5. LaTeX must render correctly in both questions and options.
6. Images are loaded by URL (no file upload), always show fallback if URL fails.
7. Exam codes are unique 8-character alphanumeric strings (uppercase).
8. A student can attend any exam unlimited times.
9. In Practice Mode, correct/wrong feedback shows IMMEDIATELY after selecting an option — no submit needed per question.
10. In Exam Mode, NO feedback is shown until final submission.

---

Please generate the complete project with all files. Start with:
1. `package.json`
2. `vite.config.js`
3. `src/main.jsx` and `src/App.jsx` with all routes
4. All pages and components as listed
5. Firebase config (with placeholders)
6. All utility files

Generate the full code, not summaries or skeletons. Every file should be complete and functional.

---

*This prompt is for Google AI Studio (Gemini 2.5 Pro recommended for best results)*
