# 🎓 Online Exam System — Project Documentation

**Project Name:** Online Exam System (Working Title: *Proshno*)
**Stack:** React + Vite, Firebase Auth, Firestore, No backend server
**Designed for:** Coaching centers, schools, or individual educators
**Developer Background:** BUET CSE student | Radiance Coaching Center, Tongi, Gazipur

---

## 📌 Project Overview

Proshno is a fully client-side web application that enables educators to create structured exams organized by **Subject → Chapter → Exam**, and allows students to attend those exams in either **Practice Mode** or **Exam Mode** — all without any backend server. Firebase handles authentication for admin and Firestore handles all persistent data.

Students do not need to register or log in. They can access all exams publicly, attend them unlimited times, and optionally save their results locally for up to 30 days.

---

## 🧩 Core Features

### Admin Features
- Secure login via Firebase Authentication (email/password)
- Create **Subjects** (e.g., Physics, Chemistry, Math)
- Under each Subject, create **Chapters** (e.g., Chapter 1: Atomic Structure)
- Under each Chapter, create **Exams**
- Add **Questions** to each exam with:
  - Question text (supports **LaTeX** math equations via KaTeX/MathJax)
  - Optional question image (by URL)
  - 4 options (A, B, C, D), each optionally with an image (by URL)
  - Correct answer designation
  - Per-question time limit (in seconds or minutes)
- Set exam-level metadata: total marks, negative marking, number of questions visible to students
- System auto-generates a **unique shareable link** for each exam

### Student/User Features
- **Home Page:** Browse all exams, filter by Subject and Chapter
- **Exam Entry:** Choose number of questions to attempt (up to the exam's maximum), or attempt all
- **Two Modes:**
  - **Practice Mode:** No time limit; each answered question immediately shows correct/incorrect with the right answer highlighted
  - **Exam Mode:** Countdown timer (per-exam total time); auto-submits on timeout; manual submit available
- **Post-Exam Report:** Detailed breakdown — total correct, wrong, skipped, marks earned, negative marks, final score; every question reviewed with student's answer vs. correct answer
- **Save Result:** One-click save to `localStorage` (no account needed), retained for 30 days
- Unlimited re-attempts of any exam

---

## 🗂️ Database Schema (Firestore)

Firestore is a NoSQL document database. The schema below uses a hierarchical collection/document model.

---

### Collection: `subjects`

```
subjects/
  {subjectId}/
    name: string               // e.g., "Chemistry"
    slug: string               // e.g., "chemistry" (URL-friendly)
    createdAt: timestamp
    order: number              // display order
```

---

### Collection: `chapters` (top-level, linked to subject)

```
chapters/
  {chapterId}/
    subjectId: string          // reference to subjects/{subjectId}
    name: string               // e.g., "Chapter 3: Chemical Bonding"
    slug: string
    order: number
    createdAt: timestamp
```

> **Why top-level?** Easier to query all chapters for a subject with a single `.where()` filter, instead of navigating nested subcollections.

---

### Collection: `exams`

```
exams/
  {examId}/
    subjectId: string          // reference to subjects/{subjectId}
    chapterId: string          // reference to chapters/{chapterId}
    title: string              // e.g., "MCQ Test - Chemical Bonding"
    description: string        // optional short description
    totalQuestions: number     // total questions in this exam
    marksPerCorrect: number    // e.g., 1
    negativeMarks: number      // e.g., 0.25 (set 0 for no negative marking)
    defaultTimePerQuestion: number  // in seconds, used as fallback
    totalTimeSeconds: number   // total exam duration for Exam Mode
    examCode: string           // auto-generated unique 8-char code, e.g. "XK9P2MQA"
    examLink: string           // full shareable URL: /exam/{examCode}
    createdAt: timestamp
    isPublished: boolean       // false = draft, true = visible to students
```

---

### Collection: `questions`

```
questions/
  {questionId}/
    examId: string             // reference to exams/{examId}
    order: number              // question sequence number (1, 2, 3...)
    questionText: string       // plain text or LaTeX mixed, e.g. "Find $$x^2 + 1 = 0$$"
    questionImageUrl: string   // optional image URL for the question
    options: [                 // always 4 options
      {
        label: string,         // "A", "B", "C", "D"
        text: string,          // option text (supports LaTeX)
        imageUrl: string       // optional image URL for this option
      }
    ]
    correctOption: string      // "A" | "B" | "C" | "D"
    timeSeconds: number        // per-question time override (0 = use exam default)
    createdAt: timestamp
```

---

### NOT stored in Firestore (stored in localStorage only):

```javascript
// Key: "examResult_{examCode}_{timestamp}"
// Stored as JSON, expires after 30 days

{
  examId: string,
  examCode: string,
  examTitle: string,
  subjectName: string,
  chapterName: string,
  mode: "practice" | "exam",
  attemptedAt: ISO8601 string,
  expiresAt: ISO8601 string,       // attemptedAt + 30 days
  questionsAttempted: number,
  totalQuestions: number,
  
  score: {
    correct: number,
    wrong: number,
    skipped: number,
    marksEarned: number,
    negativeMarksDeducted: number,
    finalScore: number,
    totalPossibleMarks: number
  },

  answers: [
    {
      questionId: string,
      questionText: string,
      questionImageUrl: string,
      options: [...],
      correctOption: string,
      selectedOption: string | null,   // null = skipped
      isCorrect: boolean,
      timeTaken: number                // seconds
    }
  ]
}
```

---

## 🗺️ Page / Route Structure

```
/                          → Home: All exams, filter by subject/chapter
/admin                     → Admin login page
/admin/dashboard           → Admin overview
/admin/subjects            → Manage subjects
/admin/chapters            → Manage chapters (filterable by subject)
/admin/exams               → Manage exams list
/admin/exams/new           → Create new exam
/admin/exams/:examId       → Edit exam metadata
/admin/exams/:examId/questions        → Add/edit/reorder questions
/exam/:examCode            → Exam entry page (choose mode, question count)
/exam/:examCode/session    → Active exam session
/exam/:examCode/result     → Post-exam report
/results                   → Saved local results list
```

---

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Subjects, chapters, exams, questions: PUBLIC read
    match /subjects/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /chapters/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /exams/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /questions/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🧱 Tech Stack & Libraries

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Firebase Auth | firebase/auth (email/password) |
| Database | Firebase Firestore |
| Math/LaTeX | KaTeX (via react-katex) |
| Unique ID generation | nanoid (for exam codes) |
| Local Storage | Native browser localStorage with expiry logic |
| Hosting | Firebase Hosting (recommended) |

---

## 🔗 Exam Link Generation Logic

```javascript
import { nanoid } from 'nanoid';

const examCode = nanoid(8).toUpperCase(); // e.g. "XK9P2MQA"
const examLink = `${window.location.origin}/exam/${examCode}`;

// Stored in Firestore: exams/{examId}.examCode = examCode
// Route: /exam/:examCode → look up exam by examCode field
```

---

## ⏱️ Timer Logic (Exam Mode)

- Total time = `exam.totalTimeSeconds`
- Timer starts when student starts exam session
- Stored in component state + `sessionStorage` (so refreshing mid-exam doesn't reset timer)
- On timeout: auto-submit with all unanswered questions marked as skipped
- Countdown shown persistently at top of screen

---

## 📊 Scoring Formula

```
Final Score = (correct × marksPerCorrect) - (wrong × negativeMarks)

Example:
  20 questions attempted
  15 correct × 1 mark = 15
  4 wrong × 0.25 negative = -1
  Final = 14 marks
  1 skipped = 0 marks
```

---

## 🧩 LaTeX Support

Questions and options support inline and block LaTeX:

- Inline: `$$x^2 + y^2 = z^2$$`
- Block: `\[E = mc^2\]`

Rendered using **react-katex** or **react-mathjax2**:

```jsx
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Parse question text and render LaTeX parts
function RenderMath({ text }) {
  // Split on $$ delimiters, alternate plain/math segments
}
```

---

## 📁 Recommended Folder Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── SubjectForm.jsx
│   │   ├── ChapterForm.jsx
│   │   ├── ExamForm.jsx
│   │   └── QuestionEditor.jsx
│   ├── exam/
│   │   ├── ExamCard.jsx
│   │   ├── QuestionDisplay.jsx
│   │   ├── Timer.jsx
│   │   ├── OptionButton.jsx
│   │   └── ResultReport.jsx
│   └── shared/
│       ├── MathRenderer.jsx
│       └── FilterBar.jsx
├── pages/
│   ├── Home.jsx
│   ├── ExamEntry.jsx
│   ├── ExamSession.jsx
│   ├── ExamResult.jsx
│   ├── SavedResults.jsx
│   └── admin/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Subjects.jsx
│       ├── Chapters.jsx
│       ├── Exams.jsx
│       └── QuestionManager.jsx
├── firebase/
│   ├── config.js
│   ├── auth.js
│   └── firestore.js
├── hooks/
│   ├── useAuth.js
│   ├── useExam.js
│   └── useLocalResults.js
└── utils/
    ├── examCode.js
    ├── scoring.js
    ├── localStorage.js
    └── mathParser.js
```

---

## ⚙️ Firebase Setup Steps

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Create a **Firestore database** (start in test mode, then apply rules above)
4. Register a **Web App** and copy config to `src/firebase/config.js`
5. Create the first admin user manually in Firebase Console → Authentication → Add User
6. (Optional) Enable **Firebase Hosting**: `firebase init hosting` → `firebase deploy`

---

## 🚀 Development Notes

- No user registration/login needed for students — fully public exam access
- Admin is a single user (or small team) — no role management needed beyond `auth != null`
- All student results stay **client-side only** (localStorage), no privacy concerns
- Exams can be shared via direct link or exam code
- Future enhancement: leaderboard using Firebase if needed

---

*Last updated: March 2026 | Developed by Abir Abdullah, BUET CSE*
