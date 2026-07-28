// Unified Product Catalog (Epic 3) — visual-review mirror of the promoted screens:
//   ../../screens/product-catalog.html, create-product.html, edit-product.html,
//   category-management.html, retail-pricing.html
// One-way HTML->JSX sync (design-builder sync-kit Phase 6.5). Visual only — not a contract.
// Mirrors the Suppliers.jsx pattern: stat row, filter card, table, row-actions menu,
// slide-over form, confirm modal. A segmented control switches the three E3 sub-screens.

function Products() {
  const [view, setView] = React.useState('catalog'); // 'catalog' | 'categories' | 'pricing'

  const tabs = [
    { id: 'catalog',    label: 'Catalog',        icon: 'package' },
    { id: 'categories', label: 'Categories',     icon: 'folder-tree' },
    { id: 'pricing',    label: 'Retail Pricing', icon: 'tag' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter' }} data-screen-label="products">
      {/* Sub-screen segmented control */}
      <div style={{ display: 'inline-flex', alignSelf: 'flex-start', gap: 2, padding: 3, background: '#fff', border: '1px solid #E8EBE9', borderRadius: 10 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter',
              fontSize: 13, fontWeight: 600,
              background: view === t.id ? '#1B8C4E' : 'transparent',
              color: view === t.id ? '#fff' : '#5F6B7A',
            }}
          >
            <i data-lucide={t.icon} style={{ width: 14, height: 14 }} /> {t.label}
          </button>
        ))}
      </div>

      {view === 'catalog'    && <ProductCatalog />}
      {view === 'categories' && <CategoryManagement />}
      {view === 'pricing'    && <RetailPricing />}
    </div>
  );
}

window.Products = Products;

// ── Sub-screen 1: Product Catalog ─────────────────────────────────────────────
function ProductCatalog() {
  const stats = [
    { label: 'Total SKUs',            value: '42', sub: '+4 this month',            subTone: 'success', icon: 'package' },
    { label: 'Cold-Chain SKUs',       value: '12', sub: 'In FDA temperature-log scope', icon: 'thermometer-snowflake' },
    { label: 'Ethylene Producers',    value: '5',  sub: 'Need zone separation', subTone: 'warning', icon: 'wind' },
    { label: 'Missing Classification',value: '3',  sub: 'No temp zone set',     subTone: 'danger',  icon: 'alert-triangle' },
  ];

  // storage tone: ambient/dry neutral, cold chain info, frozen info-strong
  const products = [
    { name: 'Rwandan Round Tomato (Ripe)', sku: 'TOM-RND-001', category: 'Vegetables',        storage: 'Ambient',    zone: '—',        shelf: '7 days',   unit: 'kg',  status: 'Active', price: '600 RWF' },
    { name: 'Cavendish Banana (Green)',    sku: 'BAN-CAV-002', category: 'Fruits',            storage: 'Ambient',    zone: '—',        shelf: '21 days',  unit: 'kg',  status: 'Active', price: '850 RWF', ethylene: true },
    { name: 'Hass Avocado (Unripe)',       sku: 'AVO-HAS-003', category: 'Fruits',            storage: 'Cold Chain', zone: '5–8 °C',   shelf: '21 days',  unit: 'piece', status: 'Active', price: '2,400 RWF', sensitive: true },
    { name: 'Carrot (Topped)',             sku: 'CAR-TOP-004', category: 'Roots & Tubers',    storage: 'Cold Chain', zone: '0–4 °C',   shelf: '60 days',  unit: 'kg',  status: 'Active', price: '450 RWF' },
    { name: 'Maize Grain',                 sku: 'MAZ-GRN-005', category: 'Grains & Legumes',  storage: 'Dry',        zone: '—',        shelf: '365 days', unit: 'kg',  status: 'Active', price: '700 RWF' },
    { name: 'Frozen Green Beans',          sku: 'BEA-FRZ-006', category: 'Vegetables',        storage: 'Frozen',     zone: '-18 °C',   shelf: '365 days', unit: 'kg',  status: 'Active', price: '1,200 RWF' },
  ];

  const [statusFilter, setStatusFilter]   = React.useState('All Statuses');
  const [storageFilter, setStorageFilter] = React.useState('All Storage Types');
  const [categoryFilter, setCategoryFilter] = React.useState('All Categories');
  const [openRow, setOpenRow] = React.useState(null);
  const [formMode, setFormMode] = React.useState(null); // null | 'create' | 'edit'
  const [formProduct, setFormProduct] = React.useState(null);
  const [deactivate, setDeactivate] = React.useState(null);

  React.useEffect(() => {
    const onClick = () => setOpenRow(null);
    if (openRow !== null) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openRow]);

  const storageTone = { 'Ambient': 'neutral', 'Dry': 'neutral', 'Cold Chain': 'info', 'Frozen': 'info' };

  return (
    <React.Fragment>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Product Catalog</div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>The single source of truth for every SKU, its storage class and shelf life</div>
        </div>
        <button
          onClick={() => { setFormProduct(null); setFormMode('create'); }}
          style={{ ...btnPrimary, padding: '10px 18px', borderRadius: 999 }}
        >
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Add Product
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} padding={18}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5F6B7A' }}>{s.label}</div>
              <i data-lucide={s.icon} style={{ width: 16, height: 16, color: s.subTone === 'danger' ? '#B91C1C' : s.subTone === 'warning' ? '#B45309' : s.subTone === 'success' ? '#117E44' : '#9CA3AF' }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#0F1729', letterSpacing: -0.5, marginTop: 8 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: s.subTone === 'success' ? '#117E44' : s.subTone === 'danger' ? '#B91C1C' : s.subTone === 'warning' ? '#B45309' : '#8896A4' }}>{s.sub}</div>}
          </Card>
        ))}
      </div>

      {/* Filter card */}
      <Card padding={18}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label="Search" style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', boxSizing: 'border-box', background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8, fontSize: 14, color: '#9CA3AF' }}>
              <i data-lucide="search" style={{ width: 16, height: 16 }} />
              <span>Search products by name or SKU code…</span>
            </div>
          </Field>
          <Field label="Storage Type">
            <Select value={storageFilter} onChange={setStorageFilter} options={['All Storage Types', 'Ambient', 'Cold Chain', 'Frozen', 'Dry']} />
          </Field>
          <Field label="Category">
            <Select value={categoryFilter} onChange={setCategoryFilter} options={['All Categories', 'Vegetables', 'Fruits', 'Roots & Tubers', 'Grains & Legumes']} />
          </Field>
          <Field label="Status">
            <Select value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Active', 'Deactivated']} />
          </Field>
          <button style={{ ...btnPrimary, padding: '9px 18px' }}>Apply</button>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '9px 6px' }}>Clear</button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 12, color: '#5F6B7A' }}>
          <span style={{ fontWeight: 600 }}>Active filters:</span>
          <FilterChip label="Cold Chain" onClose={() => setStorageFilter('All Storage Types')} />
          <span style={{ color: '#D0D5DD' }}>|</span>
          <span>42 products found</span>
        </div>
      </Card>

      {/* Catalog table */}
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
          <colgroup>
            <col /><col /><col /><col /><col /><col /><col /><col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {['Product', 'Category', 'Storage Type', 'Shelf Life', 'Unit', 'Status', 'Retail Price', ''].map((h, i) => (
                <th key={i} style={{ textAlign: i === 6 ? 'right' : i === 7 ? 'center' : 'left', padding: i === 7 ? '14px 14px 14px 0' : i === 6 ? '14px 8px 14px 22px' : '14px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const st = storageTone[p.storage] || 'neutral';
              return (
                <tr key={i} style={{ borderBottom: i < products.length - 1 ? '1px solid #F0F2F5' : 'none' }}>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, color: '#1F2937' }}>{p.name}</span>
                      {p.ethylene && <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#B45309', letterSpacing: 0.3, textTransform: 'uppercase' }}>Ethylene</span>}
                      {p.sensitive && <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', letterSpacing: 0.3, textTransform: 'uppercase' }}>Sensitive</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Menlo, monospace' }}>{p.sku}</div>
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{p.category}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
                      <Pill tone={st}>{p.storage}</Pill>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{p.zone}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{p.shelf}</td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{p.unit}</td>
                  <td style={{ padding: '14px 22px' }}><Pill tone={p.status === 'Active' ? 'success' : 'neutral'}>{p.status}</Pill></td>
                  <td style={{ padding: '14px 8px 14px 22px', textAlign: 'right', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap' }}>{p.price}</td>
                  <td style={{ padding: '14px 14px 14px 0', textAlign: 'center', width: 44, position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRow(openRow === i ? null : i); }}
                      style={{ background: openRow === i ? '#F0F2F5' : 'transparent', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'inline-flex' }}
                      aria-label="Row actions"
                    >
                      <i data-lucide="more-vertical" style={{ width: 16, height: 16, color: '#5F6B7A' }} />
                    </button>
                    {openRow === i && (
                      <ProductActionsMenu onPick={(id) => {
                        setOpenRow(null);
                        if (id === 'edit')       { setFormProduct(p); setFormMode('edit'); }
                        else if (id === 'deactivate') { setDeactivate(p); }
                        // 'pricing' / 'category' — placeholders, not wired in this kit
                      }} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderTop: '1px solid #E8EBE9', fontSize: 13, color: '#5F6B7A' }}>
          <div>Showing <span style={{ fontWeight: 700, color: '#1F2937' }}>1-6</span> of <span style={{ fontWeight: 700, color: '#1F2937' }}>42</span> products</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PageBtn><i data-lucide="chevron-left" style={{ width: 14, height: 14 }} /></PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <PageBtn><i data-lucide="chevron-right" style={{ width: 14, height: 14 }} /></PageBtn>
          </div>
        </div>
      </Card>

      {/* Audit footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8896A4', paddingTop: 4 }}>
        <i data-lucide="shield-check" style={{ width: 14, height: 14 }} />
        <span>All catalog changes are recorded in the audit log (5-year retention per Rwanda FDA).</span>
      </div>

      {/* Create / Edit slide-over */}
      <ProductForm
        open={formMode !== null}
        mode={formMode}
        product={formProduct}
        onClose={() => setFormMode(null)}
        onSave={() => setFormMode(null)}
      />

      {/* Deactivate confirm */}
      <CenterModal
        open={!!deactivate}
        onClose={() => setDeactivate(null)}
        icon="ban"
        iconTone="danger"
        title={deactivate ? `Deactivate ${deactivate.name}?` : ''}
        subtitle="The product is soft-deleted — it stays in the ledger and audit trail but can no longer be ordered. You can reactivate it later."
        auditNote={true}
        footer={
          <React.Fragment>
            <button onClick={() => setDeactivate(null)} style={btnOutline}>Cancel</button>
            <button onClick={() => setDeactivate(null)} style={btnDanger}>Deactivate</button>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

function ProductActionsMenu({ onPick }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, []);
  const items = [
    { id: 'edit',       label: 'Edit product',   sub: 'Identity, storage, handling',   icon: 'pencil' },
    { id: 'pricing',    label: 'Retail pricing', sub: 'List price & markdown floor',   icon: 'tag' },
    { id: 'category',   label: 'Category',       sub: 'Re-assign product category',    icon: 'folder-tree' },
    { id: 'deactivate', label: 'Deactivate',     sub: 'Soft-disable this SKU',         icon: 'ban', danger: true, separator: true },
  ];
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'absolute', top: 38, right: 18, zIndex: 30, width: 260, background: '#fff', border: '1px solid #E8EBE9', borderRadius: 12, boxShadow: '0 16px 36px rgba(15,23,41,.14)', overflow: 'hidden', fontFamily: 'Inter', textAlign: 'left' }}
    >
      {items.map(it => <ProductMenuItem key={it.id} item={it} onPick={onPick} />)}
    </div>
  );
}

function ProductMenuItem({ item, onPick }) {
  const danger = item.danger;
  const tileBg = danger ? '#FEE2E2' : '#F3FAF6';
  const tileFg = danger ? '#E74C3C' : '#1B8C4E';
  const titleColor = danger ? '#E74C3C' : '#1F2937';
  return (
    <button
      onClick={() => onPick(item.id)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px', border: 'none', borderRadius: 0, borderTop: item.separator ? '1px solid #E8EBE9' : 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter' }}
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

// ── Create / Edit Product slide-over ──────────────────────────────────────────
function ProductForm({ open, mode, product, onClose, onSave }) {
  React.useEffect(() => {
    if (!open) return;
    if (window.lucide) window.lucide.createIcons();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  React.useEffect(() => { if (open && window.lucide) window.lucide.createIcons(); });

  if (!open) return null;
  const editing = mode === 'edit';

  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,.35)', zIndex: 100, display: 'flex', justifyContent: 'flex-end', fontFamily: 'Inter' }}>
      <div style={{ width: 480, maxWidth: '100%', height: '100%', background: '#fff', borderLeft: '1px solid #E8EBE9', boxShadow: '-8px 0 28px rgba(15,23,41,.14)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E8EBE9' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1729' }}>{editing ? 'Edit product' : 'Add product'}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#5F6B7A' }} aria-label="Close">
            <i data-lucide="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Scrolling body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FormSection label="Identity">
            <FormField label="SKU Code" required>
              <TextInput placeholder="TOM-RND-001" defaultValue={editing ? (product && product.sku) : ''} mono readOnly={editing} />
            </FormField>
            <FormField label="Product Name" required>
              <TextInput placeholder="Rwandan Round Tomato (Ripe)" defaultValue={editing ? (product && product.name) : ''} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Category">
                <Select value={editing && product ? product.category : 'Vegetables'} onChange={() => {}} options={['Vegetables', 'Fruits', 'Roots & Tubers', 'Grains & Legumes']} />
              </FormField>
              <FormField label="Unit of Measure" required>
                <Select value={editing && product ? product.unit : 'kg'} onChange={() => {}} options={['kg', 'g', 'piece', 'bunch', 'crate']} />
              </FormField>
            </div>
            <FormField label="Shelf Life (days)" required>
              <TextInput placeholder="7" defaultValue={editing && product ? String(product.shelf).replace(/[^0-9]/g, '') : ''} />
            </FormField>
          </FormSection>

          <FormSection label="Storage & Cold Chain">
            <FormField label="Storage Type" required>
              <Select value={editing && product ? product.storage : 'Ambient'} onChange={() => {}} options={['Ambient', 'Cold Chain', 'Frozen', 'Dry']} />
            </FormField>
            <FormField label="Temperature Zone">
              <TextInput placeholder="5–8 °C" defaultValue={editing && product ? product.zone : ''} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <FormField label="Min Temp (°C)"><TextInput placeholder="2" /></FormField>
              <FormField label="Max Temp (°C)"><TextInput placeholder="8" /></FormField>
              <FormField label="Chill Injury (°C)"><TextInput placeholder="4" /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Min Humidity (%)"><TextInput placeholder="85" /></FormField>
              <FormField label="Max Humidity (%)"><TextInput placeholder="95" /></FormField>
            </div>
          </FormSection>

          <FormSection label="Handling">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Ethylene Production">
                <Select value="Low" onChange={() => {}} options={['None', 'Low', 'Moderate', 'High', 'Very High']} />
              </FormField>
              <FormField label="Respiration Class">
                <Select value="Moderate" onChange={() => {}} options={['Low', 'Moderate', 'High', 'Very High']} />
              </FormField>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3D4451' }}>
              <input type="checkbox" /> Ethylene sensitive
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3D4451' }}>
              <input type="checkbox" /> Climacteric
            </label>
            <FormField label="Maturity Indices Note">
              <textarea rows={3} placeholder="Colour break, firmness, °Brix targets…" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: '#fff', border: '1px solid #E8EBE9', borderRadius: 8, fontSize: 14, fontFamily: 'Inter', resize: 'vertical' }} />
            </FormField>
          </FormSection>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #E8EBE9', padding: '14px 24px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#8896A4', marginBottom: 12 }}>
            <i data-lucide="shield-check" style={{ width: 13, height: 13, color: '#1B8C4E' }} />
            <span>Saved changes are recorded in the audit log (5-year retention per Rwanda FDA).</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={onClose} style={btnOutline}>Cancel</button>
            <button onClick={onSave} style={{ ...btnPrimary, padding: '10px 18px' }}>{editing ? 'Save changes' : 'Create Product'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-screen 2: Category Management ─────────────────────────────────────────
function CategoryManagement() {
  const categories = [
    { name: 'Vegetables',        desc: 'Leafy greens, brassicas, fruiting vegetables', products: 14, status: 'Active' },
    { name: 'Fruits',            desc: 'Tree fruit, berries, tropical',                products: 11, status: 'Active' },
    { name: 'Roots & Tubers',    desc: 'Carrots, potatoes, cassava',                   products: 6,  status: 'Active' },
    { name: 'Grains & Legumes',  desc: 'Maize, beans, rice',                           products: 8,  status: 'Active' },
    { name: 'Herbs & Spices',    desc: 'Aromatic herbs, dried spices',                 products: 0,  status: 'Deactivated' },
  ];
  const [openRow, setOpenRow] = React.useState(null);

  React.useEffect(() => {
    const onClick = () => setOpenRow(null);
    if (openRow !== null) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openRow]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Product Categories</div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>Organise the catalog. A category can only be deactivated when no active products reference it.</div>
        </div>
        <button style={{ ...btnPrimary, padding: '10px 18px', borderRadius: 999 }}>
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> New Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* Category list */}
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
            <colgroup><col /><col /><col /><col style={{ width: 44 }} /></colgroup>
            <thead>
              <tr>
                {['Category', 'Products', 'Status', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 3 ? 'center' : 'left', padding: i === 3 ? '14px 14px 14px 0' : '14px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < categories.length - 1 ? '1px solid #F0F2F5' : 'none', opacity: c.status === 'Deactivated' ? 0.7 : 1 }}>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontWeight: 600, color: '#1F2937' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{c.desc}</div>
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{c.products} products</td>
                  <td style={{ padding: '14px 22px' }}><Pill tone={c.status === 'Active' ? 'success' : 'neutral'}>{c.status}</Pill></td>
                  <td style={{ padding: '14px 14px 14px 0', textAlign: 'center', width: 44, position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRow(openRow === i ? null : i); }}
                      style={{ background: openRow === i ? '#F0F2F5' : 'transparent', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'inline-flex' }}
                      aria-label="Row actions"
                    >
                      <i data-lucide="more-vertical" style={{ width: 16, height: 16, color: '#5F6B7A' }} />
                    </button>
                    {openRow === i && (
                      <ProductActionsMenu onPick={() => setOpenRow(null)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* New / edit category panel */}
        <Card padding={20}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8896A4' }}>New Category</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Category Name" required><TextInput placeholder="e.g. Dairy & Eggs" /></FormField>
            <FormField label="Description"><TextInput placeholder="Short description" /></FormField>
            <button style={{ ...btnPrimary, padding: '10px 18px', width: '100%', justifyContent: 'center' }}>Save Category</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 16, padding: 12, background: '#FEF9E7', border: '1px solid rgba(245,158,11,.3)', borderRadius: 8, fontSize: 12, color: '#B45309' }}>
            <i data-lucide="info" style={{ width: 14, height: 14, marginTop: 1, flexShrink: 0 }} />
            <span>Deactivating a category with active products returns a 409 Conflict — reassign its products first.</span>
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
}

// ── Sub-screen 3: Retail Pricing ──────────────────────────────────────────────
function RetailPricing() {
  const history = [
    { price: '600 RWF', from: '10 Jul 2026', by: 'Sarah Johnson', note: 'Current effective price', current: true },
    { price: '560 RWF', from: '01 Jun 2026', by: 'Sarah Johnson', note: 'Seasonal adjustment' },
    { price: '520 RWF', from: '15 Apr 2026', by: 'David Mugisha', note: 'Supplier cost change' },
    { price: '480 RWF', from: '01 Mar 2026', by: 'David Mugisha', note: 'Launch price' },
  ];
  const [negative, setNegative] = React.useState(false);

  return (
    <React.Fragment>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Retail Pricing</div>
        <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>Set the list price and markdown floor per SKU. A backdated effective date requires the Finance Manager role.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        {/* Set-price panel */}
        <Card padding={20}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8896A4' }}>Cherry Tomatoes · TOM-RND-001</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="List Price" required><TextInput placeholder="600" defaultValue="600" /></FormField>
              <FormField label="Currency"><Select value="RWF" onChange={() => {}} options={['RWF']} /></FormField>
            </div>
            <FormField label="Markdown Floor"><TextInput placeholder="400" defaultValue="400" /></FormField>
            <FormField label="Effective From" required><TextInput placeholder="dd/mm/yyyy" defaultValue="10/07/2026" /></FormField>

            {negative && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 12, background: '#FEE2E2', border: '1px solid rgba(231,76,60,.3)', borderRadius: 8, fontSize: 12, color: '#B91C1C' }}>
                <i data-lucide="alert-triangle" style={{ width: 14, height: 14, marginTop: 1, flexShrink: 0 }} />
                <span>List price is below supplier cost (520 RWF). Saving sets a negative margin.</span>
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#3D4451' }}>
              <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} />
              I understand this sets a negative margin and want to save it anyway
            </label>
            <button style={{ ...btnPrimary, padding: '10px 18px', width: '100%', justifyContent: 'center' }}>Save price</button>
          </div>
        </Card>

        {/* Price history */}
        <Card padding={0}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #E8EBE9', fontSize: 13, fontWeight: 700, color: '#0F1729' }}>Price History</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
            <thead>
              <tr>
                {['Effective Price', 'Effective From', 'Set By', 'Note'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '14px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} style={{ borderBottom: i < history.length - 1 ? '1px solid #F0F2F5' : 'none' }}>
                  <td style={{ padding: '14px 22px' }}>
                    <span style={{ fontWeight: 700, color: '#1F2937' }}>{h.price}</span>
                    {h.current && <span style={{ marginLeft: 8, display: 'inline-flex', padding: '2px 8px', borderRadius: 9999, fontSize: 10.5, fontWeight: 700, background: '#EEF6F2', color: '#117E44' }}>Current</span>}
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{h.from}</td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{h.by}</td>
                  <td style={{ padding: '14px 22px', color: '#9CA3AF' }}>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8896A4', paddingTop: 4 }}>
        <i data-lucide="shield-check" style={{ width: 14, height: 14 }} />
        <span>Every price change is recorded in the audit log (5-year retention per Rwanda FDA).</span>
      </div>
    </React.Fragment>
  );
}

// ── Local form helpers (kit-local, mirror the promoted control styling) ────────
function FormSection({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8896A4' }}>{label}</div>
      {children}
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#3D4451' }}>
        {label}{required && <span style={{ color: '#E74C3C' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ placeholder, defaultValue, mono, readOnly }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      readOnly={readOnly}
      style={{
        width: '100%', boxSizing: 'border-box', height: 40, padding: '0 14px',
        background: readOnly ? '#F9FAFB' : '#fff', border: '1px solid #E8EBE9', borderRadius: 8,
        fontSize: 14, fontFamily: mono ? 'Menlo, monospace' : 'Inter', color: '#1F2937',
      }}
    />
  );
}

const btnOutline = {
  height: 40, padding: '0 18px', borderRadius: 8, border: '1px solid #E8EBE9',
  background: '#fff', color: '#1F2937', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
};
const btnDanger = {
  height: 40, padding: '0 18px', borderRadius: 8, border: 'none',
  background: '#E74C3C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
};
