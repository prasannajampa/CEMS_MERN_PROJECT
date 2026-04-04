import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || 'student';

  const [role, setRole]       = useState(defaultRole);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';
  const accent  = isAdmin ? '#F59E0B' : '#14B8A6';
  const accentRgb = isAdmin ? '245,158,11' : '20,184,166';

  return (
    <div style={{
      minHeight: '100vh', background: '#0B1120',
      display: 'flex', fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }} className="hide-mobile">
        {/* Glow blob */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: isAdmin
            ? 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380 }}>
          {/* Big emoji */}
          <div style={{
            fontSize: 80, marginBottom: 32,
            animation: 'float 4s ease-in-out infinite',
          }}>
            {isAdmin ? '👑' : '🎒'}
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 36,
            fontWeight: 800, color: '#fff', marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            {isAdmin ? 'Admin Portal' : 'Student Portal'}
          </h2>
          <p style={{ color: '#6B7280', fontSize: 16, lineHeight: 1.7 }}>
            {isAdmin
              ? 'Manage events, track registrations, and control the entire college event ecosystem.'
              : 'Discover events, register instantly, and never miss what\'s happening on campus.'}
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 32 }}>
            {(isAdmin
              ? ['Create Events', 'View Participants', 'Dashboard Stats', 'Delete Events']
              : ['Browse Events', 'Quick Register', 'Track My Events', 'Real-time Alerts']
            ).map(f => (
              <span key={f} style={{
                padding: '6px 16px', borderRadius: 100,
                background: `rgba(${accentRgb},0.12)`,
                border: `1px solid rgba(${accentRgb},0.25)`,
                color: accent, fontSize: 13, fontWeight: 600,
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{
        width: 480, background: '#111827',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px',
        position: 'relative',
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: 24, left: 24,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '8px 16px',
            color: '#9CA3AF', fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← Back
        </button>

        {/* Logo */}
        <div style={{ marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, fontSize: 16,
              background: 'linear-gradient(135deg, #F59E0B, #F43F5E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>🎓</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>
              Edu<span style={{ color: '#F59E0B' }}>Fest</span>
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 28,
            fontWeight: 800, color: '#fff', marginBottom: 8,
          }}>
            Welcome back 👋
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15 }}>Sign in to your account to continue</p>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex', background: '#0B1120',
          borderRadius: 12, padding: 4, marginBottom: 28,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['student', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError(''); }}
              style={{
                flex: 1, padding: '10px 0',
                background: role === r
                  ? (r === 'admin' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #14B8A6, #0D9488)')
                  : 'transparent',
                color: role === r ? (r === 'admin' ? '#0B1120' : '#0B1120') : '#6B7280',
                border: 'none', borderRadius: 9,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 14, cursor: 'pointer',
                transition: 'all 0.25s ease',
                textTransform: 'capitalize',
              }}
            >
              {r === 'admin' ? '👑 Admin' : '🎒 Student'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8, padding: '14px',
              background: isAdmin
                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                : 'linear-gradient(135deg, #14B8A6, #0D9488)',
              color: '#0B1120', border: 'none', borderRadius: 12,
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            {loading ? <><div className="spinner" style={{ borderTopColor: '#0B1120' }} /> Signing in...</> : `Sign in as ${isAdmin ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <div className="divider" />

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: accent, cursor: 'pointer', fontWeight: 600 }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
