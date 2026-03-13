import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function AdminNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex gap-6">
            <Link to="/admin/dashboard" className="font-semibold hover:text-indigo-200">
              Proshno
            </Link>
            <Link to="/admin/subjects" className="hover:text-indigo-200">Subjects</Link>
            <Link to="/admin/chapters" className="hover:text-indigo-200">Chapters</Link>
            <Link to="/admin/exams" className="hover:text-indigo-200">Exams</Link>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-indigo-800 hover:bg-indigo-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
