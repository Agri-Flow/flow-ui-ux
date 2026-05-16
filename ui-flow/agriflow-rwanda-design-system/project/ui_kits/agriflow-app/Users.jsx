// Users / User Management screen
// Reference: brief screenshot — stat row, search/filter bar, users table.

function Users() {
  const [openCreate, setOpenCreate] = React.useState(false);
  const stats = [
    { label: 'Total Users', value: '24', delta: '+3 this month', deltaTone: 'success', icon: 'users', sub: '' },
    { label: 'Active Users', value: '21', sub: '87.5% activation rate', icon: 'check-circle' },
    { label: 'Pending Activation', value: '2', sub: 'Activation email sent', icon: 'clock', subTone: 'warning' },
    { label: 'Deactivated', value: '1', sub: 'Soft-deleted accounts', icon: 'ban' },
  ];
  const users = [
    { initials: 'JU', avatar: '#1B8C4E', name: 'Jean Uwimana',        email: 'jean.uwimana@agriflow.rw',   phone: '+250 788 123 001', role: ['Admin', 'success'],          status: 'Active',  date: '15 Jan 2026', action: 'Permissions' },
    { initials: 'AM', avatar: '#3B82F6', name: 'Alice Mukamana',      email: 'alice.m@agriflow.rw',         phone: '+250 788 123 002', role: ['Manager', 'info'],            status: 'Active',  date: '20 Jan 2026', action: 'Permissions' },
    { initials: 'PN', avatar: '#F59E0B', name: 'Patrick Nshimiyimana', email: 'patrick.n@agriflow.rw',      phone: '+250 788 123 003', role: ['Warehouse Picker', 'danger'], status: 'Active',  date: '05 Feb 2026', action: 'Permissions' },
    { initials: 'EN', avatar: '#8B5CF6', name: 'Emmanuel Niyonzima',  email: 'emmanuel.n@agriflow.rw',     phone: '+250 788 123 004', role: ['Driver', 'purple'],           status: 'Active',       date: '12 Feb 2026', action: 'Permissions' },
    { initials: 'CU', avatar: '#10B981', name: 'Claudine Uwera',     email: 'claudine.u@agriflow.rw',     phone: '+250 788 123 005', role: ['Finance', 'teal'],            status: 'Pending',      date: '01 Apr 2026', action: 'Resend' },
    { initials: 'GN', avatar: '#1B8C4E', name: 'Grace Nyirahabimana', email: 'grace.n@agriflow.rw',        phone: '+250 788 123 006', role: ['Manager', 'info'],            status: 'Pending',      date: '02 Apr 2026', action: 'Resend' },
    { initials: 'DH', avatar: '#9CA3AF', name: 'Diane Habimana',     email: 'diane.h@agriflow.rw',        phone: '+250 788 123 007', role: ['Warehouse Picker', 'danger'], status: 'Deactivated',  date: '22 Jan 2026', action: 'Reactivate', muted: true },
  ];

  const [role, setRole] = React.useState('All Roles');
  const [status, setStatus] = React.useState('All Status');
  const [openRow, setOpenRow] = React.useState(null);
  const [deactivating, setDeactivating] = React.useState(null);
  const [reactivating, setReactivating] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [auditingUser, setAuditingUser] = React.useState(null);
  const [permsUser, setPermsUser] = React.useState(null);

  React.useEffect(() => {
    if (openRow === null) return;
    const onClick = () => setOpenRow(null);
    const onKey = (e) => { if (e.key === 'Escape') setOpenRow(null); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openRow]);

  const roleStyles = {
    success: { bg: '#EEF6F2', fg: '#117E44' },
    info:    { bg: '#EFF6FF', fg: '#1D4ED8' },
    danger:  { bg: '#FEF2F2', fg: '#B91C1C' },
    purple:  { bg: '#F5F3FF', fg: '#6D28D9' },
    teal:    { bg: '#ECFDF5', fg: '#0E7C5A' },
  };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter' }} data-screen-label="users">
      {/* breadcrumb sits in the page header upstream — skip here */}

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>User Management</div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>Manage user accounts, roles, and access permissions</div>
        </div>
        <button onClick={() => setOpenCreate(true)} style={{ ...btnPrimary, padding: '10px 18px', borderRadius: 999 }}>
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Add User
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} padding={18}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>{s.label}</div>
              <i data-lucide={s.icon} style={{ width: 16, height: 16, color: '#9CA3AF' }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>{s.value}</div>
            {s.delta && <div style={{ fontSize: 12, fontWeight: 600, color: '#117E44', marginTop: 4 }}>{s.delta}</div>}
            {s.sub && (
              <div style={{ fontSize: 12, color: s.subTone === 'warning' ? '#B45309' : '#8896A4', marginTop: s.delta ? 2 : 4 }}>{s.sub}</div>
            )}
          </Card>
        ))}
      </div>

      {/* Search / filter card */}
      <Card padding={18}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label="Search" style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', boxSizing: 'border-box', background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8, fontSize: 14, color: '#9CA3AF' }}>
              <i data-lucide="search" style={{ width: 16, height: 16 }} />
              <span>Search by name, email, or phone…</span>
            </div>
          </Field>
          <Field label="Role">
            <Select value={role} onChange={setRole} options={['All Roles', 'Admin', 'Manager', 'Warehouse Picker', 'Driver', 'Finance']} />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={setStatus} options={['All Status', 'Active', 'Pending', 'Deactivated']} />
          </Field>
          <button style={{ ...btnPrimary, padding: '9px 18px' }}>Apply</button>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '9px 6px' }}>Clear</button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 12, color: '#5F6B7A' }}>
          <span style={{ fontWeight: 600 }}>Active filters:</span>
          <FilterChip label="All Roles" onClose={() => setRole('All Roles')} />
          <FilterChip label="All Status" onClose={() => setStatus('All Status')} />
          <span style={{ color: '#D0D5DD' }}>|</span>
          <span>{users.length * 4} users found</span>
        </div>
      </Card>

      {/* Users table */}
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {['User', 'Phone', 'Role', 'Status', 'Date Added', ''].map((h, i) => (
                <th key={i} style={{ textAlign: i === 4 ? 'right' : i === 5 ? 'center' : 'left', padding: i === 5 ? '14px 14px 14px 0' : i === 4 ? '14px 8px 14px 22px' : '14px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const rs = roleStyles[u.role[1]] || roleStyles.info;
              const statusTone = u.status === 'Active' ? 'success' : u.status === 'Pending' ? 'warning' : 'danger';
              return (
                <tr key={i} style={{ borderBottom: i < users.length - 1 ? '1px solid #F0F2F5' : 'none', opacity: u.muted ? 0.55 : 1 }}>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: u.avatar, color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{u.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F2937' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', fontFamily: 'Menlo, monospace', fontSize: 12.5, color: '#5F6B7A' }}>{u.phone}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, background: rs.bg, color: rs.fg }}>{u.role[0]}</span>
                  </td>
                  <td style={{ padding: '14px 22px' }}><Pill tone={statusTone}>{u.status}</Pill></td>
                  <td style={{ padding: '14px 8px 14px 22px', color: '#5F6B7A', textAlign: 'right', whiteSpace: 'nowrap' }}>{u.date}</td>
                  <td style={{ padding: '14px 14px 14px 0', textAlign: 'center', width: 44, position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRow(openRow === i ? null : i); }}
                      style={{
                        background: openRow === i ? '#F0F2F5' : 'transparent',
                        border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      aria-label="Row actions"
                    >
                      <i data-lucide="more-vertical" style={{ width: 16, height: 16, color: '#5F6B7A' }} />
                    </button>
                    {openRow === i && (
                      <UserRowMenu
                        user={u}
                        onPick={(id) => {
                          setOpenRow(null);
                          if (id === 'deactivate') setDeactivating(u);
                          else if (id === 'reactivate') setReactivating(u);
                          else if (id === 'edit') setEditing(u);
                          else if (id === 'audit') setAuditingUser(u);
                          else if (id === 'perms') setPermsUser(u);
                        }}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid #E8EBE9', fontSize: 13, color: '#5F6B7A' }}>
          <div>
            Showing <span style={{ fontWeight: 700, color: '#1F2937' }}>1-7</span> of <span style={{ fontWeight: 700, color: '#1F2937' }}>24</span> users
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PageBtn><i data-lucide="chevron-left" style={{ width: 14, height: 14 }} /></PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <PageBtn>4</PageBtn>
            <PageBtn><i data-lucide="chevron-right" style={{ width: 14, height: 14 }} /></PageBtn>
          </div>
        </div>
      </Card>

      {/* Audit / compliance footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8896A4', paddingTop: 4 }}>
        <i data-lucide="shield-check" style={{ width: 14, height: 14 }} />
        <span>All user changes are recorded in the audit log (5-year retention per Rwanda FDA).</span>
      </div>

      <AddUserForm open={openCreate} onClose={() => setOpenCreate(false)} onCreate={() => setOpenCreate(false)} />

      <EditUserForm
        open={!!editing}
        user={editing}
        onClose={() => setEditing(null)}
        onSave={() => setEditing(null)}
      />

      <AuditLogModal
        user={auditingUser}
        onClose={() => setAuditingUser(null)}
      />

      {permsUser && (
        <UserPermissionsModal
          user={permsUser}
          onClose={() => setPermsUser(null)}
        />
      )}

      {deactivating && (
        <DeactivateUserModal
          user={deactivating}
          onCancel={() => setDeactivating(null)}
          onConfirm={() => setDeactivating(null)}
        />
      )}
      {reactivating && (
        <DeactivateUserModal
          mode="reactivate"
          user={reactivating}
          onCancel={() => setReactivating(null)}
          onConfirm={() => setReactivating(null)}
        />
      )}
    </div>
  );
}

function DeactivateUserModal({ user, onCancel, onConfirm, mode = 'deactivate' }) {
  const isReactivate = mode === 'reactivate';
  const accent = isReactivate ? '#117E44' : '#DC2626';
  const accentBgSoft = isReactivate ? '#F3FAF6' : '#FEF2F2';
  const accentBorderSoft = isReactivate ? '#C8ECDA' : '#FECACA';
  const title = isReactivate ? 'Reactivate User Account' : 'Deactivate User Account';
  const verb = isReactivate ? 'reactivate' : 'deactivate';
  const impactTitle = isReactivate
    ? 'This user will regain access immediately'
    : 'This user will lose access immediately';
  const impactBody = isReactivate
    ? 'The user will be able to sign in again with their existing credentials. All previous role assignments and permissions will be restored.'
    : 'The user will be logged out of all active sessions and will not be able to sign in. This is a soft delete — the account can be reactivated later by an administrator.';
  const ctaIcon = isReactivate ? 'user-check' : 'user-x';
  const ctaLabel = isReactivate ? 'Reactivate User' : 'Deactivate User';

  return (
    <CenterModal
      open={true}
      onClose={onCancel}
      icon={isReactivate ? 'user-check' : 'user-x'}
      iconTone={isReactivate ? 'success' : 'danger'}
      title={title}
      subtitle={<>Are you sure you want to {verb} <span style={{ fontWeight: 600, color: '#1F2937' }}>{user.name}</span>?</>}
      maxWidth={480}
      auditNote
      footer={
        <>
          <button onClick={onCancel} style={{ ...btnSecondary, height: 40 }}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              ...btnPrimary, height: 40,
              background: accent,
              boxShadow: '0 1px 2px rgba(0,0,0,.05)',
            }}
          >
            <i data-lucide={ctaIcon} style={{ width: 16, height: 16 }} /> {ctaLabel}
          </button>
        </>
      }
    >
      {/* User info card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 16, borderRadius: 10, background: '#F9FAFB',
        border: '1px solid #E8EBE9', marginBottom: 20,
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

      {/* Impact callout */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: 12, borderRadius: 10,
        background: accentBgSoft, border: `1px solid ${accentBorderSoft}`,
      }}>
        <i data-lucide={isReactivate ? 'shield-check' : 'alert-triangle'} style={{ width: 20, height: 20, color: accent, flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent }}>{impactTitle}</div>
          <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 4, lineHeight: 1.5 }}>{impactBody}</div>
        </div>
      </div>
    </CenterModal>
  );
}

function PageBtn({ children, active }) {
  return (
    <button style={{
      minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8,
      border: active ? '1px solid #1B8C4E' : '1px solid #E8EBE9',
      background: active ? '#1B8C4E' : '#fff',
      color: active ? '#fff' : '#5F6B7A',
      fontWeight: active ? 700 : 600, fontSize: 13, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter',
    }}>{children}</button>
  );
}

function FilterChip({ label, onClose }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, background: '#F0F2F5', color: '#374151' }}>
      {label}
      <span onClick={onClose} style={{ cursor: 'pointer', color: '#9CA3AF', fontSize: 13, lineHeight: 1 }}>×</span>
    </span>
  );
}

// Field — labels-on-top wrapper used across every filter/form input
function Field({ label, children, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#5F6B7A' }}>{label}</span>
      {children}
    </label>
  );
}

const selectStyle = {
  height: 40,
  border: '1px solid #E8EBE9', borderRadius: 8,
  padding: '0 36px 0 14px',
  fontSize: 14, fontWeight: 500, fontFamily: 'Inter', color: '#1F2937',
  background: '#fff',
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%235F6B7A' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' d='M1 1.5l5 5 5-5'/></svg>\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none',
  cursor: 'pointer', minWidth: 160, outline: 'none',
};

function Select({ value, onChange, options, groups, placeholder, width, style }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const ref = React.useRef(null);
  const popRef = React.useRef(null);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [open, value]);

  const updatePos = React.useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 4, width: r.width });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePos();
    const onDoc = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onScroll = () => updatePos();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, updatePos]);

  const normalized = (options || []).map(o => typeof o === 'object' ? o : { value: o, label: o });
  const normalizedGroups = (groups || []).map(g => ({
    label: g.label,
    options: (g.options || []).map(o => typeof o === 'object' ? o : { value: o, label: o }),
  }));
  const flat = normalizedGroups.length ? normalizedGroups.flatMap(g => g.options) : normalized;
  const current = flat.find(o => o.value === value);

  const renderOption = (o) => {
    const selected = o.value === value;
    return (
      <button
        key={o.value}
        onClick={() => { onChange(o.value); setOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '9px 10px', border: 'none', borderRadius: 8,
          background: selected ? '#EEF6F2' : 'transparent', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'Inter',
        }}
        onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = '#F9FAFB'; }}
        onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: selected ? '#117E44' : '#0F1729', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.label}</span>
        {selected && <i data-lucide="check" style={{ width: 15, height: 15, color: '#1B8C4E', flexShrink: 0 }} />}
      </button>
    );
  };

  const popup = open && pos ? ReactDOM.createPortal(
    <div
      ref={popRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 1000,
        background: '#fff',
        border: '1px solid #E8EBE9', borderRadius: 12,
        boxShadow: '0 16px 36px rgba(15,23,41,.14)',
        padding: 6, fontFamily: 'Inter', textAlign: 'left',
        maxHeight: 320, overflowY: 'auto',
      }}
    >
      {normalizedGroups.length
        ? normalizedGroups.map((g, gi) => (
            <div key={g.label} style={{ marginTop: gi === 0 ? 0 : 4 }}>
              <div style={{
                padding: '8px 10px 4px', fontSize: 10, fontWeight: 700,
                color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8,
              }}>{g.label}</div>
              {g.options.map(renderOption)}
            </div>
          ))
        : normalized.map(renderOption)}
    </div>,
    document.body,
  ) : null;

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: width || 160, ...style }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          height: 40, width: '100%',
          border: '1px solid #E8EBE9', borderRadius: 8,
          padding: '0 14px',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          fontSize: 14, fontWeight: 500, fontFamily: 'Inter',
          color: current ? '#1F2937' : '#9CA3AF',
          cursor: 'pointer', outline: 'none', textAlign: 'left',
          boxShadow: open ? '0 0 0 3px rgba(27,140,78,.15)' : 'none',
          borderColor: open ? '#1B8C4E' : '#E8EBE9',
          transition: 'box-shadow .12s, border-color .12s',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current ? current.label : (placeholder || 'Select…')}
        </span>
        <i data-lucide="chevron-down" style={{ width: 14, height: 14, color: '#5F6B7A', flexShrink: 0, transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {popup}
    </div>
  );
}

window.Users = Users;
window.PageBtn = PageBtn;
window.FilterChip = FilterChip;
window.Field = Field;
window.Select = Select;
window.selectStyle = selectStyle;

function UserRowMenu({ user, onPick }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, []);
  const items = [
    { id: 'edit',  label: 'Edit user',     sub: 'Update name, email, role', icon: 'pencil' },
    { id: 'perms', label: 'Permissions',   sub: 'Module access matrix',     icon: 'lock' },
    { id: 'audit', label: 'View audit log', sub: 'All actions by this user', icon: 'file-text' },
  ];
  if (user.status === 'Pending') {
    items.push({ id: 'resend', label: 'Resend invite', sub: 'Email new activation link', icon: 'mail' });
  }
  const danger = user.status === 'Deactivated'
    ? { id: 'reactivate', label: 'Reactivate',  sub: 'Restore access & permissions', icon: 'user-check', danger: false, separator: true }
    : { id: 'deactivate', label: 'Deactivate',  sub: 'Soft-delete account',           icon: 'ban',        danger: true,  separator: true };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute', top: 38, right: 18, zIndex: 30,
        width: 260, background: '#fff',
        border: '1px solid #E8EBE9', borderRadius: 12,
        boxShadow: '0 16px 36px rgba(15,23,41,.14)',
        overflow: 'hidden', fontFamily: 'Inter', textAlign: 'left',
      }}
    >
      {items.map(it => <UserMenuItem key={it.id} item={it} onPick={onPick} />)}
      <UserMenuItem item={danger} onPick={onPick} />
    </div>
  );
}

function UserPermissionsModal({ user, onClose }) {
  // Mock data — mirrors e1-user-permissions.html (Jean Habimana, Manager, 2 overrides)
  const initialGranted = [
    { perm: 'audit.view',     note: 'View audit log entries — not included in Manager role',                            who: 'Jean Uwimana', when: '01 Apr 2026' },
  ];
  const initialRevoked = [
    { perm: 'inventory.edit', note: 'Overrides Manager role grant — user cannot edit inventory until override is removed', who: 'Jean Uwimana', when: '03 Apr 2026' },
  ];
  const [granted, setGranted] = React.useState(initialGranted);
  const [revoked, setRevoked] = React.useState(initialRevoked);
  const [showAdd, setShowAdd] = React.useState(false);

  const roleGroups = [
    { label: 'Orders',               perms: ['order.view', 'order.create', 'order.edit'] },
    { label: 'Inventory',            perms: ['inventory.view', 'inventory.edit'] },
    { label: 'Suppliers',            perms: ['supplier.view', 'supplier.edit'] },
    { label: 'Products & Logistics', perms: ['products.view', 'products.edit', 'logistics.view', 'logistics.edit', 'reports.view'] },
  ];
  const allRolePerms = roleGroups.flatMap(g => g.perms);
  const revokedSet = new Set(revoked.map(r => r.perm));
  const effective = [
    ...allRolePerms.map(p => ({ perm: p, kind: revokedSet.has(p) ? 'revoked' : 'role' })),
    ...granted.map(g => ({ perm: g.perm, kind: 'granted' })),
  ];

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    const onKey = (e) => { if (e.key === 'Escape') { if (showAdd) setShowAdd(false); else onClose(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, showAdd, granted.length, revoked.length]);

  const removeOverride = (perm, kind) => {
    if (kind === 'granted') setGranted(g => g.filter(x => x.perm !== perm));
    else setRevoked(r => r.filter(x => x.perm !== perm));
  };

  const applyOverride = (perm, type) => {
    const entry = { perm, note: type === 'GRANT' ? 'Added as personal override' : 'Revoked as personal override', who: 'You', when: 'Just now' };
    if (type === 'GRANT') setGranted(g => [...g, entry]);
    else setRevoked(r => [...r, entry]);
    setShowAdd(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, fontFamily: 'Inter', padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 1100, maxHeight: '92vh', background: '#fff',
          borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,.25)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid #E8EBE9' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: user.avatar, color: '#fff', fontWeight: 700, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{user.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0F1729', margin: 0 }}>{user.name}</h1>
              <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F3FAF6', color: '#1F2937' }}>{user.role[0]}</span>
              <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F3FAF6', color: '#1B8C4E' }}>{user.status}</span>
            </div>
            <p style={{ fontSize: 13, color: '#5F6B7A', margin: '2px 0 0' }}>{user.email} · Last login: 04 Apr 2026, 08:42</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#5F6B7A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter' }}>
            <i data-lucide="arrow-left" style={{ width: 16, height: 16 }} /> Back to Users
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#F0F2F5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

            {/* LEFT (main) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Override Summary */}
              <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, padding: 20, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, background: '#F3FAF6', color: '#1B8C4E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i data-lucide="shield-check" style={{ width: 18, height: 18 }} />
                    </span>
                    <div>
                      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Permission Override Summary</h2>
                      <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>{user.name} has {granted.length + revoked.length} active override{(granted.length + revoked.length) === 1 ? '' : 's'} beyond the {user.role[0]} role</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAdd(true)} style={{ ...btnPrimary, height: 32, padding: '0 12px', fontSize: 12 }}>
                    <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Add Override
                  </button>
                </div>
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <SummaryTile value={effective.length - revoked.length} label="Effective Permissions" />
                  <SummaryTile value={granted.length} label="Granted Override" tone="success" />
                  <SummaryTile value={revoked.length} label="Revoked Override" tone="danger" />
                </div>
              </div>

              {/* Role Permissions (read-only) */}
              <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i data-lucide="lock" style={{ width: 16, height: 16, color: '#5F6B7A' }} />
                  <div>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Role Permissions <span style={{ fontWeight: 400, color: '#5F6B7A' }}>(from {user.role[0]} role)</span></h2>
                    <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>{allRolePerms.length} permissions inherited from role. These are read-only — edit via the Permission Matrix.</p>
                  </div>
                </div>
                {roleGroups.map((g, gi) => (
                  <div key={gi} style={{ padding: '12px 20px', borderTop: gi === 0 ? 'none' : '1px solid #E8EBE9' }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: '#5F6B7A', textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 8px' }}>{g.label}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                      {g.perms.map(perm => {
                        const isRevoked = revokedSet.has(perm);
                        return (
                          <div key={perm} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 12px', borderRadius: 8,
                            background: isRevoked ? '#FEE2E2' : '#F9FAFB',
                            border: isRevoked ? '1px solid #FECACA' : '1px solid transparent',
                            opacity: isRevoked ? 1 : 0.55,
                          }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: isRevoked ? 'rgba(231,76,60,.15)' : 'rgba(27,140,78,.12)',
                              color: isRevoked ? '#E74C3C' : '#1B8C4E',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <i data-lucide={isRevoked ? 'x' : 'check'} style={{ width: 12, height: 12 }} />
                            </span>
                            <span style={{ fontSize: 13, color: '#1F2937', fontFamily: 'Menlo, monospace', textDecoration: isRevoked ? 'line-through' : 'none', flex: 1, minWidth: 0 }}>{perm}</span>
                            {isRevoked && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(231,76,60,.12)', color: '#E74C3C' }}>REVOKED</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal Overrides (editable) */}
              <div style={{ background: '#fff', border: '2px solid rgba(27,140,78,.2)', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i data-lucide="pencil" style={{ width: 16, height: 16, color: '#1B8C4E' }} />
                    <div>
                      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Personal Permission Overrides</h2>
                      <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Permissions granted or revoked for this user only</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAdd(true)} style={{ ...btnPrimary, height: 32, padding: '0 12px', fontSize: 12 }}>
                    <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Add Override
                  </button>
                </div>
                {granted.length === 0 && revoked.length === 0 ? (
                  <div style={{ padding: '24px 20px', textAlign: 'center', color: '#8896A4', fontSize: 13 }}>No personal overrides for this user.</div>
                ) : (
                  <>
                    {granted.map(o => <OverrideRow key={'g-' + o.perm} kind="granted" data={o} onRemove={() => removeOverride(o.perm, 'granted')} />)}
                    {revoked.map(o => <OverrideRow key={'r-' + o.perm} kind="revoked" data={o} onRemove={() => removeOverride(o.perm, 'revoked')} />)}
                  </>
                )}
                <div style={{ padding: '10px 20px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5F6B7A' }}>
                  <i data-lucide="info" style={{ width: 14, height: 14 }} />
                  <span>Override changes take effect on the user's next login. All overrides are individually audit-logged.</span>
                </div>
              </div>

              {/* Effective Permissions */}
              <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Effective Permissions</h2>
                  <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Final merged permissions for this user (role + overrides). This is what appears in the JWT.</p>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {effective.map((e, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                        fontFamily: 'Menlo, monospace',
                        background: e.kind === 'granted' ? '#F3FAF6' : '#F0F2F5',
                        color: '#1F2937',
                        border: e.kind === 'granted' ? '1px solid rgba(27,140,78,.2)' : '1px solid transparent',
                        opacity: e.kind === 'revoked' ? 0.4 : 1,
                        textDecoration: e.kind === 'revoked' ? 'line-through' : 'none',
                      }}>
                        {e.perm}
                        {e.kind === 'granted' && <i data-lucide="plus" style={{ width: 11, height: 11, color: '#1B8C4E' }} />}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11, color: '#5F6B7A' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#F0F2F5', border: '1px solid #E8EBE9' }} /> From role</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#F3FAF6', border: '1px solid rgba(27,140,78,.2)' }} /> Granted override</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: '#F0F2F5', border: '1px solid #E8EBE9', opacity: 0.4, textDecoration: 'line-through' }} /> Revoked override</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT (side panel) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* User details */}
              <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: '0 0 12px' }}>User Details</h3>
                <dl style={{ margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <DetailRow label="Full Name" value={user.name} />
                  <DetailRow label="Email" value={user.email} />
                  <DetailRow label="Role" value={<><span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F3FAF6', color: '#1F2937' }}>{user.role[0]}</span> <span style={{ fontSize: 10, color: '#8896A4' }}>System role</span></>} />
                  <DetailRow label="Status" value={<span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F3FAF6', color: '#1B8C4E' }}>{user.status}</span>} />
                  <DetailRow label="Last Login" value="04 Apr 2026, 08:42" />
                  <DetailRow label="Created" value={user.date} />
                </dl>
              </div>

              {/* Override history */}
              <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: '0 0 12px' }}>Override History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {revoked.map(o => (
                    <HistoryRow key={'hr-' + o.perm} dot="#E74C3C" text={<>Revoked <strong>{o.perm}</strong></>} by={`${o.who}, ${o.when}`} />
                  ))}
                  {granted.map(o => (
                    <HistoryRow key={'hg-' + o.perm} dot="#1B8C4E" text={<>Granted <strong>{o.perm}</strong></>} by={`${o.who}, ${o.when}`} />
                  ))}
                </div>
              </div>

              {/* Help card */}
              <div style={{ display: 'flex', gap: 12, padding: 14, borderRadius: 10, background: '#F3FAF6', border: '1px solid rgba(27,140,78,.1)' }}>
                <i data-lucide="info" style={{ width: 16, height: 16, color: '#1B8C4E', flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: '#5F6B7A' }}>
                  <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>How overrides work</p>
                  <p style={{ margin: '0 0 4px' }}><strong>GRANT</strong> adds a permission the role does not provide.</p>
                  <p style={{ margin: '0 0 4px' }}><strong>REVOKE</strong> removes a permission the role normally grants.</p>
                  <p style={{ margin: 0 }}>All changes take effect on the user's next login.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdd && <AddOverrideSubmodal user={user} onCancel={() => setShowAdd(false)} onApply={applyOverride} />}
    </div>
  );
}

function SummaryTile({ value, label, tone }) {
  const styles = tone === 'success'
    ? { bg: '#F3FAF6', color: '#1B8C4E', border: '1px solid rgba(27,140,78,.15)' }
    : tone === 'danger'
    ? { bg: '#FEE2E2', color: '#E74C3C', border: '1px solid rgba(231,76,60,.15)' }
    : { bg: '#F0F2F5', color: '#0F1729', border: '1px solid transparent' };
  return (
    <div style={{ textAlign: 'center', padding: 12, borderRadius: 10, background: styles.bg, border: styles.border }}>
      <p style={{ fontSize: 24, fontWeight: 700, color: styles.color, margin: 0 }}>{value}</p>
      <p style={{ fontSize: 10, color: styles.color, margin: '2px 0 0' }}>{label}</p>
    </div>
  );
}

function OverrideRow({ kind, data, onRemove }) {
  const granted = kind === 'granted';
  const bg = granted ? 'rgba(243,250,246,0.5)' : 'rgba(254,226,226,0.4)';
  const tileBg = granted ? '#F3FAF6' : '#FEE2E2';
  const tileFg = granted ? '#1B8C4E' : '#E74C3C';
  const tileBorder = granted ? 'rgba(27,140,78,.2)' : 'rgba(231,76,60,.2)';
  const pillBg = granted ? '#F3FAF6' : 'rgba(231,76,60,.12)';
  const pillFg = granted ? '#1B8C4E' : '#E74C3C';
  return (
    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, background: bg, borderTop: '1px solid #E8EBE9' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: tileBg, border: `1px solid ${tileBorder}`, color: tileFg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i data-lucide={granted ? 'plus' : 'minus'} style={{ width: 16, height: 16 }} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', fontFamily: 'Menlo, monospace' }}>{data.perm}</span>
            <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: pillBg, color: pillFg }}>{granted ? 'GRANTED' : 'REVOKED'}</span>
          </div>
          <p style={{ fontSize: 11, color: '#5F6B7A', margin: '2px 0 0' }}>{data.note}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: '#8896A4' }}>Added {data.when} by {data.who}</span>
        <button onClick={onRemove} title="Remove override" style={{ background: 'transparent', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#5F6B7A', display: 'inline-flex' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#E74C3C'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5F6B7A'; }}
        >
          <i data-lucide="trash-2" style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <dt style={{ fontSize: 11, color: '#5F6B7A', margin: 0 }}>{label}</dt>
      <dd style={{ margin: '2px 0 0', color: '#1F2937', fontWeight: 500 }}>{value}</dd>
    </div>
  );
}

function HistoryRow({ dot, text, by }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, marginTop: 7, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 12, color: '#1F2937', margin: 0 }}>{text}</p>
        <p style={{ fontSize: 10, color: '#8896A4', margin: 0 }}>{by}</p>
      </div>
    </div>
  );
}

function AddOverrideSubmodal({ user, onCancel, onApply }) {
  const [perm, setPerm] = React.useState('');
  const [type, setType] = React.useState('GRANT');

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [type]);

  const permGroups = [
    { label: 'Audit Logs',      options: [{ value: 'audit.export',    label: 'audit.export — Export audit reports' }] },
    { label: 'Finance',         options: [{ value: 'finance.view',    label: 'finance.view — View financial data' }, { value: 'finance.manage', label: 'finance.manage — Manage invoices' }] },
    { label: 'QC Inspections',  options: [{ value: 'qc.perform',      label: 'qc.perform — Conduct QC inspections' }, { value: 'qc.override',  label: 'qc.override — Override QC decisions' }] },
    { label: 'System Settings', options: [{ value: 'settings.manage', label: 'settings.manage — Modify configuration' }] },
    { label: 'User Management', options: [{ value: 'user.create',     label: 'user.create — Create user accounts' }, { value: 'user.edit',    label: 'user.edit — Edit user profiles' }, { value: 'user.delete', label: 'user.delete — Deactivate accounts' }] },
  ];

  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, fontFamily: 'Inter', padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, background: '#fff', borderRadius: 12,
        boxShadow: '0 24px 60px rgba(0,0,0,.25)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F1729', margin: 0 }}>Add Permission Override</h3>
            <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Grant or revoke a specific permission for {user.name}</p>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#5F6B7A', display: 'inline-flex' }}>
            <i data-lucide="x" style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Permission <span style={{ color: '#E74C3C' }}>*</span></label>
            <Select
              value={perm}
              onChange={setPerm}
              groups={permGroups}
              placeholder="Select a permission…"
              width="100%"
              style={{ width: '100%', minWidth: 'unset' }}
            />
            <p style={{ fontSize: 11, color: '#5F6B7A', margin: '6px 0 0' }}>Only permissions not already in the user's role are shown for GRANT. All role permissions are shown for REVOKE.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Override Type <span style={{ color: '#E74C3C' }}>*</span></label>
            <div style={{ display: 'flex', gap: 12 }}>
              <OverrideTypeOption active={type === 'GRANT'} tone="grant" label="Grant" desc="Add a permission the role does not provide" onClick={() => setType('GRANT')} />
              <OverrideTypeOption active={type === 'REVOKE'} tone="revoke" label="Revoke" desc="Remove a permission the role grants" onClick={() => setType('REVOKE')} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: '#F0F2F5', borderRadius: 8, fontSize: 11, color: '#5F6B7A' }}>
            <i data-lucide="file-text" style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>This override will be logged to the audit trail with your Admin ID. Changes take effect on the user's next login.</span>
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{ ...btnSecondary, height: 36, padding: '0 16px' }}>Cancel</button>
          <button onClick={() => perm && onApply(perm, type)} disabled={!perm} style={{ ...btnPrimary, height: 36, padding: '0 20px', opacity: perm ? 1 : 0.5, cursor: perm ? 'pointer' : 'not-allowed' }}>Apply Override</button>
        </div>
      </div>
    </div>
  );
}

function OverrideTypeOption({ active, tone, label, desc, onClick }) {
  const borderActive = tone === 'revoke' ? '#E74C3C' : '#1B8C4E';
  const bgActive = tone === 'revoke' ? '#FEE2E2' : '#F3FAF6';
  return (
    <label onClick={onClick} style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 12,
      padding: 12, borderRadius: 10, cursor: 'pointer',
      border: active ? `2px solid ${borderActive}` : '2px solid #E8EBE9',
      background: active ? bgActive : '#fff',
      transition: 'all .15s ease',
    }}>
      <input type="radio" checked={active} readOnly style={{ width: 16, height: 16, accentColor: tone === 'revoke' ? '#E74C3C' : '#1B8C4E' }} />
      <div>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{label}</span>
        <p style={{ fontSize: 10, color: '#5F6B7A', margin: '2px 0 0' }}>{desc}</p>
      </div>
    </label>
  );
}

function UserMenuItem({ item, onPick }) {
  const danger = item.danger;
  const tileBg = danger ? '#FEE2E2' : '#F3FAF6';
  const tileFg = danger ? '#E74C3C' : '#1B8C4E';
  const titleColor = danger ? '#E74C3C' : '#1F2937';
  return (
    <button
      onClick={() => onPick(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '10px 12px', border: 'none', borderRadius: 0,
        borderTop: item.separator ? '1px solid #E8EBE9' : 'none',
        background: 'transparent', cursor: 'pointer', textAlign: 'left',
        fontFamily: 'Inter',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#F3FAF6'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ width: 32, height: 32, borderRadius: 8, background: tileBg, color: tileFg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i data-lucide={item.icon} style={{ width: 16, height: 16 }} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: titleColor }}>{item.label}</span>
        <span style={{ display: 'block', fontSize: 11, color: '#8896A4', marginTop: 2 }}>{item.sub}</span>
      </span>
      <i data-lucide="chevron-right" style={{ width: 16, height: 16, color: '#9CA3AF', flexShrink: 0 }} />
    </button>
  );
}
