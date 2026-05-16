// Top header — page title + actions + search
function Header({ title, subtitle, actions }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', borderBottom: '1px solid #E8EBE9', background: '#fff',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0F1729' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
          background: '#F9FAFB', border: '1px solid #E8EBE9', borderRadius: 8,
          minWidth: 280, fontSize: 13, color: '#8896A4',
        }}>
          <i data-lucide="search" style={{ width: 14, height: 14 }} />
          <span>Search suppliers, orders, lots…</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'Menlo,monospace', fontSize: 11, color: '#B0B7BE' }}>⌘K</span>
        </div>
        <button style={btnGhost}><i data-lucide="bell" style={{ width: 16, height: 16 }} /></button>
        {actions}
      </div>
    </header>
  );
}

const btnPrimary = {
  background: '#1B8C4E', color: '#fff', border: 'none', borderRadius: 8,
  height: 40, padding: '0 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter',
  boxShadow: '0 1px 2px rgba(0,0,0,.05)', boxSizing: 'border-box',
};
const btnSecondary = {
  background: '#fff', color: '#1F2937', border: '1px solid #E8EBE9', borderRadius: 8,
  height: 40, padding: '0 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter',
  boxSizing: 'border-box',
};
const btnGhost = {
  background: 'transparent', color: '#5F6B7A', border: '1px solid transparent',
  height: 40, padding: '0 10px', borderRadius: 8, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  boxSizing: 'border-box',
};

window.Header = Header;
window.btnPrimary = btnPrimary;
window.btnSecondary = btnSecondary;
window.btnGhost = btnGhost;
