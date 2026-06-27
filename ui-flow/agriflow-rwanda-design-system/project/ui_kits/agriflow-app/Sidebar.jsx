// AgriFlow Sidebar — fixed left nav, 270px collapsible
// Source: /Page-1/Design-System/SidebarFleetFlowSidebarTailwindShadcn

// Canonical nav structure — mirrors flow-design.html (the true AgriFlow sidebar, founder-ruled 2026-06-28).
const navMain = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', children: ['Executive', 'Operations', 'Sales', 'Inventory', 'Logistics'] },
  { id: 'orders', label: 'Orders', icon: 'shopping-cart', badge: 12 },
  { id: 'products', label: 'Products', icon: 'package' },
  { id: 'partners', label: 'Partners', icon: 'users', children: ['List', 'Stores', 'Operations', 'Performance'] },
  { id: 'suppliers', label: 'Suppliers', icon: 'truck', children: ['List', 'Purchase', 'Schedule', 'History', 'Performance'] },
];
const navOps = [
  { id: 'inventory', label: 'Inventory', icon: 'boxes', children: ['Stock', 'Intake', 'Expiry & Waste', 'Storage'] },
  { id: 'logistics', label: 'Logistics', icon: 'warehouse', children: ['Planning', 'Execution', 'Fleet'] },
  { id: 'users', label: 'Users', icon: 'user-cog', children: ['All Users', 'Roles & Permissions'] },
];
const navAnalytics = [
  { id: 'finance', label: 'Finance', icon: 'bar-chart-3', children: ['Revenue', 'Payments', 'Reports'] },
  { id: 'reports', label: 'Reports', icon: 'file-text', children: ['Sales', 'Inventory', 'Waste'] },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

// D-016 APPROVED + APPLIED 2026-06-28 — flow-design.html is the canonical AgriFlow sidebar.
//   The 3 routes are now INCLUDED: partners/operations (Partners > Operations),
//   suppliers/schedule (Suppliers > Schedule), suppliers/history (Suppliers > History).
//   Ref: reports/decisions/closed/2026-06-27_D-016_sidebar-routes-in-scope.md

function Icon({ name, size = 18 }) {
  // Lucide via CDN <i data-lucide=...>
  return <i data-lucide={name} style={{ width: size, height: size, display: 'inline-block' }} />;
}

function NavItem({ item, active, onClick }) {
  const isActive = active === item.id;
  return (
    <div
      onClick={() => onClick(item.id)}
      style={{
        height: 40, padding: '0 12px', borderRadius: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        background: isActive ? '#F3FAF6' : 'transparent',
        color: isActive ? '#1B8C4E' : '#5F6B7A',
        fontWeight: isActive ? 700 : 500,
        fontSize: 13.5, transition: 'background .15s ease, color .15s ease',
      }}
      onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#F9FAFB')}
      onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
    >
      <Icon name={item.icon} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          background: '#E74C3C', color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '1px 7px', borderRadius: 9999,
        }}>{item.badge}</span>
      )}
      {item.children && <Icon name="chevron-down" size={14} />}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '16px 20px 6px', fontSize: 10, fontWeight: 700,
      letterSpacing: 1.2, textTransform: 'uppercase', color: '#B0B7BE',
    }}>{children}</div>
  );
}

// Submenu container (Inventory / Logistics / Users children).
// Active leaf style is LOCKED: background '#F3FAF6' (bg-accent) + color '#1B8C4E' (text-primary),
// fontWeight 600. NEVER background '#1B8C4E' + color '#fff' (forbidden bg-primary text-primary-foreground).
function SubMenu({ items, active, setActive }) {
  return (
    <div style={{ marginLeft: 12, paddingLeft: 12, borderLeft: '1px solid #F0F0F0', marginTop: 2 }}>
      {items.map((c, i) => {
        const isOn = active === c.id;
        return (
          <div key={i} onClick={() => setActive(c.id)} style={{
            height: 30, fontSize: 12.5,
            color: isOn ? '#1B8C4E' : '#5F6B7A',
            background: isOn ? '#F3FAF6' : 'transparent',
            fontWeight: isOn ? 600 : 500, padding: '0 12px',
            display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 6,
            marginBottom: 2, transition: 'background .15s ease, color .15s ease',
          }}
          onMouseEnter={e => !isOn && (e.currentTarget.style.background = '#F9FAFB')}
          onMouseLeave={e => !isOn && (e.currentTarget.style.background = 'transparent')}
          >{c.label}</div>
        );
      })}
    </div>
  );
}

function Sidebar({ active = 'dashboard', setActive, onSignOut }) {
  return (
    <aside style={{
      width: 270, height: '100vh', background: '#fff',
      borderRight: '1px solid #E8EBE9', display: 'flex', flexDirection: 'column',
      boxShadow: '1px 0 4px rgba(0,0,0,.04), 4px 0 16px rgba(0,0,0,.08)',
      fontFamily: 'Inter, sans-serif', position: 'relative',
    }}>
      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: '#1B8C4E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 4, boxSizing: 'border-box',
        }}>
          <img src="../../assets/logo/leaf-rotated-white.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1B8C4E', letterSpacing: -0.3 }}>AgriFlow</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        {[['Main', navMain], ['Operations', navOps], ['Analytics', navAnalytics]].map(([label, items], si) => (
          <React.Fragment key={label}>
            {si > 0 && <div style={{ height: 1, background: '#F0F0F0', margin: '16px 16px' }} />}
            <SectionLabel>{label}</SectionLabel>
            {items.map(it => (
              <React.Fragment key={it.id}>
                <NavItem item={it} active={active} onClick={setActive} />
                {it.children && active === it.id && (
                  <div style={{ marginLeft: 12, paddingLeft: 12, borderLeft: '1px solid #F0F0F0', marginTop: 2 }}>
                    {it.children.map((c, i) => (
                      <div key={i} style={{
                        height: 30, fontSize: 12.5,
                        color: i === 0 ? '#1B8C4E' : '#5F6B7A',
                        background: i === 0 ? '#F3FAF6' : 'transparent',
                        fontWeight: i === 0 ? 600 : 500, padding: '0 12px',
                        display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 6, marginBottom: 2,
                      }}>{c}</div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* help card */}
      <div style={{ margin: '12px 14px', padding: 14, background: '#F3FAF6', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16, background: '#1B8C4E', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="life-buoy" size={16} /></div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#1B8C4E' }}>Need help?</div>
          <div style={{ fontSize: 11, color: '#6B9E80' }}>Go to Help Center →</div>
        </div>
      </div>

      {/* user — click avatar to sign out (returns to Login screen) */}
      <button
        onClick={onSignOut}
        title="Sign out"
        aria-label="Sign out"
        style={{
          borderTop: '1px solid #F0F0F0', padding: '14px 16px',
          display: 'flex', gap: 10, alignItems: 'center', width: '100%',
          background: 'transparent', border: 'none', borderTopColor: '#F0F0F0',
          cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter',
          transition: 'background .12s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F3FAF6'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1B8C4E', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>SJ</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>Sarah Johnson</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>Operations Manager</div>
        </div>
        <Icon name="log-out" size={16} />
      </button>
    </aside>
  );
}

window.Sidebar = Sidebar;
