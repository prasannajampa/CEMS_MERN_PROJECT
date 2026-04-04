import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole]       = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    adminName: '', studentName: '', rollNumber: '',
    email: '', department: '', password: '', confirmPassword: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const endpoint = role === 'admin' ? '/api/auth/register-admin' : '/api/auth/register-student';
      const payload  = role === 'admin'
        ? { adminName: form.adminName, email: form.email, password: form.password }
        : { studentName: form.studentName, rollNumber: form.rollNumber, email: form.email, department: form.department, password: form.password };

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate(role === 'admin' ? '/admin' : '/student'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin   = role === 'admin';
  const accent    = isAdmin ? '#F59E0B' : '#14B8A6';
  const accentRgb = isAdmin ? '245,158,11' : '20,184,166';

  const DEPTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'MBA', 'Other'];

  return (
    <div style={{
      minHeight: '100vh', background: '#0B1120',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", padding: '40px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', filter: 'blur(100px)', opacity: 0.12, background: isAdmin ? '#F59E0B' : '#14B8A6', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, background: '#8B5CF6', bottom: -100, left: -100, pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 520,
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: '44px 44px',
        position: 'relative', zIndex: 1,
        animation: 'fadeUp 0.45s ease',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, fontSize: 24,
            background: 'linear-gradient(135deg, #F59E0B, #F43F5E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>🎓</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Create Account
          </h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Join EduFest today</p>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex', background: '#0B1120',
          borderRadius: 12, padding: 4, marginBottom: 28,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['student', 'admin'].map(r => (
            <button key={r} onClick={() => { setRole(r); setError(''); }}
              style={{
                flex: 1, padding: '10px 0',
                background: role === r
                  ? (r === 'admin' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #14B8A6, #0D9488)')
                  : 'transparent',
                color: role === r ? '#0B1120' : '#6B7280',
                border: 'none', borderRadius: 9,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 14, cursor: 'pointer', transition: 'all 0.25s ease',
              }}>
              {r === 'admin' ? '👑 Admin' : '🎒 Student'}
            </button>
          ))}
        </div>

        {error   && <div className="alert alert-error"   style={{ marginBottom: 18 }}>⚠️ {error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 18 }}>✅ {success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isAdmin ? (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="adminName" placeholder="Admin full name"
                value={form.adminName} onChange={handleChange} required />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="studentName" placeholder="Your full name"
                  value={form.studentName} onChange={handleChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-input" name="rollNumber" placeholder="24B11IT042"
                    value={form.rollNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleChange} required>
                    <option value="">Select dept</option>
                    {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@college.edu"
              value={form.email} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="Min 6 chars"
                value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: '14px',
            background: isAdmin
              ? 'linear-gradient(135deg, #F59E0B, #D97706)'
              : 'linear-gradient(135deg, #14B8A6, #0D9488)',
            color: '#0B1120', border: 'none', borderRadius: 12,
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'all 0.25s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            {loading ? <><div className="spinner" style={{ borderTopColor: '#0B1120' }} /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: accent, cursor: 'pointer', fontWeight: 600 }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
