// Roles & Permissions screen — role cards grid + summary matrix + escalation card.
// Clicking "Edit Permissions" switches to the matrix toggle view (EditPermissionsMatrix).
function Permissions() {
  const [view, setView] = React.useState('roles'); // 'roles' | 'matrix' | 'editRole' | 'createRole'
  const [editingRole, setEditingRole] = React.useState(null);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [view]);
  if (view === 'matrix') return <EditPermissionsMatrix onBack={() => setView('roles')} />;
  if (view === 'editRole' && editingRole) return <EditRoleScreen role={editingRole} onBack={() => { setView('roles'); setEditingRole(null); }} />;
  if (view === 'createRole') return <CreateRoleScreen onBack={() => setView('roles')} />;
  return <RolesScreen onEdit={() => setView('matrix')} onEditRole={(r) => { setEditingRole(r); setView('editRole'); }} onCreate={() => setView('createRole')} />;
}

function RolesScreen({ onEdit, onEditRole, onCreate }) {
  const [escalating, setEscalating] = React.useState(false);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [escalating]);

  const roles = [
    { id: 'admin',   name: 'Admin',           tagline: 'Full platform access',  users: 2, system: true,
      icon: 'shield-check', tone: { bg: 'rgba(27,140,78,.1)', fg: '#1B8C4E', border: 'rgba(27,140,78,.3)' },
      desc: 'Manages users, roles, system settings, and has unrestricted access to all modules including audit logs.',
      tags: ['Users', 'Roles', 'Audit Logs', 'Settings', '+8 more'] },
    { id: 'manager', name: 'Manager',         tagline: 'Operations oversight', users: 5, system: false,
      icon: 'building-2', tone: { bg: '#EEF6FF', fg: '#3B82F6', border: 'transparent' },
      desc: 'Oversees warehouse operations, approves orders, views reports, and manages suppliers. Cannot modify system settings or roles.',
      tags: ['Orders', 'Inventory', 'Suppliers', 'Reports'] },
    { id: 'picker',  name: 'Warehouse Picker', tagline: 'Inventory operations', users: 8, system: false,
      icon: 'package-search', tone: { bg: '#F3FAF6', fg: '#F59E0B', border: 'transparent' },
      desc: 'Performs QC inspections, picks orders from inventory using FIFO, and records batch movements. Mobile-first access.',
      tags: ['QC Forms', 'Picking', 'Inventory (read)'] },
    { id: 'driver',  name: 'Driver',          tagline: 'Delivery operations',  users: 6, system: false,
      icon: 'truck', tone: { bg: '#F3FAF6', fg: '#1F2937', border: 'transparent' },
      desc: 'Manages delivery routes, captures proof of delivery, and confirms GPS drop-off. Offline-first mobile access (8hr minimum).',
      tags: ['Deliveries', 'PoD Capture', 'Routes'] },
    { id: 'finance', name: 'Finance Officer', tagline: 'Financial operations', users: 3, system: false,
      icon: 'circle-dollar-sign', tone: { bg: '#F3FAF6', fg: '#1F2937', border: 'transparent' },
      desc: 'Manages invoicing, payment reconciliation, consignment settlements, and financial reporting. Read-only inventory access.',
      tags: ['Invoices', 'Payments', 'Reports'] },
  ];

  const modules = [
    { name: 'User Management', admin: 'full', manager: 'Read',     picker: 'none',  driver: 'none',    finance: 'none' },
    { name: 'Audit Logs',      admin: 'full', manager: 'Read',     picker: 'none',  driver: 'none',    finance: 'Read' },
    { name: 'Orders',          admin: 'full', manager: 'full',     picker: 'Pick only', driver: 'Deliver', finance: 'Invoice' },
    { name: 'Inventory',       admin: 'full', manager: 'full',     picker: 'Move',  driver: 'none',    finance: 'Read' },
    { name: 'Suppliers',       admin: 'full', manager: 'full',     picker: 'none',  driver: 'none',    finance: 'Read' },
    { name: 'Logistics',       admin: 'full', manager: 'full',     picker: 'none',  driver: 'full',    finance: 'none' },
    { name: 'System Settings', admin: 'full', manager: 'none',     picker: 'none',  driver: 'none',    finance: 'none' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Inter' }} data-screen-label="permissions">
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0F1729', margin: 0 }}>Roles & Permissions</h1>
          <p style={{ fontSize: 13, color: '#5F6B7A', margin: '4px 0 0' }}>Define what each role can access across the platform</p>
        </div>
        <button onClick={onCreate} style={{ ...btnPrimary, height: 36, padding: '0 16px', fontSize: 13 }}>
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Create Role
        </button>
      </div>

      {/* Role cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {roles.map(r => <RoleCard key={r.id} role={r} onEdit={() => onEditRole && onEditRole(r)} />)}
      </div>

      {/* Permission Matrix summary */}
      <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Permission Matrix</h2>
            <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Detailed access control per module and action type</p>
          </div>
          <button onClick={onEdit} style={{ ...btnSecondary, height: 32, padding: '0 12px', fontSize: 12 }}>
            <i data-lucide="pencil" style={{ width: 14, height: 14 }} /> Edit Permissions
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13, minWidth: 760 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E8EBE9' }}>
                <th style={{ ...mthBase, textAlign: 'left', minWidth: 200 }}>Module</th>
                {['Admin', 'Manager', 'Picker', 'Driver', 'Finance'].map(r => (
                  <th key={r} style={{ ...mthBase, textAlign: 'center' }}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #F0F2F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{m.name}</td>
                  {['admin', 'manager', 'picker', 'driver', 'finance'].map(rk => (
                    <td key={rk} style={{ padding: '10px 16px', textAlign: 'center' }}><AccessCell value={m[rk]} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '10px 18px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 11, color: '#5F6B7A' }}>
          <i data-lucide="info" style={{ width: 13, height: 13 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: 'rgba(27,140,78,.12)' }}>
            <i data-lucide="check" style={{ width: 11, height: 11, color: '#1B8C4E' }} />
          </span>
          <span>Full CRUD</span>
          <span style={{ color: '#D0D5DD' }}>•</span>
          <span><strong style={{ color: '#1F2937', fontWeight: 600 }}>Read / Action</strong> = Partial access</span>
          <span style={{ color: '#D0D5DD' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: 'rgba(231,76,60,.12)' }}>
            <i data-lucide="x" style={{ width: 11, height: 11, color: '#E74C3C' }} />
          </span>
          <span>No access</span>
          <span style={{ color: '#D0D5DD' }}>•</span>
          <span>Unauthorized attempts return <code style={{ background: '#F0F2F5', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontFamily: 'Menlo, monospace' }}>403 Forbidden</code> and are audit-logged</span>
        </div>
      </div>

      {/* Privilege Escalation card */}
      <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i data-lucide="alert-triangle" style={{ width: 16, height: 16, color: '#F59E0B' }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Privilege Escalation Protection</h3>
        </div>
        <div style={{ padding: 18 }}>
          <p style={{ fontSize: 13, color: '#5F6B7A', margin: '0 0 14px' }}>
            Creating or promoting a user to <span style={{ fontWeight: 600, color: '#1F2937' }}>Admin</span> requires a secondary confirmation step and optionally alerts all existing platform stakeholders.
          </p>
          <div style={{ background: '#F9FAFB', border: '1px solid #E8EBE9', borderRadius: 10, padding: 18, maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEF9E7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i data-lucide="alert-triangle" style={{ width: 18, height: 18, color: '#F59E0B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0F1729', margin: 0 }}>Confirm Admin Role Assignment</h4>
                <p style={{ fontSize: 12, color: '#5F6B7A', margin: '4px 0 12px' }}>You are about to grant <span style={{ fontWeight: 600, color: '#1F2937' }}>Alice Mukamana</span> full Admin privileges. This action will be audit-logged and all existing admins will be notified.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEscalating(true)} style={{ height: 32, padding: '0 12px', borderRadius: 8, border: 'none', background: '#E74C3C', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>Confirm Escalation</button>
                  <button style={{ ...btnSecondary, height: 32, padding: '0 12px', fontSize: 12 }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {escalating && <CenterModal
        open
        onClose={() => setEscalating(false)}
        icon="shield-check"
        iconTone="success"
        title="Escalation confirmed"
        subtitle="The change is audit-logged. Alice Mukamana now has Admin privileges."
        maxWidth={420}
        auditNote
        footer={<button onClick={() => setEscalating(false)} style={{ ...btnPrimary, height: 36, padding: '0 16px' }}>Done</button>}
      />}
    </div>
  );
}

function RoleCard({ role, onEdit }) {
  return (
    <div style={{
      background: '#fff',
      border: role.system ? '2px solid rgba(27,140,78,.3)' : '1px solid #E8EBE9',
      borderRadius: 12, padding: 18, fontFamily: 'Inter',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: role.tone.bg, color: role.tone.fg,
            border: role.tone.border !== 'transparent' ? `1px solid ${role.tone.border}` : 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i data-lucide={role.icon} style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>{role.name}</h3>
            <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>{role.tagline}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', padding: '2px 8px', borderRadius: 9999,
            fontSize: 10, fontWeight: 700,
            background: role.system ? 'rgba(27,140,78,.1)' : '#F3FAF6',
            color: role.system ? '#1B8C4E' : '#1F2937',
          }}>{role.users} users</span>
          {role.system ? (
            <span title="System role — cannot edit" style={{
              width: 28, height: 28, borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(95,107,122,0.4)', cursor: 'not-allowed',
            }}>
              <i data-lucide="lock" style={{ width: 14, height: 14 }} />
            </span>
          ) : (
            <button onClick={onEdit} title={`Edit ${role.name} role`} style={{
              width: 28, height: 28, borderRadius: 8, border: 'none',
              background: 'transparent', color: '#5F6B7A', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F3FAF6'; e.currentTarget.style.color = '#1F2937'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5F6B7A'; }}
            >
              <i data-lucide="pencil" style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#5F6B7A', margin: '0 0 12px', lineHeight: 1.5 }}>{role.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {role.tags.map(t => (
          <span key={t} style={{
            padding: '2px 8px', borderRadius: 6,
            fontSize: 10, fontWeight: 500,
            background: '#F0F2F5', color: '#5F6B7A',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function AccessCell({ value }) {
  if (value === 'full') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(27,140,78,.12)' }}>
        <i data-lucide="check" style={{ width: 14, height: 14, color: '#1B8C4E' }} />
      </span>
    );
  }
  if (value === 'none') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(231,76,60,.12)' }}>
        <i data-lucide="x" style={{ width: 14, height: 14, color: '#E74C3C' }} />
      </span>
    );
  }
  return <span style={{ fontSize: 11, color: '#5F6B7A' }}>{value}</span>;
}

// Reserved system role names — name conflicts surface a destructive error state
const RESERVED_ROLE_NAMES = ['admin', 'manager', 'warehouse picker', 'picker', 'driver', 'finance officer', 'finance'];

const CREATE_ROLE_PERM_GROUPS = [
  { label: 'User Management', perms: [
    { key: 'user.view',   sub: 'View user profiles and list',  tag: 'Users (view)' },
    { key: 'user.create', sub: 'Create new user accounts',     tag: 'Users (create)' },
    { key: 'user.edit',   sub: 'Edit user profiles and roles', tag: 'Users (edit)' },
    { key: 'user.delete', sub: 'Deactivate user accounts',     tag: 'Users (delete)' },
  ]},
  { label: 'Orders', perms: [
    { key: 'order.view',   sub: 'View all orders',        tag: 'Orders' },
    { key: 'order.create', sub: 'Create new orders',      tag: 'Orders' },
    { key: 'order.edit',   sub: 'Modify existing orders', tag: 'Orders' },
  ]},
  { label: 'Inventory', perms: [
    { key: 'inventory.view', sub: 'View stock levels and batches', tag: 'Inventory' },
    { key: 'inventory.edit', sub: 'Move stock and adjust batches', tag: 'Inventory' },
  ]},
  { label: 'QC Inspections', perms: [
    { key: 'qc.perform',  sub: 'Conduct QC inspections',           tag: 'QC' },
    { key: 'qc.override', sub: 'Override QC decisions (audit-logged)', tag: 'QC' },
  ]},
  { label: 'Products', perms: [
    { key: 'products.view', sub: 'View product catalog',      tag: 'Products' },
    { key: 'products.edit', sub: 'Edit product details and SKUs', tag: 'Products' },
  ]},
  { label: 'Suppliers', perms: [
    { key: 'supplier.view', sub: 'View supplier directory',  tag: 'Suppliers (view)' },
    { key: 'supplier.edit', sub: 'Edit supplier profiles',   tag: 'Suppliers (edit)' },
  ]},
  { label: 'Audit Logs', perms: [
    { key: 'audit.view',   sub: 'View audit log entries',    tag: 'Audit' },
    { key: 'audit.export', sub: 'Export audit reports (FDA)', tag: 'Audit (export)' },
  ]},
  { label: 'Logistics', perms: [
    { key: 'logistics.view', sub: 'View delivery schedules',     tag: 'Logistics' },
    { key: 'logistics.edit', sub: 'Manage routes and deliveries', tag: 'Logistics' },
  ]},
  { label: 'Reports & Finance', perms: [
    { key: 'reports.view',   sub: 'View analytics reports',         tag: 'Reports' },
    { key: 'finance.view',   sub: 'View financial data',            tag: 'Finance (view)' },
    { key: 'finance.manage', sub: 'Manage invoices and payments',   tag: 'Finance (manage)' },
  ]},
  { label: 'System Settings', perms: [
    { key: 'settings.manage', sub: 'Modify system configuration', tag: 'Settings' },
  ]},
];

function CreateRoleScreen({ onBack }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [color, setColor] = React.useState('#3B82F6');
  const [selected, setSelected] = React.useState(new Set());

  const totalPerms = CREATE_ROLE_PERM_GROUPS.reduce((s, g) => s + g.perms.length, 0);
  const nameLower = name.trim().toLowerCase();
  const nameDuplicate = nameLower && RESERVED_ROLE_NAMES.includes(nameLower);
  const canCreate = name.trim().length > 0 && !nameDuplicate;

  const colorChoices = ['#3B82F6', '#8B5CF6', '#F59E0B', '#14B8A6', '#EC4899', '#6366F1', '#EAB308', '#E74C3C'];

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [selected.size, color, name, desc]);

  const toggle = (key) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  // Derive preview tags from the selected permissions (group-level dedupe via tag value)
  const previewTags = (() => {
    const tags = [];
    const seen = new Set();
    for (const g of CREATE_ROLE_PERM_GROUPS) {
      for (const p of g.perms) {
        if (selected.has(p.key) && !seen.has(p.tag)) {
          seen.add(p.tag);
          tags.push(p.tag);
        }
      }
    }
    return tags;
  })();

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Inter' }} data-screen-label="create-role">
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0F1729', margin: 0 }}>Create Custom Role</h1>
          <p style={{ fontSize: 13, color: '#5F6B7A', margin: '4px 0 0' }}>Define a new role with custom permissions for your team</p>
        </div>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5F6B7A', fontSize: 13, fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i data-lucide="arrow-left" style={{ width: 14, height: 14 }} /> Back to Roles
        </button>
      </div>

      {/* 2/3 + 1/3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Role Details */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Role Details</h2>
              <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Basic information about the custom role</p>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Role Name <span style={{ color: '#E74C3C' }}>*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Supervisor Picker, Finance Assistant" maxLength={50}
                  style={{
                    width: '100%', height: 36, padding: '0 12px', boxSizing: 'border-box',
                    border: `1px solid ${nameDuplicate ? '#E74C3C' : '#E8EBE9'}`,
                    borderRadius: 8, background: '#fff', fontSize: 13, fontFamily: 'Inter', color: '#1F2937', outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = nameDuplicate ? '#E74C3C' : '#1B8C4E';
                    e.target.style.boxShadow = `0 0 0 3px ${nameDuplicate ? 'rgba(231,76,60,.15)' : 'rgba(27,140,78,.15)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = nameDuplicate ? '#E74C3C' : '#E8EBE9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {nameDuplicate ? (
                  <p style={{ fontSize: 11, color: '#E74C3C', margin: '4px 0 0' }}>Role name “{name.trim()}” already exists. Please choose a unique name.</p>
                ) : (
                  <p style={{ fontSize: 11, color: '#8896A4', margin: '4px 0 0' }}>Max 50 characters. Must be unique across all roles.</p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the purpose and responsibilities of this role…" rows={3} maxLength={250}
                  style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box', border: '1px solid #E8EBE9', borderRadius: 8, background: '#fff', fontSize: 13, fontFamily: 'Inter', color: '#1F2937', outline: 'none', resize: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = '#1B8C4E'; e.target.style.boxShadow = '0 0 0 3px rgba(27,140,78,.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8EBE9'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 11, color: '#8896A4', margin: '4px 0 0' }}>Optional. Max 250 characters. For internal documentation only.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Role Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {colorChoices.map(c => {
                    const active = c === color;
                    return (
                      <button key={c} onClick={() => setColor(c)} aria-label={`Pick color ${c}`}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', background: c,
                          border: 'none', cursor: 'pointer', padding: 0,
                          boxShadow: active ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                          transition: 'box-shadow .12s ease',
                        }}
                      />
                    );
                  })}
                </div>
                <p style={{ fontSize: 11, color: '#8896A4', margin: '6px 0 0' }}>Used for role badges and card accent colors</p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Permissions</h2>
                <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Select which permissions this role should have</p>
              </div>
              <span style={{ fontSize: 11, color: '#5F6B7A' }}>{selected.size} of {totalPerms} selected</span>
            </div>
            {CREATE_ROLE_PERM_GROUPS.map((g, gi) => {
              const selectedInGroup = g.perms.filter(p => selected.has(p.key)).length;
              return (
                <div key={g.label} style={{ padding: '12px 20px', borderTop: gi === 0 ? 'none' : '1px solid #E8EBE9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: '#1F2937', textTransform: 'uppercase', letterSpacing: 0.6, margin: 0 }}>{g.label}</h3>
                    <span style={{ fontSize: 10, color: '#8896A4' }}>{selectedInGroup} of {g.perms.length} selected</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {g.perms.map(p => {
                      const isOn = selected.has(p.key);
                      return (
                        <label key={p.key} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                          background: 'transparent',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <input type="checkbox" checked={isOn} onChange={() => toggle(p.key)}
                            style={{ width: 16, height: 16, accentColor: '#1B8C4E', marginTop: 1, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: 13, color: '#1F2937', fontFamily: 'Menlo, monospace' }}>{p.key}</span>
                            {p.sub && <p style={{ fontSize: 10, color: '#8896A4', margin: '1px 0 0' }}>{p.sub}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Form actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ fontSize: 11, color: '#5F6B7A', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="file-text" style={{ width: 13, height: 13 }} />
                Role creation will be logged to the audit trail
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onBack} style={{ ...btnSecondary, height: 36, padding: '0 16px' }}>Cancel</button>
                <button onClick={onBack} disabled={!canCreate}
                  style={{ ...btnPrimary, height: 36, padding: '0 18px', opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}>
                  <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Create Role
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — live preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Live Preview</h3>
          <p style={{ fontSize: 11, color: '#8896A4', margin: '-4px 0 0' }}>This is how the role card will appear in the roles list</p>

          <div style={{ background: '#fff', border: `2px solid ${color}55`, borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}1A`, color,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <i data-lucide="shield-check" style={{ width: 20, height: 20 }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name.trim() || 'Untitled Role'}</h3>
                  <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Custom role</p>
                </div>
              </div>
              <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F0F2F5', color: '#5F6B7A', flexShrink: 0 }}>Custom</span>
            </div>
            <p style={{ fontSize: 12, color: '#5F6B7A', margin: '0 0 12px', lineHeight: 1.5, minHeight: 18 }}>{desc.trim() || 'Add a description to clarify what this role can do.'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {previewTags.length === 0 ? (
                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 500, background: '#F0F2F5', color: '#8896A4' }}>No permissions selected</span>
              ) : (
                previewTags.slice(0, 8).map(t => (
                  <span key={t} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 500, background: '#F0F2F5', color: '#5F6B7A' }}>{t}</span>
                ))
              )}
              {previewTags.length > 8 && (
                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 500, background: '#F0F2F5', color: '#5F6B7A' }}>+{previewTags.length - 8} more</span>
              )}
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#5F6B7A' }}>
              <span>{selected.size} permission{selected.size === 1 ? '' : 's'}</span>
              <span style={{ color: '#D0D5DD' }}>|</span>
              <span>0 users assigned</span>
            </div>
          </div>

          {/* Info card */}
          <div style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 10, background: '#F3FAF6', border: '1px solid rgba(27,140,78,.1)' }}>
            <i data-lucide="info" style={{ width: 16, height: 16, color: '#1B8C4E', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#5F6B7A' }}>
              <p style={{ fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>About custom roles</p>
              <p style={{ margin: 0 }}>Custom roles can be edited or archived at any time. System roles (Admin, Manager, Picker, Driver, Finance) are immutable and can only have permissions adjusted via the Permission Matrix.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mthBase = {
  padding: '12px 16px',
  fontSize: 11,
  fontWeight: 700,
  color: '#5F6B7A',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  borderBottom: '1px solid #E8EBE9',
};

// Edit Role screen — per-role detail + grouped permission checkboxes + side panel + archive
function EditRoleScreen({ role, onBack }) {
  const [name, setName] = React.useState(role.name);
  const [desc, setDesc] = React.useState(role.desc);
  const [color, setColor] = React.useState(role.tone.fg);
  const [showArchive, setShowArchive] = React.useState(false);

  const permGroups = [
    { label: 'User Management', perms: [
      { key: 'user.view',   sub: 'View user profiles and list',    baseline: ['admin', 'manager'] },
      { key: 'user.create', sub: 'Create new user accounts',       baseline: ['admin'] },
      { key: 'user.edit',   sub: 'Edit user profiles and roles',   baseline: ['admin'] },
      { key: 'user.delete', sub: 'Deactivate user accounts',       baseline: ['admin'] },
    ]},
    { label: 'Orders', perms: [
      { key: 'order.view',   sub: 'View all orders',         baseline: ['admin', 'manager', 'driver', 'finance'] },
      { key: 'order.create', sub: 'Create new orders',       baseline: ['admin', 'manager'] },
      { key: 'order.edit',   sub: 'Modify existing orders',  baseline: ['admin', 'manager'] },
    ]},
    { label: 'Inventory', perms: [
      { key: 'inventory.view', sub: 'Read stock levels',     baseline: ['admin', 'manager', 'picker', 'finance'] },
      { key: 'inventory.edit', sub: 'Move and adjust stock', baseline: ['admin', 'manager', 'picker'] },
    ]},
    { label: 'QC Inspections', perms: [
      { key: 'qc.perform',   sub: 'Conduct QC inspections',  baseline: ['admin', 'manager', 'picker'] },
      { key: 'qc.override',  sub: 'Override QC decisions',   baseline: ['admin', 'manager'] },
    ]},
    { label: 'Products', perms: [
      { key: 'products.view', sub: 'View product catalog',   baseline: ['admin', 'manager', 'picker', 'finance'] },
      { key: 'products.edit', sub: 'Edit product catalog',   baseline: ['admin', 'manager'] },
    ]},
  ];

  const initialSelected = React.useMemo(() => {
    const s = new Set();
    permGroups.forEach(g => g.perms.forEach(p => { if (p.baseline.includes(role.id)) s.add(p.key); }));
    return s;
  }, [role.id]);
  const [selected, setSelected] = React.useState(initialSelected);
  const toggle = (key) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const totalPerms = permGroups.reduce((sum, g) => sum + g.perms.length, 0) + 10; // +10 for the collapsed groups
  const colorChoices = ['#3B82F6', '#8B5CF6', '#F59E0B', '#14B8A6', '#EC4899', '#6366F1', '#EAB308', '#E74C3C'];

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [showArchive, selected.size, color]);

  const assignedUsers = [
    { initials: 'PM', name: 'Patrick Mugisha',    email: 'patrick@agriflow.rw' },
    { initials: 'AN', name: 'Alice Niyonsaba',    email: 'alice@agriflow.rw' },
    { initials: 'EN', name: 'Emmanuel Nsengimana', email: 'emmanuel@agriflow.rw' },
  ];
  const history = [
    { dot: '#1B8C4E',           text: <>Added <strong>qc.override</strong> permission</>,  by: 'Jean Uwimana, 02 Apr 2026' },
    { dot: '#9CA3AF',           text: 'Updated description',                                by: 'Jean Uwimana, 30 Mar 2026' },
    { dot: '#9CA3AF',           text: 'Role created',                                       by: 'Jean Uwimana, 28 Mar 2026' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Inter' }} data-screen-label="edit-role">
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: role.tone.bg, color: role.tone.fg,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i data-lucide={role.icon} style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0F1729', margin: 0 }}>Edit: {role.name}</h1>
              <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F0F2F5', color: '#5F6B7A' }}>{role.system ? 'System' : 'Custom'}</span>
            </div>
            <p style={{ fontSize: 13, color: '#5F6B7A', margin: '2px 0 0' }}>Created by Jean Uwimana on 28 Mar 2026 · {role.users} users assigned</p>
          </div>
        </div>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5F6B7A', fontSize: 13, fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <i data-lucide="arrow-left" style={{ width: 14, height: 14 }} /> Back to Roles
        </button>
      </div>

      {/* 2/3 + 1/3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Role Details */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9' }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Role Details</h2>
              <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Edit role name, description, and color</p>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Role Name <span style={{ color: '#E74C3C' }}>*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} disabled={role.system}
                  style={{ width: '100%', height: 36, padding: '0 12px', boxSizing: 'border-box', border: '1px solid #E8EBE9', borderRadius: 8, background: role.system ? '#F9FAFB' : '#fff', fontSize: 13, fontFamily: 'Inter', color: '#1F2937', outline: 'none' }}
                  onFocus={(e) => { if (!role.system) { e.target.style.borderColor = '#1B8C4E'; e.target.style.boxShadow = '0 0 0 3px rgba(27,140,78,.15)'; } }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8EBE9'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 11, color: '#8896A4', margin: '4px 0 0' }}>Max 50 characters. Must be unique across all roles.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} disabled={role.system}
                  style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box', border: '1px solid #E8EBE9', borderRadius: 8, background: role.system ? '#F9FAFB' : '#fff', fontSize: 13, fontFamily: 'Inter', color: '#1F2937', outline: 'none', resize: 'none' }}
                  onFocus={(e) => { if (!role.system) { e.target.style.borderColor = '#1B8C4E'; e.target.style.boxShadow = '0 0 0 3px rgba(27,140,78,.15)'; } }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8EBE9'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 11, color: '#8896A4', margin: '4px 0 0' }}>Optional. Max 250 characters.</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 6 }}>Role Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {colorChoices.map(c => {
                    const active = c === color;
                    return (
                      <button key={c} onClick={() => !role.system && setColor(c)} disabled={role.system}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', background: c,
                          border: 'none', cursor: role.system ? 'not-allowed' : 'pointer', padding: 0,
                          boxShadow: active ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                          opacity: role.system ? 0.5 : 1,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: 0 }}>Permissions</h2>
                <p style={{ fontSize: 12, color: '#5F6B7A', margin: '2px 0 0' }}>Adjust which permissions this role has</p>
              </div>
              <span style={{ fontSize: 11, color: '#5F6B7A' }}>{selected.size} of {totalPerms} selected</span>
            </div>
            {permGroups.map((g, gi) => {
              const selectedInGroup = g.perms.filter(p => selected.has(p.key)).length;
              return (
                <div key={g.label} style={{ padding: '12px 20px', borderTop: gi === 0 ? 'none' : '1px solid #E8EBE9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: '#1F2937', textTransform: 'uppercase', letterSpacing: 0.6, margin: 0 }}>{g.label}</h3>
                    <span style={{ fontSize: 10, color: '#8896A4' }}>{selectedInGroup} of {g.perms.length} selected</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {g.perms.map(p => {
                      const isOn = selected.has(p.key);
                      return (
                        <label key={p.key} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                          background: 'transparent',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <input type="checkbox" checked={isOn} onChange={() => toggle(p.key)}
                            style={{ width: 16, height: 16, accentColor: '#1B8C4E', marginTop: 1, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: 13, color: '#1F2937', fontFamily: 'Menlo, monospace' }}>{p.key}</span>
                            {p.sub && <p style={{ fontSize: 10, color: '#8896A4', margin: '1px 0 0' }}>{p.sub}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#5F6B7A' }}>
              <span>Suppliers, Audit Logs, Logistics, Reports, Finance, System Settings</span>
              <span>0 of 10 selected</span>
            </div>

            {/* Form actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => setShowArchive(true)} disabled={role.system} style={{
                background: 'transparent', border: 'none', color: role.system ? '#D0D5DD' : '#E74C3C',
                cursor: role.system ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'Inter',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <i data-lucide="archive" style={{ width: 14, height: 14 }} /> Archive Role
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onBack} style={{ ...btnSecondary, height: 36, padding: '0 16px' }}>Cancel</button>
                <button onClick={onBack} style={{ ...btnPrimary, height: 36, padding: '0 18px' }}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role information */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: '0 0 12px' }}>Role Information</h3>
            <dl style={{ margin: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <dt style={{ fontSize: 11, color: '#5F6B7A', margin: 0 }}>Type</dt>
                <dd style={{ margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6, color: '#1F2937', fontWeight: 500 }}>
                  <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, background: '#F0F2F5', color: '#5F6B7A' }}>{role.system ? 'System' : 'Custom'}</span>
                  {role.system ? 'Read-only' : 'Editable'}
                </dd>
              </div>
              <DetailLine label="Created" value="28 Mar 2026" />
              <DetailLine label="Created By" value="Jean Uwimana (Admin)" />
              <DetailLine label="Last Modified" value="02 Apr 2026" />
              <DetailLine label="Assigned Users" value={`${role.users} active users`} />
            </dl>
          </div>

          {/* Assigned Users */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: '0 0 12px' }}>Assigned Users</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignedUsers.map(u => (
                <div key={u.initials} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3FAF6', color: '#1B8C4E', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{u.initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', margin: 0 }}>{u.name}</p>
                    <p style={{ fontSize: 10, color: '#8896A4', margin: 0 }}>{u.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Changes */}
          <div style={{ background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: 'var(--shadow-card)', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F1729', margin: '0 0 12px' }}>Recent Changes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: h.dot, marginTop: 7, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12, color: '#1F2937', margin: 0 }}>{h.text}</p>
                    <p style={{ fontSize: 10, color: '#8896A4', margin: 0 }}>{h.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showArchive && <ArchiveRoleModal role={role} onCancel={() => setShowArchive(false)} onConfirm={() => { setShowArchive(false); onBack(); }} />}
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div>
      <dt style={{ fontSize: 11, color: '#5F6B7A', margin: 0 }}>{label}</dt>
      <dd style={{ margin: '2px 0 0', color: '#1F2937', fontWeight: 500 }}>{value}</dd>
    </div>
  );
}

function ArchiveRoleModal({ role, onCancel, onConfirm }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, []);
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, fontFamily: 'Inter', padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, background: '#fff', borderRadius: 12,
        boxShadow: '0 24px 60px rgba(0,0,0,.25)', overflow: 'hidden',
      }}>
        <div style={{ padding: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(231,76,60,.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i data-lucide="archive" style={{ width: 22, height: 22, color: '#E74C3C' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F1729', margin: 0 }}>Archive “{role.name}”?</h3>
            <p style={{ fontSize: 13, color: '#5F6B7A', margin: '8px 0 0' }}>This custom role will be archived (soft deleted). It can be restored later by an Admin.</p>

            <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#FEF9E7', border: '1px solid rgba(245,158,11,.3)', display: 'flex', gap: 10 }}>
              <i data-lucide="alert-triangle" style={{ width: 16, height: 16, color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#F59E0B', margin: 0 }}>{role.users} user{role.users === 1 ? '' : 's'} {role.users === 1 ? 'is' : 'are'} currently assigned to this role</p>
                <p style={{ fontSize: 11, color: '#F59E0B', margin: '4px 0 0' }}>Patrick Mugisha, Alice Niyonsaba, and Emmanuel Nsengimana will retain their current access until they are manually reassigned to a different role.</p>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 11, color: '#5F6B7A' }}>
              <p style={{ margin: 0 }}>What happens when a role is archived:</p>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                <li>The role is hidden from new role assignment dropdowns</li>
                <li>Existing users keep their permissions until reassigned</li>
                <li>The role can be restored from the “Archived Roles” section</li>
                <li>All audit trail entries are preserved</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid #E8EBE9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{ ...btnSecondary, height: 36, padding: '0 16px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 'none', background: '#E74C3C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i data-lucide="archive" style={{ width: 14, height: 14 }} /> Archive Role
          </button>
        </div>
      </div>
    </div>
  );
}

// Permissions matrix screen — modules × roles toggles, dirty-state, sticky save bar
function EditPermissionsMatrix({ onBack }) {
  const roles = [
    { id: 'admin',      label: 'Admin',            kind: 'System' },
    { id: 'manager',    label: 'Manager',          kind: 'System' },
    { id: 'picker',     label: 'Picker',           kind: 'System' },
    { id: 'driver',     label: 'Driver',           kind: 'System' },
    { id: 'finance',    label: 'Finance',          kind: 'System' },
    { id: 'supervisor', label: 'Supervisor Picker', kind: 'Custom' },
  ];

  const groups = [
    {
      label: 'User Management',
      perms: [
        { key: 'user.create', baseline: { admin: true } },
        { key: 'user.view',   baseline: { admin: true, manager: true, supervisor: true } },
        { key: 'user.edit',   baseline: { admin: true } },
        { key: 'user.delete', baseline: { admin: true } },
      ],
    },
    {
      label: 'Audit Logs',
      perms: [
        { key: 'audit.view',   baseline: { admin: true, manager: true, finance: true } },
        { key: 'audit.export', baseline: { admin: true } },
      ],
    },
    {
      label: 'Orders',
      perms: [
        { key: 'order.view',   baseline: { admin: true, manager: true, driver: true, finance: true, supervisor: true } },
        { key: 'order.create', baseline: { admin: true, manager: true, supervisor: true } },
        { key: 'order.edit',   baseline: { admin: true, manager: true } },
      ],
    },
    {
      label: 'Inventory',
      perms: [
        { key: 'inventory.view',   baseline: { admin: true, manager: true, picker: true, supervisor: true } },
        { key: 'inventory.adjust', baseline: { admin: true, manager: true, supervisor: true } },
      ],
    },
    {
      label: 'Logistics',
      perms: [
        { key: 'logistics.view', baseline: { admin: true, manager: true, driver: true } },
        { key: 'logistics.edit', baseline: { admin: true, manager: true } },
      ],
    },
    {
      label: 'Products',
      perms: [
        { key: 'products.view', baseline: { admin: true, manager: true, picker: true, supervisor: true, finance: true } },
        { key: 'products.edit', baseline: { admin: true, manager: true } },
      ],
    },
  ];

  // Build initial state from baseline (object keyed by `${roleId}:${permKey}` -> bool)
  const initial = React.useMemo(() => {
    const o = {};
    for (const g of groups) for (const p of g.perms)
      for (const r of roles) o[`${r.id}:${p.key}`] = !!p.baseline[r.id];
    return o;
  }, []);

  const [state, setState] = React.useState(initial);
  const [filter, setFilter] = React.useState('');

  // Pre-seed with the 3 mock changes shown in the reference (Picker: order.view, products.view; Driver: logistics.edit)
  React.useEffect(() => {
    setState(s => ({
      ...s,
      'picker:order.view': true,
      'picker:products.view': true,
      'driver:logistics.edit': true,
    }));
  }, []);

  const toggle = (roleId, key) => {
    const k = `${roleId}:${key}`;
    setState(s => ({ ...s, [k]: !s[k] }));
  };

  const isDirty = (roleId, key) => state[`${roleId}:${key}`] !== initial[`${roleId}:${key}`];
  const dirtyKeys = Object.keys(state).filter(k => state[k] !== initial[k]);

  // Build summary string for the sticky bar
  const summary = React.useMemo(() => {
    const byRole = {};
    for (const k of dirtyKeys) {
      const [rid, perm] = k.split(':');
      const role = roles.find(r => r.id === rid);
      const sign = state[k] ? '+' : '-';
      (byRole[role.label] = byRole[role.label] || []).push(`${sign}${perm}`);
    }
    return Object.entries(byRole).map(([r, items]) => `${r}: ${items.join(', ')}`).join(' | ');
  }, [dirtyKeys.join(',')]);

  const filteredGroups = groups
    .map(g => ({ ...g, perms: g.perms.filter(p => !filter || p.key.toLowerCase().includes(filter.toLowerCase()) || g.label.toLowerCase().includes(filter.toLowerCase())) }))
    .filter(g => g.perms.length > 0);

  const reset = () => setState(initial);
  const [showModal, setShowModal] = React.useState(false);
  const save  = () => setShowModal(true);
  const confirmSave = () => { setShowModal(false); /* mock persist */ };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }} data-screen-label="permissions">
      <div style={{ padding: '24px 28px 100px', display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Edit Permission Matrix</div>
              {dirtyKeys.length > 0 && (
                <span style={{ background: '#FEF9C3', color: '#854D0E', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, }}>Editing</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>Toggle permissions on or off per role. Changes are highlighted and require confirmation before saving.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#8896A4' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i data-lucide="clock" style={{ width: 13, height: 13 }} />
              <span>Last saved: 04 Apr 2026, 09:15</span>
            </span>
            {onBack && (
              <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5F6B7A', fontSize: 13, fontWeight: 500, fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="arrow-left" style={{ width: 14, height: 14 }} /> Back to Roles
              </button>
            )}
          </div>
        </div>

        {/* Unsaved changes banner */}
        {dirtyKeys.length > 0 && (
          <div style={{ background: '#FEFCE8', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <i data-lucide="alert-triangle" style={{ width: 18, height: 18, color: '#B45309', marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#854D0E' }}>{dirtyKeys.length} unsaved change{dirtyKeys.length === 1 ? '' : 's'}</div>
                <div style={{ fontSize: 12, color: '#854D0E', opacity: .85, marginTop: 2 }}>{summary}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={reset} style={{ ...btnSecondary, padding: '8px 14px' }}>Discard</button>
              <button onClick={save} style={{ ...btnPrimary, padding: '8px 14px' }}>
                <i data-lucide="check" style={{ width: 14, height: 14 }} /> Review &amp; Save
              </button>
            </div>
          </div>
        )}

        {/* Matrix card */}
        <Card padding={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid #E8EBE9' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Permission Matrix</div>
              <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 2 }}>Toggle switches to grant or deny permissions per role</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8, minWidth: 200 }}>
              <i data-lucide="search" style={{ width: 13, height: 13, color: '#9CA3AF' }} />
              <input
                placeholder="Filter modules…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Inter', color: '#1F2937', width: '100%', background: 'transparent' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13, minWidth: 920 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E8EBE9' }}>
                  <th style={{ ...thBase, textAlign: 'left', minWidth: 240 }}>Module / Permission</th>
                  {roles.map(r => (
                    <th key={r.id} style={{ ...thBase, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{r.label}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: r.kind === 'Custom' ? '#6D28D9' : '#9CA3AF', marginTop: 2 }}>{r.kind}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((g, gi) => (
                  <React.Fragment key={gi}>
                    <tr>
                      <td colSpan={1 + roles.length} style={{ padding: '14px 22px 6px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', background: '#FAFBFC', borderTop: gi === 0 ? 'none' : '1px solid #F0F2F5' }}>
                        {g.label}
                      </td>
                    </tr>
                    {g.perms.map((p, pi) => (
                      <tr key={pi} style={{ borderTop: '1px solid #F4F5F6' }}>
                        <td style={{ padding: '12px 22px', fontFamily: 'Menlo, monospace', fontSize: 12.5, color: '#374151' }}>{p.key}</td>
                        {roles.map(r => {
                          const dirty = isDirty(r.id, p.key);
                          const on    = state[`${r.id}:${p.key}`];
                          return (
                            <td key={r.id} style={{ padding: '8px', textAlign: 'center', background: dirty ? '#FFF1EE' : 'transparent', position: 'relative' }}>
                              <Toggle on={on} onClick={() => toggle(r.id, p.key)} />
                              {dirty && <div style={{ fontSize: 9, fontWeight: 700, color: '#B91C1C', marginTop: 2, }}>Changed</div>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Sticky save bar */}
      {dirtyKeys.length > 0 && (
        <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E8EBE9', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 -4px 12px rgba(0,0,0,.04)', fontFamily: 'Inter' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FEF9C3', color: '#854D0E', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dirtyKeys.length}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1729' }}>{dirtyKeys.length} permission change{dirtyKeys.length === 1 ? '' : 's'} pending</div>
              <div style={{ fontSize: 11.5, color: '#5F6B7A', marginTop: 2 }}>{summary}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={reset} style={{ ...btnSecondary, padding: '9px 16px' }}>
              <i data-lucide="x" style={{ width: 14, height: 14 }} /> Discard All
            </button>
            <button onClick={save} style={{ ...btnPrimary, padding: '9px 18px' }}>
              <i data-lucide="check" style={{ width: 14, height: 14 }} /> Review &amp; Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {showModal && (
        <ConfirmPermissionsModal
          dirtyKeys={dirtyKeys}
          state={state}
          initial={initial}
          roles={roles}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmSave}
        />
      )}
    </div>
  );
}

function ConfirmPermissionsModal({ dirtyKeys, state, initial, roles, onCancel, onConfirm }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    if (window.lucide) window.lucide.createIcons();
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const roleColor = {
    admin:      { bg: '#EEF6F2', fg: '#117E44' },
    manager:    { bg: '#EFF6FF', fg: '#1D4ED8' },
    picker:     { bg: '#FEF2F2', fg: '#B91C1C' },
    driver:     { bg: '#F5F3FF', fg: '#6D28D9' },
    finance:    { bg: '#ECFDF5', fg: '#0E7C5A' },
    supervisor: { bg: '#FEF2F2', fg: '#B91C1C' },
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 41, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, fontFamily: 'Inter',
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, maxHeight: '85vh', background: '#fff', borderRadius: 14,
        boxShadow: '0 24px 60px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 22px', borderBottom: '1px solid #F0F2F5' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEF6F2', color: '#1B8C4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i data-lucide="shield-check" style={{ width: 18, height: 18 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1729' }}>Confirm Permission Changes</div>
            <div style={{ fontSize: 12.5, color: '#5F6B7A', marginTop: 2 }}>Review all changes before they take effect</div>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <i data-lucide="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Warning banner */}
        <div style={{ margin: '18px 22px 0', background: '#FEFCE8', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
          <i data-lucide="alert-triangle" style={{ width: 16, height: 16, color: '#B45309', marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 12.5, color: '#854D0E', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>Permission changes take effect on next login.</span> Users with active sessions will retain current permissions until they log out and log back in.
          </div>
        </div>

        {/* List of changes */}
        <div style={{ padding: '16px 22px 8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#5F6B7A', marginBottom: 10 }}>{dirtyKeys.length} change{dirtyKeys.length === 1 ? '' : 's'} in this batch:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dirtyKeys.map(k => {
              const [rid, perm] = k.split(':');
              const role = roles.find(r => r.id === rid);
              const before = initial[k];
              const after  = state[k];
              const tone = roleColor[rid] || roleColor.admin;
              return (
                <div key={k} style={{ border: '1px solid #E8EBE9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ background: tone.bg, color: tone.fg, fontWeight: 700, fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>{role.label}</span>
                    <i data-lucide="arrow-right" style={{ width: 14, height: 14, color: '#9CA3AF' }} />
                    <span style={{ fontFamily: 'Menlo, monospace', fontSize: 12.5, color: '#1F2937' }}>{perm}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12 }}>
                    <span style={{ color: '#9CA3AF' }}>Before:</span>
                    <PermPill granted={before} />
                    <i data-lucide="arrow-right" style={{ width: 13, height: 13, color: '#D0D5DD' }} />
                    <span style={{ color: '#9CA3AF', marginLeft: 4 }}>After:</span>
                    <PermPill granted={after} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit trail note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 22px 18px', fontSize: 11.5, color: '#8896A4' }}>
          <i data-lucide="file-text" style={{ width: 13, height: 13, marginTop: 1 }} />
          <span>Each change will be individually logged to the audit trail with your Admin ID and timestamp.</span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 22px', borderTop: '1px solid #F0F2F5', background: '#FAFBFC' }}>
          <button onClick={onCancel} style={{ ...btnSecondary, padding: '9px 18px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ ...btnPrimary, padding: '9px 18px' }}>
            <i data-lucide="check" style={{ width: 14, height: 14 }} /> Confirm &amp; Save {dirtyKeys.length} Change{dirtyKeys.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermPill({ granted }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
      borderRadius: 9999, fontSize: 12, fontWeight: 600,
      background: granted ? '#EEF6F2' : '#FEE2E2',
      color:      granted ? '#117E44' : '#B91C1C',
    }}>{granted ? 'Granted' : 'Denied'}</span>
  );
}

const thBase = {
  padding: '14px 14px',
  fontSize: 11,
  fontWeight: 700,
  color: '#374151',
  borderBottom: '1px solid #E8EBE9',
};

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 38, height: 22, borderRadius: 9999,
      background: on ? '#1B8C4E' : '#E5E7EB',
      border: 'none', cursor: 'pointer', position: 'relative',
      padding: 0, transition: 'background .15s ease',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,.2)', transition: 'left .15s ease',
      }} />
    </button>
  );
}

window.Permissions = Permissions;
