// Reusable bits: Card, StatCard, Pill, Badge

function Card({ children, style, padding = 24 }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,.04)', padding, overflow: 'hidden', ...style,
    }}>{children}</div>
  );
}

function Pill({ children, tone = 'success' }) {
  const tones = {
    success: { bg: '#EEF6F2', fg: '#117E44' },
    warning: { bg: '#FEF9C3', fg: '#854D0E' },
    danger:  { bg: '#FEE2E2', fg: '#B91C1C' },
    info:    { bg: '#EFF6FF', fg: '#1D4ED8' },
    neutral: { bg: '#F0F2F5', fg: '#5F6B7A' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
      borderRadius: 9999, fontSize: 11.5, fontWeight: 600,
      background: t.bg, color: t.fg, fontFamily: 'Inter',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg, opacity: .9 }} />
      {children}
    </span>
  );
}

function StatCard({ label, value, delta, deltaTone = 'success', sub }) {
  const dTone = { success: '#117E44', danger: '#B91C1C', neutral: '#5F6B7A' }[deltaTone];
  return (
    <Card padding={20}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>{value}</div>
        {delta && <span style={{ fontSize: 12, fontWeight: 600, color: dTone }}>{delta}</span>}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#8896A4', marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

window.Card = Card;
window.Pill = Pill;
window.StatCard = StatCard;

// Centered confirm/content modal — shared chrome for every dialog in the app.
// Header: large icon-in-circle, centered title + subtitle.
// Body:   any children (impact callouts, user cards, tables, etc).
// Footer: opt-in slot; auditNote prop adds the FDA shield-check line below.
function CenterModal({
  open, onClose, icon, iconTone = 'neutral',
  title, subtitle, children, footer, auditNote,
  maxWidth = 480, padding = 24,
}) {
  React.useEffect(() => {
    if (!open) return;
    if (window.lucide) window.lucide.createIcons();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  React.useEffect(() => { if (open && window.lucide) window.lucide.createIcons(); });

  if (!open) return null;

  const tones = {
    danger:  { bg: '#FEE2E2', fg: '#DC2626' },
    success: { bg: '#EEF6F2', fg: '#117E44' },
    warning: { bg: '#FEF3C7', fg: '#B45309' },
    info:    { bg: '#EFF6FF', fg: '#1D4ED8' },
    brand:   { bg: '#EEF6F2', fg: '#1B8C4E' },
    neutral: { bg: '#F0F2F5', fg: '#5F6B7A' },
  };
  const t = tones[iconTone] || tones.neutral;

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,41,.55)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: 'Inter',
      }}
    >
      <div style={{
        width: '100%', maxWidth, maxHeight: 'calc(100vh - 48px)',
        background: '#fff', border: '1px solid #E8EBE9', borderRadius: 14,
        boxShadow: '0 24px 60px rgba(15,23,41,.30)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Scrolling body */}
        <div style={{ flex: 1, overflowY: 'auto', padding }}>
          {/* Centered icon */}
          {icon && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 28, background: t.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i data-lucide={icon} style={{ width: 28, height: 28, color: t.fg }} />
              </div>
            </div>
          )}
          {/* Title */}
          {title && (
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F1729', textAlign: 'center', letterSpacing: -0.2 }}>
              {title}
            </h3>
          )}
          {/* Subtitle */}
          {subtitle && (
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#5F6B7A', textAlign: 'center', lineHeight: 1.55 }}>
              {subtitle}
            </p>
          )}
          {/* Body */}
          {children && <div style={{ marginTop: title || subtitle || icon ? 20 : 0 }}>{children}</div>}
        </div>

        {/* Footer actions */}
        {footer && (
          <div style={{ padding: `${padding/2}px ${padding}px`, borderTop: '1px solid #F0F2F5', display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            {footer}
          </div>
        )}

        {/* Audit-log note (FDA shield) */}
        {auditNote && (
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid #F0F2F5',
            background: '#F3FAF6',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11.5, color: '#5F6B7A', flexShrink: 0,
          }}>
            <i data-lucide="shield-check" style={{ width: 14, height: 14, color: '#1B8C4E' }} />
            {auditNote === true
              ? 'This action will be recorded in the audit log (5-year retention per Rwanda FDA)'
              : auditNote}
          </div>
        )}
      </div>
    </div>
  );
}

window.CenterModal = CenterModal;
