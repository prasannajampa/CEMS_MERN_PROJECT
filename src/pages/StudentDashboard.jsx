import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard, { formatDate } from '../components/EventCard';

const API = 'http://localhost:5000/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const headers  = { Authorization: `Bearer ${token}` };

  const [tab,        setTab]        = useState('browse');  // 'browse' | 'myevents'
  const [events,     setEvents]     = useState([]);
  const [myRegs,     setMyRegs]     = useState([]);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [registering,setRegistering]= useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [msg,        setMsg]        = useState({ type: '', text: '' });

  // Guard
  useEffect(() => {
    if (!token || user.role !== 'student') navigate('/login');
    else { fetchEvents(); fetchMyRegs(); }
  }, []);

  const fetchEvents  = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data);
  };

  const fetchMyRegs = async () => {
    const res = await axios.get(`${API}/registrations/my`, { headers });
    setMyRegs(res.data);
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const isRegistered = (eventId) => myRegs.some(r => r.eventId?._id === eventId);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await axios.post(`${API}/registrations`, { eventId }, { headers });
      showMsg('success', 'Successfully registered! 🎉');
      fetchMyRegs();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Registration failed');
    } finally { setRegistering(null); }
  };

  const handleCancel = async (regId) => {
    if (!window.confirm('Cancel this registration?')) return;
    setCancelling(regId);
    try {
      await axios.delete(`${API}/registrations/${regId}`, { headers });
      showMsg('info', 'Registration cancelled');
      fetchMyRegs();
    } catch { showMsg('error', 'Failed to cancel'); }
    finally { setCancelling(null); }
  };

  // Filter logic
  const EVENT_TYPES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];
  const filteredEvents = events.filter(e => {
    const matchType   = filter === 'All' || e.eventType === filter;
    const matchSearch = !search || e.eventName.toLowerCase().includes(search.toLowerCase())
      || e.venue?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;

  const tabStyle = (t) => ({
    padding: '10px 22px', borderRadius: 10, cursor: 'pointer',
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
    transition: 'all 0.2s ease', border: 'none',
    background: tab === t ? 'linear-gradient(135deg, #14B8A6, #0D9488)' : 'rgba(255,255,255,0.05)',
    color: tab === t ? '#0B1120' : '#9CA3AF',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar role="student" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Welcome header ───────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Hey, {user.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15 }}>
            {user.department && <span style={{ color: '#14B8A6' }}>{user.department}</span>}
            {user.rollNumber && <span style={{ color: '#6B7280' }}> · {user.rollNumber}</span>}
          </p>
        </div>

        {/* ── Stats ───────────────────────────────────────── */}
        <div className="fade-up-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Events',    num: events.length,  icon: '📅', color: '#F59E0B', rgb: '245,158,11' },
            { label: 'Upcoming',        num: upcomingCount,  icon: '🚀', color: '#14B8A6', rgb: '20,184,166' },
            { label: 'My Registrations',num: myRegs.length,  icon: '✅', color: '#8B5CF6', rgb: '139,92,246' },
            { label: 'Events Available',num: filteredEvents.filter(e => !isRegistered(e._id)).length, icon: '🎯', color: '#F43F5E', rgb: '244,63,94' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#111827',
              border: `1px solid rgba(${s.rgb},0.2)`,
              borderRadius: 16, padding: '20px 22px',
              transition: 'all 0.25s ease', cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ color: '#6B7280', fontSize: 12, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Message ─────────────────────────────────────── */}
        {msg.text && (
          <div className={`alert alert-${msg.type === 'success' ? 'success' : msg.type === 'info' ? 'info' : 'error'}`}
            style={{ marginBottom: 20 }}>
            {msg.type === 'success' ? '✅' : msg.type === 'info' ? 'ℹ️' : '⚠️'} {msg.text}
          </div>
        )}

        {/* ── Tab bar ─────────────────────────────────────── */}
        <div className="fade-up-d2" style={{
          display: 'flex', gap: 10, marginBottom: 24,
          background: '#111827', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: 6, width: 'fit-content',
        }}>
          <button style={tabStyle('browse')}  onClick={() => setTab('browse')}>🔍 Browse Events</button>
          <button style={tabStyle('myevents')} onClick={() => setTab('myevents')}>
            ✅ My Events {myRegs.length > 0 && (
              <span style={{
                marginLeft: 6, background: '#14B8A6', color: '#0B1120',
                borderRadius: 100, padding: '1px 8px', fontSize: 12,
              }}>{myRegs.length}</span>
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════════
            TAB: BROWSE EVENTS
        ══════════════════════════════════════════ */}
        {tab === 'browse' && (
          <>
            {/* Search + Filter */}
            <div className="fade-up" style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}>🔍</span>
                <input
                  className="form-input"
                  placeholder="Search events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>

              {/* Type filter pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {EVENT_TYPES.map(t => (
                  <button key={t} onClick={() => setFilter(t)} style={{
                    padding: '8px 16px', borderRadius: 100, cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                    transition: 'all 0.2s ease', border: 'none',
                    background: filter === t ? '#14B8A6' : 'rgba(255,255,255,0.06)',
                    color: filter === t ? '#0B1120' : '#9CA3AF',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Events grid */}
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>No events match your search</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 20 }}>
                {filteredEvents.map(event => {
                  const registered = isRegistered(event._id);
                  const isPast     = new Date(event.date) < new Date();

                  return (
                    <EventCard
                      key={event._id}
                      event={event}
                      actions={
                        <button
                          onClick={() => !registered && !isPast && handleRegister(event._id)}
                          disabled={registered || isPast || registering === event._id}
                          style={{
                            flex: 1, padding: '11px 0', borderRadius: 10,
                            cursor: (registered || isPast) ? 'not-allowed' : 'pointer',
                            border: 'none',
                            background: registered
                              ? 'rgba(16,185,129,0.15)'
                              : isPast
                              ? 'rgba(255,255,255,0.05)'
                              : 'linear-gradient(135deg, #14B8A6, #0D9488)',
                            color: registered ? '#10B981' : isPast ? '#6B7280' : '#0B1120',
                            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
                            transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: (!registered && !isPast) ? '0 4px 16px rgba(20,184,166,0.35)' : 'none',
                          }}
                        >
                          {registering === event._id
                            ? <><div className="spinner" style={{ borderTopColor: '#0B1120' }} /> Registering...</>
                            : registered
                            ? '✅ Registered'
                            : isPast
                            ? '⏰ Event Ended'
                            : '🎯 Register Now'}
                        </button>
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════
            TAB: MY EVENTS
        ══════════════════════════════════════════ */}
        {tab === 'myevents' && (
          <div className="fade-up">
            {myRegs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎟️</div>
                <h3 style={{ color: '#D1D5DB', fontFamily: "'Syne', sans-serif" }}>No registrations yet</h3>
                <p>Browse events and click Register to join!</p>
                <button className="btn btn-teal" onClick={() => setTab('browse')} style={{ marginTop: 8 }}>
                  🔍 Browse Events
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myRegs.map(reg => {
                  const event  = reg.eventId;
                  const isPast = event?.date && new Date(event.date) < new Date();
                  if (!event) return null;

                  return (
                    <div key={reg._id} style={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16, padding: '22px 26px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 20,
                      transition: 'all 0.25s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ flex: 1 }}>
                        {/* Type + Status badges */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                            background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)', color: '#14B8A6',
                          }}>{event.eventType}</span>
                          <span style={{
                            padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                            background: isPast ? 'rgba(156,163,175,0.1)' : 'rgba(16,185,129,0.12)',
                            border: `1px solid ${isPast ? 'rgba(156,163,175,0.2)' : 'rgba(16,185,129,0.3)'}`,
                            color: isPast ? '#9CA3AF' : '#10B981',
                          }}>{isPast ? '⏰ Past' : '🟢 Upcoming'}</span>
                        </div>

                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                          {event.eventName}
                        </h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 13, color: '#9CA3AF' }}>
                          <span>📅 {formatDate(event.date)}</span>
                          <span>🕐 {event.time}</span>
                          <span>📍 {event.venue}</span>
                          <span style={{ color: '#6B7280', fontSize: 12 }}>
                            Registered: {new Date(reg.registrationDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Cancel button */}
                      {!isPast && (
                        <button
                          onClick={() => handleCancel(reg._id)}
                          disabled={cancelling === reg._id}
                          style={{
                            padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
                            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                            color: '#F43F5E', fontFamily: "'Syne', sans-serif",
                            fontWeight: 700, fontSize: 13, transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => { e.target.style.background = '#F43F5E'; e.target.style.color = '#fff'; }}
                          onMouseLeave={e => { e.target.style.background = 'rgba(244,63,94,0.1)'; e.target.style.color = '#F43F5E'; }}
                        >
                          {cancelling === reg._id ? '…' : '✕ Cancel'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
