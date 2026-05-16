// SlideOverForm — reusable right-side panel for multi-field forms.
// Used by Add User; also exported for future flows (Add Supplier, etc).
//
// Sections (rendered children) follow this pattern:
//   <FormSection label="Personal Information">
//     <FormField label="First name" required><input … /></FormField>
//     ...
//   </FormSection>

function SlideOverForm({
  open, onClose, title, headerExtra,
  primaryLabel = 'Save', primaryIcon = 'check',
  onPrimary, children,
}) {
  React.useEffect(() => {
    if (!open) return;
    if (window.lucide) window.lucide.createIcons();
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 41, 0.45)',
        display: 'flex', justifyContent: 'flex-end', zIndex: 200,
        fontFamily: 'Inter',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 480, maxWidth: '100vw', height: '100%',
          background: '#fff', borderLeft: '1px solid #E8EBE9',
          boxShadow: '-12px 0 32px rgba(15,23,41,.18)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          height: 56, padding: '0 24px', borderBottom: '1px solid #E8EBE9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1729' }}>{title}</div>
            {headerExtra}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 6, display: 'inline-flex',
            color: '#5F6B7A',
          }} aria-label="Close">
            <i data-lucide="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #E8EBE9',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          flexShrink: 0, background: '#fff',
        }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={onPrimary} style={btnPrimary}>
            <i data-lucide={primaryIcon} style={{ width: 14, height: 14 }} />
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ label, extra, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#9CA3AF' }}>{label}</div>
        {extra}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}

function FormField({ label, required, hint, children, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 4 }}>*</span>}
      </span>
      {children}
      {hint && <span style={{ fontSize: 12, color: '#8896A4' }}>{hint}</span>}
    </label>
  );
}

const formInputStyle = {
  height: 40, padding: '0 14px', boxSizing: 'border-box',
  border: '1px solid #E8EBE9', borderRadius: 8,
  fontSize: 14, fontFamily: 'Inter', color: '#1F2937',
  outline: 'none', width: '100%',
};

function FormInfoBox({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: 12,
      background: '#F3FAF6', border: '1px solid #C8ECDA', borderRadius: 8,
    }}>
      <i data-lucide="info" style={{ width: 16, height: 16, color: '#1B8C4E', flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 12, color: '#117E44', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// Add User form — uses SlideOverForm
function AddUserForm({ open, onClose, onCreate }) {
  const [role, setRole] = React.useState('');
  const [warehouse, setWarehouse] = React.useState('All warehouses (default)');
  return (
    <SlideOverForm
      open={open} onClose={onClose}
      title="Create New User"
      primaryLabel="Create User" primaryIcon="plus"
      onPrimary={onCreate}
    >
      <FormSection label="Personal Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="First name" required>
            <input style={formInputStyle} placeholder="e.g. Jean" />
          </FormField>
          <FormField label="Last name" required>
            <input style={formInputStyle} placeholder="e.g. Uwimana" />
          </FormField>
        </div>
        <FormField label="Email address" required hint="An activation link will be sent to this address.">
          <input style={formInputStyle} type="email" placeholder="user@agriflow.rw" />
        </FormField>
        <FormField label="Phone number">
          <div style={{
            display: 'flex', alignItems: 'center', height: 40,
            border: '1px solid #E8EBE9', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: '100%', borderRight: '1px solid #E8EBE9', fontSize: 14, color: '#1F2937', background: '#F9FAFB' }}>
              <span>🇷🇼</span>
              <span style={{ fontWeight: 600 }}>+250</span>
              <i data-lucide="chevron-down" style={{ width: 12, height: 12, color: '#9CA3AF' }} />
            </div>
            <input style={{ ...formInputStyle, border: 'none', borderRadius: 0, flex: 1 }} type="tel" placeholder="788 123 456" />
          </div>
        </FormField>
      </FormSection>

      <FormSection label="Role & Access">
        <FormField label="Assigned role" required hint="Determines which modules and actions this user can access.">
          <Select value={role} onChange={setRole} placeholder="Select a role…" style={{ width: '100%' }}
            options={['Admin', 'Manager', 'Warehouse Picker', 'Driver', 'Finance Officer']} />
        </FormField>
        <FormField label="Warehouse assignment">
          <Select value={warehouse} onChange={setWarehouse} style={{ width: '100%' }}
            options={['All warehouses (default)', 'Kigali Main Warehouse', 'Kigali Cold Storage', 'Huye Distribution Center']} />
        </FormField>
      </FormSection>

      <FormSection label="Notification">
        <CheckRow defaultChecked label="Send activation email" hint="User will receive a secure link to set their password and activate their account." />
        <CheckRow label="Send SMS notification" hint="Additionally notify via SMS (requires phone number)." />
      </FormSection>

      <FormInfoBox>
        New users are created with <b>inactive</b> status. They must complete the activation flow before gaining platform access. This action will be recorded in the audit log.
      </FormInfoBox>
    </SlideOverForm>
  );
}

function CheckRow({ label, hint, defaultChecked }) {
  return (
    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
      <input type="checkbox" defaultChecked={defaultChecked} style={{
        marginTop: 2, width: 16, height: 16, accentColor: '#1B8C4E', cursor: 'pointer',
      }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: '#8896A4', marginTop: 2, lineHeight: 1.45 }}>{hint}</div>}
      </div>
    </label>
  );
}

window.SlideOverForm = SlideOverForm;
window.FormSection = FormSection;
window.FormField = FormField;
window.FormInfoBox = FormInfoBox;
window.formInputStyle = formInputStyle;
window.AddUserForm = AddUserForm;

// Edit User form — pre-filled, exposes role/access/notifications + status pill in header
function EditUserForm({ open, user, onClose, onSave }) {
  const [role, setRole] = React.useState(user ? user.role[0] : '');
  const [warehouse, setWarehouse] = React.useState('All warehouses (default)');
  React.useEffect(() => { if (user) { setRole(user.role[0]); setWarehouse('All warehouses (default)'); } }, [user]);
  if (!open || !user) return null;

  // derive first/last from name for the pre-fill
  const parts = (user.name || '').split(' ');
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';

  // phone — strip "+250 " from leading
  const phoneLocal = (user.phone || '').replace(/^\+250\s*/, '');

  const statusTone = user.status === 'Active'  ? { bg: '#EEF6F2', fg: '#117E44', dot: '#1B8C4E' }
                   : user.status === 'Pending' ? { bg: '#FEF9C3', fg: '#854D0E', dot: '#CA8A04' }
                   :                              { bg: '#FEE2E2', fg: '#B91C1C', dot: '#DC2626' };

  const statusPill = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 9999,
      fontSize: 11.5, fontWeight: 600,
      background: statusTone.bg, color: statusTone.fg,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusTone.dot }} />
      {user.status}
    </span>
  );

  return (
    <SlideOverForm
      open={open} onClose={onClose}
      title="Edit User"
      headerExtra={statusPill}
      primaryLabel="Update User" primaryIcon="check"
      onPrimary={onSave}
    >
      {/* User identity header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingBottom: 18, borderBottom: '1px solid #F0F2F5',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 26,
          background: user.avatar, color: '#fff',
          fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{user.initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1729' }}>{user.name}</div>
          <div style={{ fontSize: 12.5, color: '#5F6B7A', marginTop: 2 }}>{user.email}</div>
          <div style={{ fontSize: 12, color: '#8896A4', marginTop: 2 }}>Member since {user.date}</div>
        </div>
      </div>

      <FormSection label="Personal Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="First name" required>
            <input style={formInputStyle} defaultValue={firstName} />
          </FormField>
          <FormField label="Last name" required>
            <input style={formInputStyle} defaultValue={lastName} />
          </FormField>
        </div>
        <FormField label="Email address" required hint="Changing the email will require re-verification.">
          <input style={formInputStyle} type="email" defaultValue={user.email} />
        </FormField>
        <FormField label="Phone number">
          <div style={{
            display: 'flex', alignItems: 'center', height: 40,
            border: '1px solid #E8EBE9', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: '100%', borderRight: '1px solid #E8EBE9', fontSize: 14, color: '#1F2937', background: '#F9FAFB' }}>
              <span>🇷🇼</span>
              <span style={{ fontWeight: 600 }}>+250</span>
              <i data-lucide="chevron-down" style={{ width: 12, height: 12, color: '#9CA3AF' }} />
            </div>
            <input style={{ ...formInputStyle, border: 'none', borderRadius: 0, flex: 1 }} type="tel" defaultValue={phoneLocal} />
          </div>
        </FormField>
      </FormSection>

      <FormSection label="Role & Access">
        <FormField label="Assigned role" required hint="Determines which modules and actions this user can access.">
          <Select value={role} onChange={setRole} style={{ width: '100%' }}
            options={['Admin', 'Manager', 'Warehouse Picker', 'Driver', 'Finance']} />
        </FormField>

        {/* Manage Permissions inline callout */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, borderRadius: 10,
          background: '#F9FAFB', border: '1px solid #E8EBE9',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: '#EEF6F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i data-lucide="shield-check" style={{ width: 16, height: 16, color: '#1B8C4E' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Need granular control?</div>
            <div style={{ fontSize: 11.5, color: '#5F6B7A', marginTop: 2, lineHeight: 1.45 }}>
              Override specific permissions beyond role defaults.
            </div>
          </div>
          <button style={{
            ...btnSecondary, height: 32, padding: '0 12px', fontSize: 12, whiteSpace: 'nowrap',
          }}>
            <i data-lucide="pencil" style={{ width: 12, height: 12 }} />
            Manage
          </button>
        </div>

        <FormField label="Warehouse assignment">
          <Select value={warehouse} onChange={setWarehouse} style={{ width: '100%' }}
            options={['All warehouses (default)', 'Kigali Main Warehouse', 'Kigali Cold Storage', 'Huye Distribution Center']} />
        </FormField>
      </FormSection>

      <FormSection label="Notification Preferences">
        <CheckRow defaultChecked label="Email notifications" hint="Receive system alerts and updates via email." />
        <CheckRow defaultChecked label="SMS notifications" hint={`Receive critical alerts via SMS to ${user.phone}.`} />
      </FormSection>

      <FormInfoBox>
        Changes to user profile take effect immediately. Role changes update access permissions across all modules. This action will be recorded in the audit log.
      </FormInfoBox>
    </SlideOverForm>
  );
}

window.EditUserForm = EditUserForm;

// Register Supplier form — uses SlideOverForm
// Mirrors the field structure from e2-partners-supplier-ecosystem/e2-supplier-registration.html
function RegisterSupplierForm({ open, onClose, onCreate }) {
  const [district, setDistrict]   = React.useState('');
  const [stype, setStype]         = React.useState('Cooperative');
  const [bank, setBank]           = React.useState('Bank of Kigali');

  const encryptedBadge = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 4,
      fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
      background: '#EEF6F2', color: '#1B8C4E',
    }}>
      <i data-lucide="lock" style={{ width: 11, height: 11 }} />
      ENCRYPTED
    </span>
  );

  return (
    <SlideOverForm
      open={open} onClose={onClose}
      title="Register New Supplier"
      primaryLabel="Register Supplier" primaryIcon="plus"
      onPrimary={onCreate}
    >
      <div style={{ fontSize: 13, color: '#5F6B7A', lineHeight: 1.55, marginTop: -4 }}>
        Enter supplier company details, primary contact, and banking information. RICA certification can be uploaded after registration.
      </div>

      <FormSection label="Company Information">
        <FormField label="Company name" required>
          <input style={formInputStyle} placeholder="e.g. Uwimana Farms Ltd" />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Location" required>
            <Select value={district} onChange={setDistrict} placeholder="Select district…" style={{ width: '100%' }}
              options={['Kigali', 'Musanze', 'Huye', 'Rubavu', 'Rusizi', 'Nyabihu', 'Rwamagana', 'Kayonza']} />
          </FormField>
          <FormField label="Supplier type">
            <Select value={stype} onChange={setStype} style={{ width: '100%' }}
              options={['Cooperative', 'Individual Farm', 'Aggregator', 'Processor']} />
          </FormField>
        </div>
      </FormSection>

      <FormSection label="Primary Contact">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Contact person" required>
            <input style={formInputStyle} placeholder="e.g. Jean-Pierre Uwimana" />
          </FormField>
          <FormField label="Role">
            <input style={formInputStyle} placeholder="e.g. Owner / Manager" />
          </FormField>
        </div>
        <FormField label="Phone" required>
          <div style={{
            display: 'flex', alignItems: 'center', height: 40,
            border: '1px solid #E8EBE9', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: '100%', borderRight: '1px solid #E8EBE9', fontSize: 14, color: '#1F2937', background: '#F9FAFB' }}>
              <span>🇷🇼</span>
              <span style={{ fontWeight: 600 }}>+250</span>
              <i data-lucide="chevron-down" style={{ width: 12, height: 12, color: '#9CA3AF' }} />
            </div>
            <input style={{ ...formInputStyle, border: 'none', borderRadius: 0, flex: 1 }} type="tel" placeholder="788 123 456" />
          </div>
        </FormField>
        <FormField label="Email address" hint="Optional — used for purchase order confirmations and remittance notices.">
          <input style={formInputStyle} type="email" placeholder="jp@uwimanafarms.rw" />
        </FormField>
      </FormSection>

      <FormSection label="Bank Details" extra={encryptedBadge}>
        <FormField label="Bank">
          <Select value={bank} onChange={setBank} style={{ width: '100%' }}
            options={[
              'Bank of Kigali',
              'BPR (Banque Populaire du Rwanda)',
              'Equity Bank Rwanda',
              'Ecobank Rwanda',
              'Cogebanque',
              'I&M Bank Rwanda',
              'KCB Rwanda',
            ]} />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Account number">
            <input style={{ ...formInputStyle, fontFamily: 'Menlo, monospace' }} placeholder="00040123456789" />
          </FormField>
          <FormField label="Account holder">
            <input style={formInputStyle} placeholder="e.g. Uwimana Farms Ltd" />
          </FormField>
        </div>
        <FormField label="Mobile Money (MTN / Airtel)">
          <div style={{
            display: 'flex', alignItems: 'center', height: 40,
            border: '1px solid #E8EBE9', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: '100%', borderRight: '1px solid #E8EBE9', fontSize: 14, color: '#1F2937', background: '#F9FAFB' }}>
              <span>🇷🇼</span>
              <span style={{ fontWeight: 600 }}>+250</span>
              <i data-lucide="chevron-down" style={{ width: 12, height: 12, color: '#9CA3AF' }} />
            </div>
            <input style={{ ...formInputStyle, border: 'none', borderRadius: 0, flex: 1, fontFamily: 'Menlo, monospace' }} type="tel" placeholder="78* *** *56" />
          </div>
        </FormField>
      </FormSection>

      <FormSection label="RICA Certification (optional)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Certificate number">
            <input style={formInputStyle} placeholder="RICA-2024-XXXXX" />
          </FormField>
          <FormField label="Expiry date">
            <input style={formInputStyle} type="date" />
          </FormField>
        </div>
        <div style={{
          border: '1px dashed #E8EBE9', borderRadius: 10,
          padding: 24, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center',
        }}>
          <i data-lucide="upload-cloud" style={{ width: 26, height: 26, color: '#8896A4' }} />
          <div style={{ fontSize: 13, color: '#1F2937' }}>
            <span style={{ color: '#1B8C4E', fontWeight: 600 }}>Click to upload</span> or drag and drop
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>PDF up to 10 MB</div>
        </div>
      </FormSection>

      <FormInfoBox>
        The new supplier will be created in <b>Pending</b> status. Their profile becomes Active after RICA verification and the first product mapping is confirmed.
      </FormInfoBox>
    </SlideOverForm>
  );
}

window.RegisterSupplierForm = RegisterSupplierForm;
