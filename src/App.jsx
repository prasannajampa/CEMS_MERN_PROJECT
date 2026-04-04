import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import AdminDashboard  from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Guard: only let logged-in users with correct role through
function PrivateRoute({ children, role }) {
  const user  = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/student" element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
