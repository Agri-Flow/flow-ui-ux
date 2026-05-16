// Users / User Management screen
// Reference: brief screenshot — stat row, search/filter bar, users table.

function Users() {
  const stats = [
  { label: 'Total Users', value: '24', delta: '+3 this month', deltaTone: 'success', icon: 'users', sub: '' },
  { label: 'Active Users', value: '21', sub: '87.5% activation rate', icon: 'check-circle' },
  { label: 'Pending Activation', value: '2', sub: 'Activation email sent', icon: 'clock', subTone: 'warning' },
  { label: 'Deactivated', value: '1', sub: 'Soft-deleted accounts', icon: 'ban' }];


  const users = [
  { initials: 'JU', avatar: '#1B8C4E', name: 'Jean Uwimana', email: 'jean.uwimana@agriflow.rw', phone: '+250 788 123 001', role: ['Admin', 'success'], status: 'Active', date: '15 Jan 2026', action: 'Permissions' },
  { initials: 'AM', avatar: '#3B82F6', name: 'Alice Mukamana', email: 'alice.m@agriflow.rw', phone: '+250 788 123 002', role: ['Manager', 'info'], status: 'Active', date: '20 Jan 2026', action: 'Permissions' },
  { initials: 'PN', avatar: '#F59E0B', name: 'Patrick Nshimiyimana', email: 'patrick.n@agriflow.rw', phone: '+250 788 123 003', role: ['Warehouse Picker', 'danger'], status: 'Active', date: '05 Feb 2026', action: 'Permissions' },
  { initials: 'EN', avatar: '#8B5CF6', name: 'Emmanuel Niyonzima', email: 'emmanuel.n@agriflow.rw', phone: '+250 788 123 004', role: ['Driver', 'purple'], status: 'Active', date: '12 Feb 2026', action: 'Permissions' },
  { initials: 'CU', avatar: '#10B981', name: 'Claudine Uwera', email: 'claudine.u@agriflow.rw', phone: '+250 788 123 005', role: ['Finance', 'teal'], status: 'Pending', date: '01 Apr 2026', action: 'Resend' },
  { initials: 'GN', avatar: '#1B8C4E', name: 'Grace Nyirahabimana', email: 'grace.n@agriflow.rw', phone: '+250 788 123 006', role: ['Manager', 'info'], status: 'Pending', date: '02 Apr 2026', action: 'Resend' },
  { initials: 'DH', avatar: '#9CA3AF', name: 'Diane Habimana', email: 'diane.h@agriflow.rw', phone: '+250 788 123 007', role: ['Warehouse Picker', 'danger'], status: 'Deactivated', date: '22 Jan 2026', action: 'Reactivate', muted: true }];


  const [role, setRole] = React.useState('All Roles');
  const [status, setStatus] = React.useState('All Status');

  const roleStyles = {
    success: { bg: '#EEF6F2', fg: '#117E44' },
    info: { bg: '#EFF6FF', fg: '#1D4ED8' },
    danger: { bg: '#FEF2F2', fg: '#B91C1C' },
    purple: { bg: '#F5F3FF', fg: '#6D28D9' },
    teal: { bg: '#ECFDF5', fg: '#0E7C5A' }
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
        <button style={{ ...btnPrimary, padding: '10px 18px', borderRadius: 999 }}>
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Add NewUser
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) =>
        <Card key={i} padding={18}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>{s.label}</div>
              <i data-lucide={s.icon} style={{ width: 16, height: 16, color: '#9CA3AF' }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>{s.value}</div>
            {s.delta && <div style={{ fontSize: 12, fontWeight: 600, color: '#117E44', marginTop: 4 }}>{s.delta}</div>}
            {s.sub &&
          <div style={{ fontSize: 12, color: s.subTone === 'warning' ? '#B45309' : '#8896A4', marginTop: s.delta ? 2 : 4 }}>{s.sub}</div>
          }
          </Card>
        )}
      </div>

      {/* Search / filter card */}
      <Card padding={18}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>Search</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8, fontSize: 13, color: '#9CA3AF' }}>
            <i data-lucide="search" style={{ width: 14, height: 14 }} />
            <span>Search by name, email, or phone…</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9CA3AF' }}>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
            {['All Roles', 'Admin', 'Manager', 'Warehouse Picker', 'Driver', 'Finance'].map((o) => <option key={o}>{o}</option>)}
          </select>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9CA3AF' }}>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            {['All Status', 'Active', 'Pending', 'Deactivated'].map((o) => <option key={o}>{o}</option>)}
          </select>
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
          <thead>
            <tr>
              {['User', 'Phone', 'Role', 'Status', 'Date Added', 'Actions'].map((h, i) =>
              <th key={i} style={{ textAlign: i === 5 ? 'right' : 'left', padding: '14px 22px', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
              )}
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
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{u.date}</td>
                  <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                      <button style={{ background: 'none', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{u.action}</button>
                      <i data-lucide="more-vertical" style={{ width: 16, height: 16, color: '#9CA3AF', cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>);

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
    </div>);

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
      fontFamily: 'Inter'
    }}>{children}</button>);

}

function FilterChip({ label, onClose }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, background: '#F0F2F5', color: '#374151' }}>
      {label}
      <span onClick={onClose} style={{ cursor: 'pointer', color: '#9CA3AF', fontSize: 13, lineHeight: 1 }}>×</span>
    </span>);

}

const selectStyle = {
  padding: '8px 12px', border: '1px solid #E8EBE9', borderRadius: 8,
  fontSize: 13, fontFamily: 'Inter', color: '#1F2937', background: '#fff',
  cursor: 'pointer', minWidth: 140
};

window.Users = Users;