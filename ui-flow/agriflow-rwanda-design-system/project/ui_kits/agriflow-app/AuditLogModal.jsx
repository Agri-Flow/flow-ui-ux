// Audit Log modal — compact centered confirm-style modal matching DeactivateUserModal.
// Layout: icon → centered title → subtitle → user card → summary stats → recent activity list → footer.

function AuditLogModal({ user, onClose }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  if (!user) return null;

  const stats = [
    { label: 'Total entries', value: '58' },
    { label: 'Data changes',  value: '22' },
    { label: 'Sign-ins',      value: '34' },
    { label: 'Unauthorized',  value: '2',  tone: 'warning' },
  ];

  const events = [
    { date: 'Today',     time: '14:32', action: 'LOGIN',        desc: 'Signed in from Kigali · IP 197.243.14.52' },
    { date: 'Today',     time: '14:18', action: 'UPDATE',       desc: 'Supplier "Musanze Fresh Farm" — payment_terms NET30 → NET15' },
    { date: 'Yesterday', time: '11:48', action: 'CREATE',       desc: 'Created user account for Claudine Uwera (Finance)' },
    { date: 'Apr 01',    time: '10:22', action: 'UNAUTHORIZED', desc: 'PATCH /suppliers/price — 403 Forbidden', danger: true },
    { date: 'Mar 30',    time: '09:01', action: 'LOGIN',        desc: 'Signed in from Kigali · IP 197.243.14.52' },
  ];

  return (
    <CenterModal
      open={!!user}
      onClose={onClose}
      icon="scroll-text"
      iconTone="brand"
      title="Audit Log"
      subtitle={<>Append-only activity record for <span style={{ fontWeight: 600, color: '#1F2937' }}>{user.name}</span></>}
      maxWidth={480}
      auditNote="Immutable record · 5-year retention per Rwanda FDA"
      footer={
        <>
          <button onClick={onClose} style={{ ...btnSecondary, height: 40 }}>Close</button>
          <button style={{ ...btnPrimary, height: 40 }}>
            <i data-lucide="external-link" style={{ width: 14, height: 14 }} /> View full log
          </button>
        </>
      }
    >
      {/* User card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 16, borderRadius: 10, background: '#F9FAFB',
        border: '1px solid #E8EBE9', marginBottom: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20, flexShrink: 0,
          background: user.avatar, color: '#fff', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{user.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{user.name}</div>
          <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 2 }}>{user.email}</div>
          <span style={{
            display: 'inline-flex', marginTop: 6,
            padding: '2px 8px', borderRadius: 9999,
            fontSize: 10, fontWeight: 700, background: '#F0F2F5', color: '#374151',
          }}>{user.role[0]}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 9999,
            fontSize: 11.5, fontWeight: 600,
            background: user.status === 'Active' ? '#EEF6F2' : user.status === 'Pending' ? '#FEF9C3' : '#FEE2E2',
            color: user.status === 'Active' ? '#117E44' : user.status === 'Pending' ? '#854D0E' : '#B91C1C',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: .9 }} />
            {user.status}
          </span>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Since {user.date}</div>
        </div>
      </div>

      {/* Summary stats — 4 column inline */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
        padding: '14px 4px', marginBottom: 16,
        background: '#FBFDFC', border: '1px solid #E8EBE9', borderRadius: 10,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid #E8EBE9' : 'none',
            padding: '0 8px',
          }}>
            <div style={{
              fontSize: 22, fontWeight: 700, letterSpacing: -0.3,
              color: s.tone === 'warning' ? '#B45309' : '#0F1729',
            }}>{s.value}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: '#8896A4', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity list */}
      <div style={{ fontSize: 12, fontWeight: 700, color: '#8896A4', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        Recent activity
      </div>
      <div style={{ border: '1px solid #E8EBE9', borderRadius: 10, overflow: 'hidden' }}>
        {events.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '11px 14px',
            borderBottom: i < events.length - 1 ? '1px solid #F0F2F5' : 'none',
            background: e.danger ? 'rgba(220,38,38,.03)' : '#fff',
          }}>
            <div style={{ flexShrink: 0, paddingTop: 1, minWidth: 56 }}>
              <div style={{ fontFamily: 'Menlo, monospace', fontSize: 11, fontWeight: 600, color: '#1F2937' }}>{e.date}</div>
              <div style={{ fontFamily: 'Menlo, monospace', fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{e.time}</div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 1 }}>
              <ActionBadge action={e.action} />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: e.danger ? '#B91C1C' : '#5F6B7A', lineHeight: 1.5 }}>
              {e.danger && <i data-lucide="alert-triangle" style={{ width: 12, height: 12, color: '#DC2626', marginRight: 5, verticalAlign: -1 }} />}
              {e.desc}
            </div>
          </div>
        ))}
      </div>
    </CenterModal>
  );
}

window.AuditLogModal = AuditLogModal;
