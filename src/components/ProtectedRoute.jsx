import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin" replace />;
  return children;
}
