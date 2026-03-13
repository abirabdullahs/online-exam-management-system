# Proshno — Online Exam Management System

A full-stack web application for coaching centers, schools, and educators. Built with React + Vite, Firebase Auth, and Firestore. No backend server required.

## Features

### Admin
- Firebase email/password login
- Create **Subjects** → **Chapters** → **Exams** hierarchy
- Add MCQ questions with LaTeX support, optional images
- Auto-generated shareable exam links (8-character codes)
- Toggle publish/unpublish exams

### Students
- Browse exams (no login required)
- **Practice Mode**: No time limit, immediate feedback per question
- **Exam Mode**: Timed with countdown, results at the end
- Save results to localStorage (30-day retention)
- Unlimited re-attempts

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable **Authentication → Email/Password**
   - Create **Firestore database**
   - Add an admin user in Authentication
   - Update `src/firebase/config.js` if you need different credentials (already configured for your project)

3. **Firestore rules**
   - Deploy `firestore.rules` to your Firestore:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — Browse published exams |
| `/exam/:examCode` | Exam entry — Choose mode and question count |
| `/exam/:examCode/session` | Active exam session |
| `/exam/:examCode/result` | Post-exam report |
| `/saved-results` | Locally saved results |
| `/admin` | Admin login |
| `/admin/dashboard` | Dashboard |
| `/admin/subjects` | Manage subjects |
| `/admin/chapters` | Manage chapters |
| `/admin/exams` | Manage exams |
| `/admin/exams/new` | Create exam |
| `/admin/exams/:examId` | Edit exam |
| `/admin/exams/:examId/questions` | Add/edit questions |

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Firebase Auth + Firestore
- react-katex (LaTeX rendering)
- nanoid (exam codes)
