import { useNavigate } from 'react-router-dom';

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isAdmin = role === 'admin';
  const accent  = isAdmin ? '#F59E0B' : '#14B8A6';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 32px', height: 64,
      background: '#111827',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #F59E0B, #F43F5E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>🎓</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff' }}>
          Edu<span style={{ color: '#F59E0B' }}>Fest</span>
        </span>
        <span style={{
          marginLeft: 8, padding: '3px 10px', borderRadius: 100,
          background: `rgba(${isAdmin ? '245,158,11' : '20,184,166'},0.12)`,
          border: `1px solid rgba(${isAdmin ? '245,158,11' : '20,184,166'},0.25)`,
          color: accent, fontSize: 11, fontWeight: 700,
          fontFamily: "'Syne', sans-serif", letterSpacing: '0.05em',
        }}>
          {isAdmin ? '👑 ADMIN' : '🎒 STUDENT'}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 100, padding: '6px 16px 6px 6px',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, ${isAdmin ? '#D97706' : '#0D9488'})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: '#0B1120',
          }}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span style={{ color: '#D1D5DB', fontSize: 14, fontWeight: 500 }}>{user.name}</span>
        </div>

        <button onClick={handleLogout} style={{
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.25)',
          color: '#F43F5E', borderRadius: 10,
          padding: '8px 18px', cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.target.style.background = '#F43F5E'; e.target.style.color = '#fff'; }}
          onMouseLeave={e => { e.target.style.background = 'rgba(244,63,94,0.1)'; e.target.style.color = '#F43F5E'; }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
