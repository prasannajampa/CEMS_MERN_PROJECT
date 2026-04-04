import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Floating decoration blob
function Blob({ style }) {
  return <div style={{
    position: 'absolute', borderRadius: '50%',
    filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none',
    ...style
  }} />;
}

// Animated stat counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 35);
    return () => clearInterval(t);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{
      minHeight: '100vh', background: '#0B1120',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <Blob style={{ width: 600, height: 600, background: '#F59E0B', top: -200, left: -200 }} />
      <Blob style={{ width: 500, height: 500, background: '#F43F5E', bottom: -100, right: -100 }} />
      <Blob style={{ width: 400, height: 400, background: '#14B8A6', top: '40%', left: '50%' }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(11,17,32,0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #F59E0B, #F43F5E)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🎓</div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontSize: 22,
            fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
          }}>
            Edu<span style={{ color: '#F59E0B' }}>Fest</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn btn-amber btn-sm" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{
        textAlign: 'center', padding: '90px 24px 60px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Pill badge */}
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 100, padding: '6px 18px', marginBottom: 28,
        }}>
          <span style={{ fontSize: 13, color: '#F59E0B', fontWeight: 600 }}>
            ✨ College Event Management System
          </span>
        </div>

        <h1 className="fade-up-d1" style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(42px, 7vw, 82px)',
          fontWeight: 800, lineHeight: 1.1,
          color: '#fff', marginBottom: 24,
          letterSpacing: '-0.03em',
        }}>
          Your Campus.<br />
          <span style={{ color: '#F59E0B' }}>Every</span>{' '}
          <span style={{
            background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Event.</span>
        </h1>

        <p className="fade-up-d2" style={{
          fontSize: 18, color: '#9CA3AF', maxWidth: 520, margin: '0 auto 48px',
          lineHeight: 1.7, fontWeight: 400,
        }}>
          Discover, register, and manage college events in one beautiful platform.
          Built for students and administrators.
        </p>

        {/* Stats row */}
        <div className="fade-up-d3" style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          marginBottom: 64, flexWrap: 'wrap',
        }}>
          {[
            { num: 500, suffix: '+', label: 'Students' },
            { num: 120, suffix: '+', label: 'Events' },
            { num: 8,   suffix: '',  label: 'Departments' },
            { num: 98,  suffix: '%', label: 'Satisfaction' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 38,
                fontWeight: 800, color: '#F59E0B',
              }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOGIN CARDS ─────────────────────────────────────── */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '0 24px 100px',
        position: 'relative', zIndex: 1,
      }}>
        <h2 className="fade-up" style={{
          textAlign: 'center', fontFamily: "'Syne', sans-serif",
          fontSize: 32, fontWeight: 700, marginBottom: 12,
          color: '#fff',
        }}>
          Choose Your Portal
        </h2>
        <p className="fade-up-d1" style={{
          textAlign: 'center', color: '#6B7280', marginBottom: 48, fontSize: 16,
        }}>
          Select your role to get started
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ADMIN CARD */}
          <div
            className="fade-up-d2"
            onMouseEnter={() => setHoveredCard('admin')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/login', { state: { defaultRole: 'admin' } })}
            style={{
              background: hoveredCard === 'admin'
                ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,63,94,0.1))'
                : '#111827',
              border: hoveredCard === 'admin'
                ? '1px solid rgba(245,158,11,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: 40, cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === 'admin' ? 'translateY(-6px)' : 'translateY(0)',
              boxShadow: hoveredCard === 'admin'
                ? '0 20px 60px rgba(245,158,11,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Corner accent */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 120, height: 120,
              background: 'radial-gradient(circle at top right, rgba(245,158,11,0.2), transparent 70%)',
            }} />

            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              borderRadius: 18, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, marginBottom: 24,
              boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
            }}>
              👑
            </div>

            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 26,
              fontWeight: 800, color: '#fff', marginBottom: 12,
            }}>
              Admin Portal
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
              Create and manage events, view participants, monitor registrations, and control the entire platform.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Create & manage events', 'View all registrations', 'Participant tracking', 'Dashboard analytics'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#D1D5DB' }}>
                  <span style={{ color: '#F59E0B', fontSize: 16 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#F59E0B', fontFamily: "'Syne', sans-serif",
              fontSize: 15, fontWeight: 700,
            }}>
              Login as Admin
              <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: hoveredCard === 'admin' ? 'translateX(4px)' : 'none' }}>→</span>
            </div>
          </div>

          {/* STUDENT CARD */}
          <div
            className="fade-up-d3"
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/login', { state: { defaultRole: 'student' } })}
            style={{
              background: hoveredCard === 'student'
                ? 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(139,92,246,0.1))'
                : '#111827',
              border: hoveredCard === 'student'
                ? '1px solid rgba(20,184,166,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: 40, cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === 'student' ? 'translateY(-6px)' : 'translateY(0)',
              boxShadow: hoveredCard === 'student'
                ? '0 20px 60px rgba(20,184,166,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 120, height: 120,
              background: 'radial-gradient(circle at top right, rgba(20,184,166,0.2), transparent 70%)',
            }} />

            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
              borderRadius: 18, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, marginBottom: 24,
              boxShadow: '0 8px 24px rgba(20,184,166,0.4)',
            }}>
              🎒
            </div>

            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 26,
              fontWeight: 800, color: '#fff', marginBottom: 12,
            }}>
              Student Portal
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
              Browse all campus events, register with a single click, track your registrations, and stay updated.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Browse all events', 'One-click registration', 'My events tracker', 'Real-time notifications'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#D1D5DB' }}>
                  <span style={{ color: '#14B8A6', fontSize: 16 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#14B8A6', fontFamily: "'Syne', sans-serif",
              fontSize: 15, fontWeight: 700,
            }}>
              Login as Student
              <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: hoveredCard === 'student' ? 'translateX(4px)' : 'none' }}>→</span>
            </div>
          </div>
        </div>

        {/* Register link */}
        <p className="fade-up-d4" style={{
          textAlign: 'center', marginTop: 40,
          color: '#6B7280', fontSize: 15,
        }}>
          New here?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#F59E0B', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            Create an account
          </span>
        </p>
      </section>

      {/* ── FEATURES STRIP ─────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '60px 48px',
        background: 'rgba(255,255,255,0.02)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36,
        }}>
          {[
            { icon: '⚡', color: '#F59E0B', title: 'Real-time Updates', desc: 'Get instant notifications when new events are created or updated.' },
            { icon: '🔒', color: '#8B5CF6', title: 'Secure & Role-based', desc: 'JWT authentication with separate portals for admins and students.' },
            { icon: '📊', color: '#14B8A6', title: 'Smart Dashboard', desc: 'Beautiful analytics and stats for admins to track event performance.' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56,
                background: `rgba(${f.color === '#F59E0B' ? '245,158,11' : f.color === '#8B5CF6' ? '139,92,246' : '20,184,166'}, 0.12)`,
                border: `1px solid ${f.color}33`,
                borderRadius: 16, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24,
                margin: '0 auto 16px',
              }}>
                {f.icon}
              </div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#fff' }}>
                {f.title}
              </h4>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        color: '#374151', fontSize: 13,
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        © 2024 EduFest — College Event Management System · IT Department
      </footer>
    </div>
  );
}
