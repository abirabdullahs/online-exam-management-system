import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import ExamEntry from './pages/ExamEntry';
import ExamSession from './pages/ExamSession';
import ExamResult from './pages/ExamResult';
import SavedResults from './pages/SavedResults';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Sessions from './pages/admin/Sessions';
import Subjects from './pages/admin/Subjects';
import Chapters from './pages/admin/Chapters';
import Exams from './pages/admin/Exams';
import ExamNew from './pages/admin/ExamNew';
import ExamEdit from './pages/admin/ExamEdit';
import QuestionManager from './pages/admin/QuestionManager';
import BulkUpload from './pages/admin/BulkUpload';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exam/:examCode" element={<ExamEntry />} />
        <Route path="/exam/:examCode/session" element={<ExamSession />} />
        <Route path="/exam/:examCode/result" element={<ExamResult />} />
        <Route path="/saved-results" element={<SavedResults />} />

        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/sessions" element={
          <ProtectedRoute><Sessions /></ProtectedRoute>
        } />
        <Route path="/admin/subjects" element={
          <ProtectedRoute><Subjects /></ProtectedRoute>
        } />
        <Route path="/admin/chapters" element={
          <ProtectedRoute><Chapters /></ProtectedRoute>
        } />
        <Route path="/admin/exams" element={
          <ProtectedRoute><Exams /></ProtectedRoute>
        } />
        <Route path="/admin/exams/new" element={
          <ProtectedRoute><ExamNew /></ProtectedRoute>
        } />
        <Route path="/admin/exams/:examId" element={
          <ProtectedRoute><ExamEdit /></ProtectedRoute>
        } />
        <Route path="/admin/exams/:examId/questions" element={
          <ProtectedRoute><QuestionManager /></ProtectedRoute>
        } />

        <Route path="/admin/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
