// Shared EventCard used in both Admin and Student dashboards

const TYPE_COLORS = {
  Technical: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', color: '#8B5CF6' },
  Cultural:  { bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)',  color: '#F43F5E' },
  Sports:    { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10B981' },
  Workshop:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B' },
  Seminar:   { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.3)', color: '#14B8A6' },
  Other:     { bg: 'rgba(156,163,175,0.12)',border: 'rgba(156,163,175,0.3)',color: '#9CA3AF' },
};

export function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.Other;
  return (
    <span style={{
      padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700,
      fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em',
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      {type}
    </span>
  );
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function EventCard({ event, actions }) {
  return (
    <div style={{
      background: '#1F2937',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: 22,
      transition: 'all 0.25s ease',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
        e.currentTarget.style.transform   = 'translateY(-3px)';
        e.currentTarget.style.boxShadow   = '0 12px 32px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform   = 'translateY(0)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <TypeBadge type={event.eventType || 'Other'} />
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
            color: '#fff', marginTop: 10, marginBottom: 4, lineHeight: 1.3,
          }}>
            {event.eventName}
          </h3>
          {event.description && (
            <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>
              {event.description.length > 90 ? event.description.slice(0, 90) + '…' : event.description}
            </p>
          )}
        </div>
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <MetaItem icon="📅" text={formatDate(event.date)} />
        <MetaItem icon="🕐" text={event.time} />
        <MetaItem icon="📍" text={event.venue} />
        {event.maxParticipants && <MetaItem icon="👥" text={`Max ${event.maxParticipants}`} />}
      </div>

      {/* Actions */}
      {actions && <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>{actions}</div>}
    </div>
  );
}

function MetaItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF' }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
