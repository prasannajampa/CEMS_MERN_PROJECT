import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventCard, { formatDate } from '../components/EventCard';
import { TypeBadge } from '../components/EventCard';

const API = 'http://localhost:5000/api';
const TYPES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];
const BLANK = { eventName: '', description: '', date: '', time: '', venue: '', eventType: 'Technical', maxParticipants: 100 };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const headers  = { Authorization: `Bearer ${token}` };

  const [tab,        setTab]        = useState('events');   // 'events' | 'create' | 'participants'
  const [events,     setEvents]     = useState([]);
  const [regStats,   setRegStats]   = useState({ total: 0 });
  const [form,       setForm]       = useState(BLANK);
  const [editId,     setEditId]     = useState(null);
  const [msg,        setMsg]        = useState({ type: '', text: '' });
  const [loading,    setLoading]    = useState(false);
  const [deleting,   setDeleting]   = useState(null);
  const [selEvent,   setSelEvent]   = useState(null);
  const [participants, setParticipants] = useState([]);

  // Guard
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') navigate('/login');
    else { fetchEvents(); fetchStats(); }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch { showMsg('error', 'Failed to load events'); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/registrations/stats`, { headers });
      setRegStats(res.data);
    } catch {}
  };

  const fetchParticipants = async (eventId) => {
    try {
      const res = await axios.get(`${API}/events/${eventId}/registrations`, { headers });
      setParticipants(res.data);
    } catch { setParticipants([]); }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/events/${editId}`, form, { headers });
        showMsg('success', 'Event updated successfully!');
        setEditId(null);
      } else {
        await axios.post(`${API}/events`, form, { headers });
        showMsg('success', 'Event created successfully!');
      }
      setForm(BLANK);
      setTab('events');
      fetchEvents();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to save event');
    } finally { setLoading(false); }
  };

  const handleEdit = (event) => {
    setForm({
      eventName: event.eventName, description: event.description || '',
      date: event.date?.slice(0, 10), time: event.time,
      venue: event.venue, eventType: event.eventType,
      maxParticipants: event.maxParticipants || 100,
    });
    setEditId(event._id);
    setTab('create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event and all its registrations?')) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/events/${id}`, { headers });
      showMsg('success', 'Event deleted');
      fetchEvents(); fetchStats();
    } catch { showMsg('error', 'Delete failed'); }
    finally { setDeleting(null); }
  };

  const openParticipants = async (event) => {
    setSelEvent(event);
    await fetchParticipants(event._id);
    setTab('participants');
  };

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;

  // ── TAB STYLES ────────────────────────────────────────────
  const tabStyle = (t) => ({
    padding: '10px 22px', borderRadius: 10, cursor: 'pointer',
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
    transition: 'all 0.2s ease', border: 'none',
    background: tab === t ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.05)',
    color: tab === t ? '#0B1120' : '#9CA3AF',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar role="admin" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Page header ─────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15 }}>Manage your college events and participants</p>
        </div>

        {/* ── Stats row ───────────────────────────────────── */}
        <div className="fade-up-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Events',    num: events.length,    icon: '📅', color: '#F59E0B', rgb: '245,158,11' },
            { label: 'Upcoming Events', num: upcomingCount,    icon: '🚀', color: '#14B8A6', rgb: '20,184,166' },
            { label: 'Registrations',   num: regStats.total,   icon: '✅', color: '#8B5CF6', rgb: '139,92,246' },
            { label: 'Event Types',     num: TYPES.length - 1, icon: '🏷️', color: '#F43F5E', rgb: '244,63,94'  },
          ].map(s => (
            <div key={s.label} style={{
              background: '#111827',
              border: `1px solid rgba(${s.rgb},0.2)`,
              borderRadius: 16, padding: '22px 24px',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ color: '#6B7280', fontSize: 13, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Global message ──────────────────────────────── */}
        {msg.text && (
          <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </div>
        )}

        {/* ── Tab bar ─────────────────────────────────────── */}
        <div className="fade-up-d2" style={{
          display: 'flex', gap: 10, marginBottom: 28,
          background: '#111827', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: 6, width: 'fit-content',
        }}>
          <button style={tabStyle('events')} onClick={() => setTab('events')}>📋 All Events</button>
          <button style={tabStyle('create')} onClick={() => { setTab('create'); setEditId(null); setForm(BLANK); }}>
            {editId ? '✏️ Edit Event' : '➕ Create Event'}
          </button>
          {tab === 'participants' && (
            <button style={tabStyle('participants')}>👥 Participants</button>
          )}
        </div>

        {/* ════════════════════════════════════════
            TAB: ALL EVENTS
        ════════════════════════════════════════ */}
        {tab === 'events' && (
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {events.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-icon">📭</div>
                <h3 style={{ color: '#D1D5DB', fontFamily: "'Syne', sans-serif" }}>No events yet</h3>
                <p>Click "Create Event" to add your first event</p>
                <button className="btn btn-amber" onClick={() => setTab('create')} style={{ marginTop: 8 }}>
                  ➕ Create Event
                </button>
              </div>
            ) : events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                actions={
                  <>
                    <button
                      onClick={() => openParticipants(event)}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 9, cursor: 'pointer',
                        background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.3)',
                        color: '#14B8A6', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#14B8A6'; e.target.style.color = '#0B1120'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(20,184,166,0.12)'; e.target.style.color = '#14B8A6'; }}
                    >
                      👥 Participants
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 9, cursor: 'pointer',
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        color: '#F59E0B', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#F59E0B'; e.target.style.color = '#0B1120'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(245,158,11,0.12)'; e.target.style.color = '#F59E0B'; }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deleting === event._id}
                      style={{
                        padding: '9px 14px', borderRadius: 9, cursor: 'pointer',
                        background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)',
                        color: '#F43F5E', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#F43F5E'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(244,63,94,0.12)'; e.target.style.color = '#F43F5E'; }}
                    >
                      {deleting === event._id ? '…' : '🗑'}
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: CREATE / EDIT EVENT
        ════════════════════════════════════════ */}
        {tab === 'create' && (
          <div className="fade-up" style={{ maxWidth: 680 }}>
            <div style={{
              background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 36,
            }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 28 }}>
                {editId ? '✏️ Edit Event' : '➕ Create New Event'}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Event Name */}
                <div className="form-group">
                  <label className="form-label">Event Name *</label>
                  <input className="form-input" name="eventName"
                    placeholder="e.g. Tech Fest 2024"
                    value={form.eventName} onChange={handleChange} required />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" name="description"
                    placeholder="Describe the event..."
                    value={form.description} onChange={handleChange} />
                </div>

                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input className="form-input" type="date" name="date"
                      value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <input className="form-input" type="time" name="time"
                      value={form.time} onChange={handleChange} required />
                  </div>
                </div>

                {/* Venue & Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Venue *</label>
                    <input className="form-input" name="venue"
                      placeholder="e.g. Main Auditorium"
                      value={form.venue} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Type *</label>
                    <select className="form-select" name="eventType" value={form.eventType} onChange={handleChange}>
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Max Participants */}
                <div className="form-group" style={{ maxWidth: 200 }}>
                  <label className="form-label">Max Participants</label>
                  <input className="form-input" type="number" name="maxParticipants" min="1"
                    value={form.maxParticipants} onChange={handleChange} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" disabled={loading} style={{
                    flex: 1, padding: '14px', border: 'none', borderRadius: 12,
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#0B1120', fontFamily: "'Syne', sans-serif",
                    fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}>
                    {loading
                      ? <><div className="spinner" style={{ borderTopColor: '#0B1120' }} /> Saving...</>
                      : editId ? '💾 Update Event' : '🚀 Create Event'}
                  </button>
                  <button type="button" onClick={() => { setTab('events'); setEditId(null); setForm(BLANK); }}
                    style={{
                      padding: '14px 24px', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, background: 'transparent',
                      color: '#9CA3AF', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: PARTICIPANTS
        ════════════════════════════════════════ */}
        {tab === 'participants' && selEvent && (
          <div className="fade-up">
            {/* Back + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <button onClick={() => { setTab('events'); setSelEvent(null); }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '8px 16px', color: '#9CA3AF',
                  cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13,
                }}>
                ← Back
              </button>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' }}>
                  {selEvent.eventName}
                </h2>
                <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
                  {participants.length} registered participants
                </p>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>No registrations yet for this event</p>
              </div>
            ) : (
              <div style={{
                background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, overflow: 'hidden',
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '14px 24px',
                  background: 'rgba(245,158,11,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  fontFamily: "'Syne', sans-serif", fontSize: 12,
                  fontWeight: 700, color: '#F59E0B', letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  <span>Name</span><span>Roll No.</span><span>Department</span><span>Email</span>
                </div>

                {participants.map((reg, i) => (
                  <div key={reg._id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    padding: '14px 24px', fontSize: 14,
                    borderBottom: i < participants.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#D1D5DB', fontWeight: 600 }}>{reg.studentId?.studentName}</span>
                    <span style={{ color: '#9CA3AF' }}>{reg.studentId?.rollNumber}</span>
                    <span style={{ color: '#9CA3AF' }}>{reg.studentId?.department}</span>
                    <span style={{ color: '#6B7280', fontSize: 13 }}>{reg.studentId?.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
