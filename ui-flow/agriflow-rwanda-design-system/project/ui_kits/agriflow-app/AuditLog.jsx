// Audit Log — append-only compliance record, FDA-aligned.
// Adapted from /Page-1/Compliance/AuditLogViewer using AgriFlow design tokens.

function AuditLog() {
  const [from, setFrom]   = React.useState('2026-03-01');
  const [to, setTo]       = React.useState('2026-04-03');
  const [user, setUser]   = React.useState('all');
  const [entity, setEntity] = React.useState('all');
  const [action, setAction] = React.useState('all');
  const [openDiff, setOpenDiff] = React.useState(null); // row id of selected entry

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const rows = [
    { id: 0, date: '2026-04-03', time: '14:32:18 CAT', userInitials: 'JU', userName: 'Jean Uwimana',         userColor: '#1B8C4E', action: 'CREATE',       entity: 'User',      ref: 'usr_7f8a2b3c',                       desc: 'Created user account for Claudine Uwera with role Finance' },
    { id: 1, date: '2026-04-03', time: '13:15:42 CAT', userInitials: 'AM', userName: 'Alice Mukamana',       userColor: '#3B82F6', action: 'UPDATE',       entity: 'Supplier',  ref: 'sup_3d9e1f4a',                       desc: 'Updated supplier "Musanze Fresh Farm" — changed payment_terms from NET30 to NET15' },
    { id: 2, date: '2026-04-03', time: '11:48:09 CAT', userInitials: 'JU', userName: 'Jean Uwimana',         userColor: '#1B8C4E', action: 'DELETE',       entity: 'User',      ref: 'usr_2c5d8e1f',                       desc: 'Deactivated user Diane Habimana', tag: 'SOFT DELETE' },
    { id: 3, date: '2026-04-03', time: '10:22:31 CAT', userInitials: 'EN', userName: 'Emmanuel Niyonzima',   userColor: '#8B5CF6', action: 'UNAUTHORIZED', entity: 'Supplier',  ref: 'PATCH /api/v1/suppliers/price', mono: true, desc: 'Driver attempted to update supplier price book — 403 Forbidden', danger: true },
    { id: 4, date: '2026-04-03', time: '09:01:15 CAT', userInitials: 'PN', userName: 'Patrick Nshimiyimana', userColor: '#F59E0B', action: 'LOGIN',        entity: 'Session',   ref: 'ses_9a1b3c5d',                       desc: 'Authenticated via email/password — IP: 197.243.14.52 (Kigali)' },
    { id: 5, date: '2026-04-02', time: '16:45:33 CAT', userInitials: 'PN', userName: 'Patrick Nshimiyimana', userColor: '#F59E0B', action: 'UPDATE',       entity: 'Inventory', ref: 'inv_5e7f9a1b',                       desc: 'Moved 250 KG tomatoes from RECEIVING to COLD_STORAGE_A (Batch #BTR-2026-0412)' },
    { id: 6, date: '2026-04-02', time: '14:20:11 CAT', userInitials: 'AM', userName: 'Alice Mukamana',       userColor: '#3B82F6', action: 'CREATE',       entity: 'Order',     ref: 'ord_1a3b5c7d',                       desc: 'Created order #ORD-2026-0089 for Simba Supermarket — 15 line items, 1,250 KG total' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter' }} data-screen-label="audit-log">
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Audit Log</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 9999,
              fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
              background: '#EEF6F2', color: '#117E44',
            }}>
              <i data-lucide="lock" style={{ width: 11, height: 11 }} />
              Immutable
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>
            Non-editable record of all platform changes. Retained 5 years per Rwanda FDA requirements.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button style={{ ...btnSecondary, padding: '9px 16px' }}>
            <i data-lucide="file-down" style={{ width: 14, height: 14 }} /> Export CSV
          </button>
          <button style={{ ...btnSecondary, padding: '9px 16px' }}>
            <i data-lucide="file-text" style={{ width: 14, height: 14 }} /> Export PDF
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>Total entries</div>
            <i data-lucide="scroll-text" style={{ width: 16, height: 16, color: '#9CA3AF' }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>1,247</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#117E44', marginTop: 4 }}>+184 this week</div>
        </Card>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>Data changes</div>
            <i data-lucide="pencil-line" style={{ width: 16, height: 16, color: '#9CA3AF' }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>892</div>
          <div style={{ fontSize: 12, color: '#8896A4', marginTop: 4 }}>CREATE · UPDATE · DELETE</div>
        </Card>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>Sign-ins</div>
            <i data-lucide="log-in" style={{ width: 16, height: 16, color: '#9CA3AF' }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>341</div>
          <div style={{ fontSize: 12, color: '#8896A4', marginTop: 4 }}>From 19 unique users</div>
        </Card>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>Unauthorized</div>
            <i data-lucide="shield-alert" style={{ width: 16, height: 16, color: '#9CA3AF' }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>14</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#B45309', marginTop: 4 }}>4 in last 24h</div>
        </Card>
      </div>

      {/* Filter card */}
      <Card padding={18}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label="From date">
            <DateInput value={from} onChange={setFrom} />
          </Field>
          <Field label="To date">
            <DateInput value={to} onChange={setTo} />
          </Field>
          <Field label="User">
            <Select value={user} onChange={setUser} width={180} options={[
              { value: 'all', label: 'All users' },
              { value: 'jean', label: 'Jean Uwimana' },
              { value: 'alice', label: 'Alice Mukamana' },
              { value: 'patrick', label: 'Patrick Nshimiyimana' },
              { value: 'emmanuel', label: 'Emmanuel Niyonzima' },
            ]} />
          </Field>
          <Field label="Entity type">
            <Select value={entity} onChange={setEntity} width={160} options={[
              { value: 'all', label: 'All entities' },
              { value: 'user', label: 'User' },
              { value: 'supplier', label: 'Supplier' },
              { value: 'product', label: 'Product' },
              { value: 'order', label: 'Order' },
              { value: 'inventory', label: 'Inventory' },
              { value: 'batch', label: 'Batch' },
              { value: 'delivery', label: 'Delivery' },
            ]} />
          </Field>
          <Field label="Action">
            <Select value={action} onChange={setAction} width={150} options={[
              { value: 'all', label: 'All actions' },
              { value: 'CREATE', label: 'CREATE' },
              { value: 'UPDATE', label: 'UPDATE' },
              { value: 'DELETE', label: 'DELETE' },
              { value: 'LOGIN', label: 'LOGIN' },
              { value: 'UNAUTHORIZED', label: 'UNAUTHORIZED' },
            ]} />
          </Field>
          <button style={{ ...btnPrimary, padding: '9px 18px' }}>Apply</button>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '9px 6px' }}>Clear</button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 12, color: '#5F6B7A', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>Active filters:</span>
          <FilterChip label="Last 34 days" onClose={() => {}} />
          <FilterChip label="All users" onClose={() => setUser('all')} />
          <span style={{ color: '#D0D5DD' }}>|</span>
          <span><span style={{ fontWeight: 700, color: '#1F2937' }}>1,247 entries</span> match these filters</span>
          <span style={{ color: '#D0D5DD' }}>·</span>
          <span style={{ color: '#8896A4' }}>avg response 0.8s</span>
        </div>
      </Card>

      {/* Audit table */}
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
          <colgroup>
            <col style={{ width: 160 }} />
            <col />
            <col style={{ width: 140 }} />
            <col style={{ width: 200 }} />
            <col />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              {['Timestamp', 'User', 'Action', 'Entity', 'Description', ''].map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 5 ? 'right' : 'left',
                  padding: i === 5 ? '14px 22px 14px 8px' : '14px 22px',
                  fontSize: 12, fontWeight: 600,
                  color: '#9CA3AF',
                  borderBottom: '1px solid #E8EBE9', background: '#F9FAFB',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              return (
                <React.Fragment key={r.id}>
                  <tr>
                    <td style={{ padding: '14px 22px', verticalAlign: 'top' }}>
                      <div style={{ fontFamily: 'Menlo, monospace', fontSize: 12.5, color: '#1F2937', fontWeight: 600 }}>{r.date}</div>
                      <div style={{ fontFamily: 'Menlo, monospace', fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{r.time}</div>
                    </td>
                    <td style={{ padding: '14px 22px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 14, background: r.userColor, color: '#fff', fontWeight: 700, fontSize: 10.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.userInitials}</div>
                        <span style={{ color: '#1F2937', fontWeight: 500 }}>{r.userName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 22px', verticalAlign: 'top' }}>
                      <ActionBadge action={r.action} />
                    </td>
                    <td style={{ padding: '14px 22px', verticalAlign: 'top' }}>
                      <div style={{ color: '#1F2937', fontWeight: 500 }}>{r.entity}</div>
                      <div style={{ fontFamily: 'Menlo, monospace', fontSize: 11, color: '#9CA3AF', marginTop: 2, wordBreak: 'break-all' }}>{r.ref}</div>
                    </td>
                    <td style={{ padding: '14px 22px', verticalAlign: 'top', color: r.danger ? '#B91C1C' : '#5F6B7A', lineHeight: 1.5 }}>
                      {r.danger && <i data-lucide="alert-triangle" style={{ width: 13, height: 13, color: '#DC2626', marginRight: 6, verticalAlign: -2 }} />}
                      {r.desc}
                      {r.tag && (
                        <span style={{
                          display: 'inline-flex', marginLeft: 8, padding: '2px 7px', borderRadius: 6,
                          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5,
                          background: '#FEF9C3', color: '#854D0E', textTransform: 'uppercase',
                        }}>{r.tag}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 22px 14px 8px', textAlign: 'right', verticalAlign: 'top' }}>
                      <button
                        onClick={() => setOpenDiff(r.id)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: '#1B8C4E', fontWeight: 600, fontSize: 12,
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: 0, fontFamily: 'Inter',
                        }}
                      >
                        {r.action === 'LOGIN' || r.action === 'UNAUTHORIZED' ? 'View details' : 'View diff'}
                        <i data-lucide="chevron-right" style={{ width: 12, height: 12 }} />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {/* Pagination footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid #E8EBE9', fontSize: 13, color: '#5F6B7A' }}>
          <div>
            Showing <span style={{ fontWeight: 700, color: '#1F2937' }}>1-7</span> of <span style={{ fontWeight: 700, color: '#1F2937' }}>1,247</span> entries
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PageBtn><i data-lucide="chevron-left" style={{ width: 14, height: 14 }} /></PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <span style={{ color: '#9CA3AF', padding: '0 4px' }}>…</span>
            <PageBtn>178</PageBtn>
            <PageBtn><i data-lucide="chevron-right" style={{ width: 14, height: 14 }} /></PageBtn>
          </div>
        </div>
      </Card>

      {/* Diff / detail modal */}
      {openDiff !== null && (
        <DiffModal
          row={rows.find(r => r.id === openDiff)}
          onClose={() => setOpenDiff(null)}
        />
      )}

      {/* FDA compliance footer */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: 14, borderRadius: 10,
        background: '#F3FAF6', border: '1px solid #C8ECDA',
      }}>
        <i data-lucide="shield-check" style={{ width: 16, height: 16, color: '#1B8C4E', marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#117E44' }}>Rwanda FDA compliance</div>
          <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 3, lineHeight: 1.55 }}>
            Audit logs are append-only and immutable. No UPDATE or DELETE operations are permitted on this table. All entries are retained for a minimum of 5 years and are available for export during FDA inspections.
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }) {
  const map = {
    CREATE:       { bg: '#EEF6F2', fg: '#117E44' },
    UPDATE:       { bg: '#EFF6FF', fg: '#1D4ED8' },
    DELETE:       { bg: '#FEE2E2', fg: '#B91C1C' },
    LOGIN:        { bg: '#F0F2F5', fg: '#5F6B7A' },
    UNAUTHORIZED: { bg: '#DC2626', fg: '#FFFFFF' },
  };
  const t = map[action] || map.LOGIN;
  const label = action === 'UNAUTHORIZED' ? '403' : action;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 6,
      fontFamily: 'Menlo, monospace', fontSize: 10.5, fontWeight: 700,
      letterSpacing: 0.6,
      background: t.bg, color: t.fg,
    }}>{label}</span>
  );
}

function DiffModal({ row, onClose }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  // Tailored content per row id so the demo feels real
  const data = {
    0: {
      title: 'Created record',
      subtitle: <>A new record was inserted by <span style={{ fontWeight: 600, color: '#1F2937' }}>{row.userName}</span>.</>,
      icon: 'file-plus-2', tone: 'success',
      kind: 'create',
      after: [
        ['"name"',        '"Claudine Uwera"'],
        ['"email"',       '"claudine.u@agriflow.rw"'],
        ['"role"',        '"Finance"'],
        ['"status"',      '"pending_activation"'],
        ['"created_by"',  '"jean.uwimana@agriflow.rw"'],
      ],
      meta: [['IP address', '197.243.14.52'], ['Session', 'ses_9a1b3c5d'], ['Source', 'web · Chrome 124']],
    },
    1: {
      title: 'Field-level diff',
      subtitle: <>Changes made to <span style={{ fontWeight: 600, color: '#1F2937' }}>{row.entity}</span> {row.ref} by {row.userName}.</>,
      icon: 'file-diff', tone: 'info',
      kind: 'update',
      before: [
        ['"name"',           '"Musanze Fresh Farm"'],
        ['"payment_terms"',  '"NET30"',    true],
        ['"rating"',         '4.2'],
        ['"updated_at"',     '"2026-03-15T08:12:00Z"'],
      ],
      after: [
        ['"name"',           '"Musanze Fresh Farm"'],
        ['"payment_terms"',  '"NET15"',    true],
        ['"rating"',         '4.2'],
        ['"updated_at"',     '"2026-04-03T13:15:42Z"'],
      ],
      meta: [['IP address', '197.243.14.52'], ['Session', 'ses_7e3a1b2c'], ['Source', 'web · Chrome 124']],
    },
    2: {
      title: 'Soft delete',
      subtitle: <>Record was soft-deleted by <span style={{ fontWeight: 600, color: '#1F2937' }}>{row.userName}</span> — it can be reactivated later.</>,
      icon: 'archive-x', tone: 'warning',
      kind: 'delete',
      before: [
        ['"name"',     '"Diane Habimana"'],
        ['"status"',   '"active"',         true],
        ['"role"',     '"Warehouse Picker"'],
      ],
      after: [
        ['"name"',         '"Diane Habimana"'],
        ['"status"',       '"deactivated"',    true],
        ['"deactivated_at"', '"2026-04-03T11:48:09Z"', true],
      ],
      meta: [['IP address', '197.243.14.52'], ['Session', 'ses_9a1b3c5d'], ['Source', 'web · Chrome 124']],
    },
    3: {
      title: 'Access denied',
      subtitle: <>{row.userName} attempted an action they don't have permission for.</>,
      icon: 'shield-alert', tone: 'danger',
      kind: 'unauthorized',
      info: [
        ['Endpoint',    'PATCH /api/v1/suppliers/price'],
        ['HTTP status', '403 Forbidden'],
        ['Required',    'suppliers.pricebook.write'],
        ['Granted',     'orders.read, deliveries.write'],
        ['Origin IP',   '197.243.14.52 (Kigali)'],
        ['User agent',  'AgriFlow Mobile/2.4 (Android 14)'],
      ],
      meta: [['Session', 'ses_5f7a9b1c'], ['Risk score', '7.2 / 10 — auto-flagged']],
    },
  };

  const fallback = {
    title: 'Sign-in details',
    subtitle: <>Session opened by <span style={{ fontWeight: 600, color: '#1F2937' }}>{row.userName}</span>.</>,
    icon: 'log-in', tone: 'neutral',
    kind: 'login',
    info: [
      ['Method',     'email + password'],
      ['Origin IP',  '197.243.14.52 (Kigali)'],
      ['User agent', 'AgriFlow Web/2.4 (Chrome 124)'],
      ['MFA',        'Not required (trusted device)'],
    ],
    meta: [['Session', row.ref], ['Risk score', '1.2 / 10']],
  };
  const d = data[row.id] || fallback;

  return (
    <CenterModal
      open={true}
      onClose={onClose}
      icon={d.icon}
      iconTone={d.tone}
      title={d.title}
      subtitle={d.subtitle}
      maxWidth={d.kind === 'update' || d.kind === 'delete' ? 640 : 520}
      auditNote
      footer={
        <button onClick={onClose} style={{ ...btnPrimary, height: 40, padding: '0 22px' }}>Close</button>
      }
    >
      {/* Event identity card — mirrors the user card in DeactivateUserModal */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 16, borderRadius: 10, background: '#F9FAFB',
        border: '1px solid #E8EBE9', marginBottom: 20,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20, flexShrink: 0,
          background: row.userColor, color: '#fff', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{row.userInitials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{row.userName}</div>
          <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 2, fontFamily: 'Menlo, monospace' }}>{row.ref}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <ActionBadge action={row.action} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#5F6B7A' }}>{row.entity}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, fontFamily: 'Menlo, monospace' }}>
          <div style={{ fontSize: 12, color: '#1F2937', fontWeight: 600 }}>{row.date}</div>
          <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2 }}>{row.time}</div>
        </div>
      </div>

      {/* Diff / detail body */}
      {d.kind === 'update' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <DiffSide tone="before" lines={d.before} />
          <DiffSide tone="after"  lines={d.after} />
        </div>
      )}
      {d.kind === 'create' && (
        <div style={{ marginBottom: 16 }}>
          <DiffSide tone="after" lines={d.after} fullWidth label="New record" />
        </div>
      )}
      {d.kind === 'delete' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <DiffSide tone="before" lines={d.before} />
          <DiffSide tone="after"  lines={d.after} label="After (soft delete)" />
        </div>
      )}
      {(d.kind === 'login' || d.kind === 'unauthorized') && (
        <div style={{ marginBottom: 16 }}>
          <InfoGrid tone={d.kind === 'unauthorized' ? 'danger' : 'neutral'} entries={d.info} />
        </div>
      )}

      {/* Meta footer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, paddingTop: 16, borderTop: '1px solid #F0F2F5' }}>
        {d.meta.map(([k, v], i) => (
          <div key={i}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#9CA3AF' }}>{k}</div>
            <div style={{ fontFamily: 'Menlo, monospace', fontSize: 12, color: '#1F2937', marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
    </CenterModal>
  );
}

function DiffSide({ tone, lines, fullWidth, label }) {
  const isBefore = tone === 'before';
  const accent = isBefore ? '#B91C1C' : '#117E44';
  const bg     = isBefore ? '#FEF2F2' : '#F3FAF6';
  const border = isBefore ? '#FECACA' : '#C8ECDA';
  const heading = label || (isBefore ? 'Before' : 'After');
  return (
    <div style={fullWidth ? {} : undefined}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 4, background: accent, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700,
        }}>{isBefore ? '−' : '+'}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: accent }}>{heading}</span>
      </div>
      <div style={{
        background: bg, border: `1px solid ${border}`, borderRadius: 8,
        padding: 12, fontFamily: 'Menlo, monospace', fontSize: 12, lineHeight: 1.7,
      }}>
        {lines.map(([k, v, changed], i) => (
          <div key={i} style={{ color: changed ? accent : '#5F6B7A', fontWeight: changed ? 700 : 500 }}>
            <span style={{ opacity: changed ? 1 : .85 }}>{k}</span>: {v}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoGrid({ tone, entries }) {
  const danger = tone === 'danger';
  return (
    <div style={{
      background: danger ? '#FEF2F2' : '#F9FAFB',
      border: `1px solid ${danger ? '#FECACA' : '#E8EBE9'}`,
      borderRadius: 8, padding: '14px 18px',
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 28px',
    }}>
      {entries.map(([k, v], i) => (
        <div key={i}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: danger ? '#B91C1C' : '#9CA3AF' }}>{k}</div>
          <div style={{ fontFamily: 'Menlo, monospace', fontSize: 12.5, color: danger ? '#7F1D1D' : '#1F2937', marginTop: 3, wordBreak: 'break-all' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function DateInput({ value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 40, padding: '0 12px', minWidth: 150,
      background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8,
    }}>
      <i data-lucide="calendar" style={{ width: 14, height: 14, color: '#5F6B7A', flexShrink: 0 }} />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: '#1F2937',
          padding: 0, width: '100%',
        }}
      />
    </div>
  );
}

window.AuditLog = AuditLog;
