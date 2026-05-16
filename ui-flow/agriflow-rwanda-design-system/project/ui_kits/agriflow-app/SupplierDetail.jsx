// Supplier detail page — Overview / Documents / Price Book / Scorecard
// Default tab is driven by the action picked in the row popover.

function SupplierDetail({ supplier, initialTab = 'overview', onBack }) {
  const [tab, setTab] = React.useState(initialTab);
  const [statusOverride, setStatusOverride] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  React.useEffect(() => setTab(initialTab), [initialTab]);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const baseSupplier = supplier || {
    name: 'Uwimana Farms Ltd',
    initials: 'UF',
    location: 'Musanze District',
    status: 'Active',
  };
  const s = statusOverride ? { ...baseSupplier, status: statusOverride } : baseSupplier;
  const isSuspended = s.status === 'Suspended';

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'pricebook', label: 'Price Book' },
    { id: 'scorecard', label: 'Scorecard' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Inter' }} data-screen-label="supplier-detail">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: '#EEF6F2',
          color: '#1B8C4E', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16, letterSpacing: 0.5, flexShrink: 0,
        }}>{s.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>{s.name}</div>
            <Pill tone={s.status === 'Active' ? 'success' : s.status === 'Suspended' ? 'danger' : 'warning'}>{s.status}</Pill>
            {s.highRisk && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 9px', borderRadius: 4,
                fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4,
                background: '#FEE2E2', color: '#B91C1C',
              }}>
                <i data-lucide="alert-triangle" style={{ width: 11, height: 11 }} />
                HIGH RISK
              </span>
            )}
            {s.lowConfidence && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 9px', borderRadius: 4,
                fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4,
                background: '#FEF3C7', color: '#B45309',
              }}>
                <i data-lucide="info" style={{ width: 11, height: 11 }} />
                LOW CONFIDENCE
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{s.location}</span>
            <span style={{ color: '#D0D5DD' }}>·</span>
            <span>Since {s.since || 'March 2026'}</span>
            <span style={{ color: '#D0D5DD' }}>·</span>
            <span>{(s.products || '8 SKUs').replace(/\s*SKUs?/i, '')} products mapped</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {tab === 'overview' && (
            <>
              <button style={{ ...btnGhost, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i data-lucide="pencil" style={{ width: 14, height: 14 }} />
                Edit Profile
              </button>
              {isSuspended ? (
                <button
                  onClick={() => setConfirmOpen(true)}
                  style={{ background: '#fff', border: '1px solid #C8ECDA', color: '#117E44', borderRadius: 8, fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <i data-lucide="rotate-ccw" style={{ width: 14, height: 14 }} />
                  Reactivate
                </button>
              ) : (
                <button
                  onClick={() => setConfirmOpen(true)}
                  style={{ background: '#fff', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: 8, fontFamily: 'Inter', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <i data-lucide="ban" style={{ width: 14, height: 14 }} />
                  Suspend
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Suspension banners */}
      {isSuspended && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 16, borderRadius: 10,
            background: '#FEF2F2', border: '1px solid #FECACA',
          }}>
            <i data-lucide="ban" style={{ width: 20, height: 20, color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#DC2626' }}>Supplier Suspended</div>
              <div style={{ fontSize: 13, color: '#1F2937', marginTop: 4, lineHeight: 1.55 }}>
                Suspended on 15 Jan 2026 by Admin. Reason: RICA certification expired. This supplier is hidden from receiving workflows and price mapping.
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#8896A4', marginTop: 8 }}>
                <i data-lucide="check-circle" style={{ width: 12, height: 12 }} />
                Suspension logged to audit trail
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 16, borderRadius: 10,
            background: '#FEF9C3', border: '1px solid rgba(180, 83, 9, .25)',
          }}>
            <i data-lucide="alert-triangle" style={{ width: 20, height: 20, color: '#B45309', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#B45309' }}>RICA Certification Expired</div>
              <div style={{ fontSize: 13, color: '#B45309', marginTop: 4, lineHeight: 1.55 }}>
                Certificate RICA-2023-00912 expired on 15 Jan 2026. Supplier must renew their RICA certification before reactivation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #E8EBE9', display: 'flex', gap: 28 }}>
        {tabs.map(t => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '12px 0', marginBottom: -1,
                fontSize: 13, fontWeight: 600, fontFamily: 'Inter',
                color: isActive ? '#1B8C4E' : '#5F6B7A',
                borderBottom: `2px solid ${isActive ? '#1B8C4E' : 'transparent'}`,
              }}
            >{t.label}</button>
          );
        })}
      </div>

      {/* Body */}
      {tab === 'overview'  && <SDOverview  supplier={s} />}
      {tab === 'documents' && <SDDocuments supplier={s} />}
      {tab === 'pricebook' && <SDPriceBook supplier={s} />}
      {tab === 'scorecard' && <SDScorecard  supplier={s} />}

      {confirmOpen && (
        <SuspendSupplierModal
          supplier={s}
          mode={isSuspended ? 'reactivate' : 'suspend'}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setStatusOverride(isSuspended ? 'Active' : 'Suspended');
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------- Suspend / Reactivate confirmation ---------- */
function SuspendSupplierModal({ supplier, mode = 'suspend', onCancel, onConfirm }) {
  const isReactivate = mode === 'reactivate';
  const accent           = isReactivate ? '#117E44' : '#DC2626';
  const accentBgSoft     = isReactivate ? '#F3FAF6' : '#FEF2F2';
  const accentBorderSoft = isReactivate ? '#C8ECDA' : '#FECACA';

  const title       = isReactivate ? 'Reactivate Supplier' : 'Suspend Supplier';
  const verb        = isReactivate ? 'reactivate' : 'suspend';
  const ctaIcon     = isReactivate ? 'rotate-ccw' : 'ban';
  const ctaLabel    = isReactivate ? 'Reactivate Supplier' : 'Suspend Supplier';
  const impactTitle = isReactivate
    ? 'This supplier will resume operations immediately'
    : 'This will pause all activity for this supplier';
  const impactBody  = isReactivate
    ? 'Their price book will reappear in order creation, open POs can be processed normally, and new orders can be placed. Previous contracts and RICA records remain unchanged.'
    : (<>Open POs will be flagged for review, no new orders can be placed, and their price book will be hidden from order creation. This is a <span style={{ fontWeight: 600, color: '#0F1729' }}>soft suspension</span> — an administrator can reactivate them at any time.</>);

  return (
    <CenterModal
      open={true}
      onClose={onCancel}
      icon={isReactivate ? 'rotate-ccw' : 'ban'}
      iconTone={isReactivate ? 'success' : 'danger'}
      title={title}
      subtitle={<>Are you sure you want to {verb} <span style={{ fontWeight: 600, color: '#1F2937' }}>{supplier.name}</span>?</>}
      maxWidth={480}
      auditNote
      footer={
        <>
          <button
            onClick={onCancel}
            style={{
              height: 40, padding: '0 16px', borderRadius: 8, cursor: 'pointer',
              background: '#fff', border: '1px solid #E8EBE9', color: '#1F2937',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 13,
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              height: 40, padding: '0 16px', borderRadius: 8, cursor: 'pointer',
              background: accent, border: 'none', color: '#fff',
              fontFamily: 'Inter', fontWeight: 600, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,.05)',
            }}
          >
            <i data-lucide={ctaIcon} style={{ width: 16, height: 16 }} /> {ctaLabel}
          </button>
        </>
      }
    >
      {/* Supplier info card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 16, borderRadius: 10, background: '#F9FAFB',
        border: '1px solid #E8EBE9', marginBottom: 20,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 20, flexShrink: 0,
          background: supplier.avatar || '#1B8C4E', color: '#fff', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{supplier.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{supplier.name}</div>
          <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 2, fontFamily: 'Menlo, monospace' }}>{supplier.phone || '+250 788 123 456'}</div>
          <span style={{
            display: 'inline-flex', marginTop: 6,
            padding: '2px 8px', borderRadius: 9999,
            fontSize: 10, fontWeight: 700, background: '#F0F2F5', color: '#374151',
          }}>{supplier.location || 'Musanze'}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 9999,
            fontSize: 11.5, fontWeight: 600,
            background: supplier.status === 'Active' ? '#EEF6F2' : supplier.status === 'Pending' ? '#FEF9C3' : '#FEE2E2',
            color:      supplier.status === 'Active' ? '#117E44' : supplier.status === 'Pending' ? '#854D0E' : '#B91C1C',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: .9 }} />
            {supplier.status}
          </span>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Since 12 Mar 2026</div>
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

/* ---------- Overview ---------- */
function SDOverview({ supplier } = {}) {
  const s = supplier || {};
  const company = [
    ['Company Name',    s.name || 'Uwimana Farms Ltd'],
    ['Contact Person',  'Jean-Pierre Uwimana'],
    ['Phone',           s.phone || '+250 788 123 456', 'phone'],
    ['Email',           'jp@uwimanafarms.rw'],
    ['Location',        `${s.location || 'Musanze'} District`],
    ['Registered On',   '12 Mar 2026'],
  ];
  const bank = [
    ['Bank',            'Bank of Kigali'],
    ['Account Number',  '**** **** **789', 'mono'],
    ['Account Holder',  s.name || 'Uwimana Farms Ltd'],
    ['Mobile Money',    '+250 78* *** *56', 'phone-mono'],
  ];
  const rica = [
    ['Certificate Number', 'RICA-2024-00456'],
    ['Status',             'Valid', 'pill'],
    ['Expiry Date',        '15 Dec 2026'],
    ['Days Until Expiry',  '255 days'],
  ];

  const SectionCard = ({ title, badge, children }) => (
    <Card padding={22}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>{title}</div>
        {badge}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
        {children}
      </div>
    </Card>
  );

  const Pair = ({ label, value, kind }) => (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9CA3AF' }}>{label}</div>
      {kind === 'pill' ? (
        <div style={{ marginTop: 6 }}><Pill tone="success">{value}</Pill></div>
      ) : (
        <div style={{
          fontSize: 13.5, fontWeight: 600, color: '#0F1729', marginTop: 4,
          fontFamily: kind === 'mono' || kind === 'phone-mono' ? 'Menlo, monospace' : 'Inter',
        }}>
          {kind === 'phone' || kind === 'phone-mono' ? <>🇷🇼&nbsp;&nbsp;{value}</> : value}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
      {/* ───── Left column ───── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionCard title="Company Information">
          {company.map(([k, v, kind]) => <Pair key={k} label={k} value={v} kind={kind} />)}
        </SectionCard>

        <SectionCard
          title="Bank Details"
          badge={
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#EEF6F2', color: '#1B8C4E',
              fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            }}>
              <i data-lucide="lock" style={{ width: 11, height: 11 }} />
              ENCRYPTED
            </span>
          }
        >
          {bank.map(([k, v, kind]) => <Pair key={k} label={k} value={v} kind={kind} />)}
        </SectionCard>

        <SectionCard title="RICA Certification">
          {rica.map(([k, v, kind]) => <Pair key={k} label={k} value={v} kind={kind} />)}
        </SectionCard>
      </div>

      {/* ───── Right rail ───── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Performance preview */}
        <Card padding={22}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Performance (30d)</div>
            <button style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: '#1B8C4E', fontWeight: 600, cursor: 'pointer' }}>Full Scorecard</button>
          </div>
          {[
            ['QC Pass Rate',     96, '96%',   'success'],
            ['On-Time Delivery', 92, '92%',   'success'],
          ].map(([label, pct, val]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#5F6B7A' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1B8C4E' }}>{val}</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#F0F2F5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#1B8C4E' }}></div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#5F6B7A' }}>Avg Lead Time</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1729' }}>1.2 days</span>
          </div>
          <div style={{ borderTop: '1px solid #F0F2F5', marginTop: 14, paddingTop: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9CA3AF' }}>Total Deliveries</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3, marginTop: 2 }}>47</div>
          </div>
        </Card>

        {/* Mapped products */}
        <Card padding={22}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Mapped Products</div>
            <button style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 12, color: '#1B8C4E', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {[
            ['Tomatoes',    '500 RWF/kg'],
            ['Green Beans', '800 RWF/kg'],
            ['Carrots',     '350 RWF/kg'],
          ].map(([name, price], i) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 13, color: '#1F2937' }}>{name}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1729' }}>{price}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #F0F2F5', paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontSize: 11.5, color: '#9CA3AF' }}>+5 more products</span>
          </div>
        </Card>

        {/* Recent activity */}
        <Card padding={22}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729', marginBottom: 14 }}>Recent Activity</div>
          {[
            { tone: '#1B8C4E', text: 'Delivery received — 150 kg Tomatoes',                     meta: 'QC: Grade A · 2 hours ago' },
            { tone: '#1B8C4E', text: 'Price updated — Green Beans: 780 → 800 RWF/kg',           meta: 'By Jean Mugabo · Yesterday' },
            { tone: '#B91C1C', text: 'QC Rejection — 30 kg Lettuce (Grade: Reject)',            meta: 'Reason: Wilting · 3 days ago' },
            { tone: '#1B8C4E', text: 'Contract renewed',                                        meta: 'By Admin · 5 days ago' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: a.tone, marginTop: 6, flexShrink: 0 }}></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: '#1F2937', lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 2 }}>{a.meta}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ---------- Documents ---------- */
function SDDocuments() {
  // Category controls the icon tile colour and the badge tone.
  // 'contract'    → red tile, green "Contract" badge
  // 'certificate' → green tile, green "Certificate" badge
  // 'other'       → muted tile, muted "Other" badge
  const docs = [
    {
      name: 'Commercial Agreement 2026',
      meta: 'PDF · 2.4 MB · Uploaded 12 Mar 2026 by Jean Mugabo',
      category: 'contract',
      label: 'Contract',
    },
    {
      name: 'RICA Certificate',
      meta: 'PDF · 1.1 MB · Uploaded 12 Mar 2026 by Jean Mugabo',
      category: 'certificate',
      label: 'Certificate',
    },
    {
      name: 'Cold Chain Compliance',
      meta: 'PDF · 94 KB · Uploaded 14 Mar 2026 by Jean Mugabo',
      category: 'certificate',
      label: 'Certificate',
    },
    {
      name: 'Tax Registration Certificate (RRA)',
      meta: 'PDF · 856 KB · Uploaded 15 Mar 2026 by Jean Mugabo',
      category: 'other',
      label: 'Other',
    },
  ];

  const tileStyle = {
    contract:    { bg: '#FDECEC', fg: '#B91C1C' },
    certificate: { bg: '#EEF6F2', fg: '#1B8C4E' },
    other:       { bg: '#F0F2F5', fg: '#5F6B7A' },
  };
  const badgeStyle = {
    contract:    { bg: '#EEF6F2', fg: '#117E44' },
    certificate: { bg: '#EEF6F2', fg: '#117E44' },
    other:       { bg: '#F0F2F5', fg: '#5F6B7A' },
  };

  const iconBtn = {
    width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EBE9',
    background: '#fff', cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color: '#5F6B7A',
  };
  const viewBtn = {
    height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid #E8EBE9',
    background: '#fff', color: '#0F1729', fontSize: 12.5, fontWeight: 600,
    fontFamily: 'Inter', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding={22}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Supplier Documents</div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 12px', borderRadius: 8,
            background: '#1B8C4E', color: '#fff', border: 'none',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
          }}>
            <i data-lucide="plus" style={{ width: 13, height: 13 }} />
            Upload Document
          </button>
        </div>

        <div style={{ border: '1px solid #E8EBE9', borderRadius: 10, overflow: 'hidden' }}>
          {docs.map((d, i) => {
            const t = tileStyle[d.category];
            const b = badgeStyle[d.category];
            return (
              <div
                key={d.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 16px',
                  borderTop: i === 0 ? 'none' : '1px solid #F0F2F5',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: t.bg, color: t.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i data-lucide={d.category === 'certificate' ? 'shield-check' : 'file-text'} style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F1729' }}>{d.name}</div>
                  <div style={{ fontSize: 11.5, color: '#8896A4', marginTop: 3 }}>{d.meta}</div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 700,
                  background: b.bg, color: b.fg,
                }}>{d.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button style={viewBtn}>View</button>
                  <button style={iconBtn} aria-label="Download">
                    <i data-lucide="download" style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11.5, color: '#8896A4', marginTop: 12 }}>
          Documents stored securely via AWS S3 with private access. Links expire after 1 hour.
        </div>
      </Card>

      {/* S3 upload failure state */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: 16, borderRadius: 10,
        background: '#FDECEC', border: '1px solid #FCA5A5',
      }}>
        <i data-lucide="alert-circle" style={{ width: 20, height: 20, color: '#B91C1C', flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#B91C1C' }}>Document upload failed</div>
          <div style={{ fontSize: 13, color: '#1F2937', marginTop: 4, lineHeight: 1.5 }}>
            The file could not be uploaded to storage (S3 timeout). The supplier profile has been saved without this document.
          </div>
          <button style={{
            marginTop: 10, height: 32, padding: '0 12px', borderRadius: 8,
            background: '#fff', border: '1px solid #FCA5A5', color: '#B91C1C',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
          }}>Retry Upload</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Price Book (matches the screenshot) ---------- */
function SDPriceBook({ supplier } = {}) {
  const suspended = supplier?.status === 'Suspended';
  // Detect "0 SKUs" / "No products" suppliers — they show the empty state instead of the table.
  const productsCount = parseInt((supplier?.products || '8').toString(), 10);
  const isEmpty = !isNaN(productsCount) && productsCount === 0;

  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('All Categories');
  const [storage, setStorage] = React.useState('All Storage');
  const [addOpen, setAddOpen] = React.useState(false);

  if (isEmpty) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card padding={56}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32, background: '#F3F5F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <i data-lucide="package" style={{ width: 30, height: 30, color: '#8896A4' }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1729' }}>No products mapped yet</div>
            <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 6, maxWidth: 420, lineHeight: 1.55 }}>
              Map products from the AgriFlow catalog to this supplier with agreed prices. These prices will be suggested during receiving workflows.
            </div>
            <button
              onClick={() => !suspended && setAddOpen(true)}
              disabled={suspended}
              title={suspended ? 'Reactivate this supplier to add product mappings' : undefined}
              style={{
                ...btnPrimary,
                padding: '10px 18px',
                marginTop: 24,
                opacity: suspended ? 0.5 : 1,
                cursor: suspended ? 'not-allowed' : 'pointer',
              }}
            >
              <i data-lucide={suspended ? 'lock' : 'plus'} style={{ width: 14, height: 14, marginRight: 6, verticalAlign: -2 }} />
              Add First Product Mapping
            </button>
          </div>
        </Card>

        {addOpen && (
          <AddProductMappingModal
            onClose={() => setAddOpen(false)}
            onAdd={() => setAddOpen(false)}
          />
        )}
      </div>
    );
  }

  const rows = [
    { sku: 'SKU-TOM-001', name: 'Tomatoes',          cat: 'Vegetables',      storage: 'COLD_CHAIN', uom: 'KG', price: '500 RWF', prev: null,       updated: '2 Apr 2026'  },
    { sku: 'SKU-GRB-002', name: 'Green Beans',       cat: 'Vegetables',      storage: 'COLD_CHAIN', uom: 'KG', price: '800 RWF', prev: '780 RWF',  updated: '1 Apr 2026'  },
    { sku: 'SKU-CAR-003', name: 'Carrots',           cat: 'Root Vegetables', storage: 'DRY',        uom: 'KG', price: '350 RWF', prev: null,       updated: '28 Mar 2026' },
    { sku: 'SKU-LET-004', name: 'Lettuce (Iceberg)', cat: 'Leafy Greens',    storage: 'COLD_CHAIN', uom: 'KG', price: '600 RWF', prev: null,       updated: '25 Mar 2026' },
    { sku: 'SKU-ONI-005', name: 'Onions (Red)',      cat: 'Root Vegetables', storage: 'AMBIENT',    uom: 'KG', price: '280 RWF', prev: null,       updated: '20 Mar 2026' },
  ];

  const stTone = (s) => ({
    COLD_CHAIN: { color: '#1F77E0', bg: '#EAF2FE' },
    DRY:        { color: '#B45309', bg: '#FEF3C7' },
    AMBIENT:    { color: '#117E44', bg: '#EEF6F2' },
  }[s] || { color: '#5F6B7A', bg: '#F0F2F5' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Filter bar */}
      <Card padding={18}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Field label="Search" style={{ flex: '1 1 280px', minWidth: 240 }}>
            <div style={{ position: 'relative' }}>
              <i data-lucide="search" style={{ width: 16, height: 16, color: '#9CA3AF', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{ width: '100%', height: 42, padding: '0 14px 0 36px', border: '1px solid #E8EBE9', borderRadius: 8, fontSize: 14, fontFamily: 'Inter', color: '#1F2937', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </Field>
          <Field label="Category">
            <Select value={category} onChange={setCategory} options={['All Categories', 'Vegetables', 'Root Vegetables', 'Leafy Greens']} />
          </Field>
          <Field label="Storage Type">
            <Select value={storage} onChange={setStorage} options={['All Storage', 'Cold Chain', 'Dry', 'Ambient']} />
          </Field>
          <button style={{ ...btnPrimary, padding: '7px 16px' }}>Apply</button>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '7px 6px' }}>Clear</button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12.5, color: '#5F6B7A' }}>
          Active filters: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EAF2FE', color: '#1F77E0', fontWeight: 600, padding: '3px 8px', borderRadius: 999, fontSize: 11.5, marginLeft: 6 }}>Cold Chain <i data-lucide="x" style={{ width: 11, height: 11, cursor: 'pointer' }} /></span>
          <span style={{ margin: '0 10px', color: '#D0D5DD' }}>|</span>
          <span style={{ fontWeight: 600, color: '#1F2937' }}>{rows.length + 3} products found</span>
        </div>
      </Card>

      {/* Product price mappings */}
      <Card padding={0}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #F0F2F5' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Product Price Mappings</div>
            <div style={{ fontSize: 12, color: '#8896A4', marginTop: 2 }}>{rows.length + 3} products mapped to this supplier</div>
          </div>
          <button
            onClick={() => !suspended && setAddOpen(true)}
            disabled={suspended}
            title={suspended ? 'Reactivate this supplier to add product mappings' : undefined}
            style={{
              ...btnPrimary,
              padding: '9px 14px',
              opacity: suspended ? 0.5 : 1,
              cursor: suspended ? 'not-allowed' : 'pointer',
              filter: suspended ? 'grayscale(.3)' : 'none',
            }}
          >
            <i data-lucide={suspended ? 'lock' : 'plus'} style={{ width: 14, height: 14, marginRight: 6, verticalAlign: -2 }} />
            Add Product Mapping
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Product', 'Category', 'Storage', 'UoM', 'Agreed price', 'Last updated', 'Actions'].map((h, i) => (
                <th key={i} style={{ textAlign: i === 6 ? 'right' : i >= 4 ? 'right' : 'left', padding: '12px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #F0F2F5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const t = stTone(r.storage);
              return (
                <tr key={r.sku}>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1729' }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: '#8896A4', marginTop: 2 }}>{r.sku}</div>
                  </td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 12.5, color: '#5F6B7A' }}>{r.cat}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.color, background: t.bg, padding: '4px 8px', borderRadius: 6 }}>{r.storage}</span>
                  </td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 12.5, color: '#5F6B7A' }}>{r.uom}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1729' }}>{r.price}</div>
                    {r.prev && <div style={{ fontSize: 11, color: '#8896A4', textDecoration: 'line-through', marginTop: 1 }}>{r.prev}</div>}
                  </td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 12.5, color: '#8896A4', textAlign: 'right' }}>{r.updated}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Edit Price</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px' }}>
          <div style={{ fontSize: 12, color: '#8896A4' }}>Showing 1–5 of {rows.length + 3} products</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ width: 28, height: 28, borderRadius: 6, background: '#1B8C4E', color: '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>1</button>
            <button style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', color: '#5F6B7A', border: '1px solid #E8EBE9', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>2</button>
          </div>
        </div>
      </Card>

      {/* Footer note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8896A4', padding: '4px 6px' }}>
        <i data-lucide="info" style={{ width: 13, height: 13 }} />
        Price changes apply only to future receiving batches. Past inventory batches retain their original cost for financial accuracy.
      </div>

      {addOpen && (
        <AddProductMappingModal
          onClose={() => setAddOpen(false)}
          onAdd={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------- Add Product Mapping (slide-over) ---------- */
function AddProductMappingModal({ onClose, onAdd }) {
  const [product, setProduct] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [uom, setUom] = React.useState('KG');

  // Duplicate detection — products already mapped in the price book table above.
  const existingMappings = {
    'SKU-TOM-001': { name: 'Tomatoes',    price: '500 RWF', uom: 'KG' },
    'SKU-GRB-002': { name: 'Green Beans', price: '800 RWF', uom: 'KG' },
    'SKU-CAR-003': { name: 'Carrots',     price: '350 RWF', uom: 'KG' },
  };
  const duplicate = existingMappings[product];

  const products = [
    { sku: 'SKU-TOM-001', name: 'Tomatoes' },
    { sku: 'SKU-AVO-009', name: 'Avocados' },
    { sku: 'SKU-MNG-010', name: 'Mangoes' },
    { sku: 'SKU-PEA-011', name: 'Garden Peas' },
    { sku: 'SKU-CAB-012', name: 'Cabbages' },
  ];

  const canSubmit = product && price && !duplicate;

  return (
    <SlideOverForm
      open={true}
      onClose={onClose}
      title="Add Product Mapping"
      primaryLabel={duplicate ? 'Go to Existing Mapping' : 'Add Mapping'}
      primaryIcon={duplicate ? 'arrow-right' : 'plus'}
      onPrimary={canSubmit ? onAdd : undefined}
    >
      <div style={{ fontSize: 13, color: '#5F6B7A', lineHeight: 1.55, marginTop: -4 }}>
        Map a product from the catalog to this supplier with an agreed price.
      </div>

      {duplicate && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: 12, borderRadius: 10,
          background: '#FEF2F2', border: '1px solid #FECACA',
        }}>
          <i data-lucide="alert-circle" style={{ width: 18, height: 18, color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>Duplicate mapping</div>
            <div style={{ fontSize: 12, color: '#1F2937', marginTop: 4, lineHeight: 1.5 }}>
              A price mapping for "{duplicate.name}" already exists for this supplier. Update the existing mapping instead.
            </div>
          </div>
        </div>
      )}

      <FormSection label="Mapping details">
        <FormField
          label="Product"
          required
          hint={duplicate
            ? <span style={{ color: '#DC2626' }}>This product is already mapped to this supplier at {duplicate.price}/{duplicate.uom}</span>
            : 'Only products not already mapped to this supplier are shown.'}
        >
          <Select
            value={product}
            onChange={setProduct}
            placeholder="Search and select a product..."
            width="100%"
            options={products.map(p => ({ value: p.sku, label: `${p.name} (${p.sku})` }))}
            style={duplicate ? { boxShadow: '0 0 0 1px #FCA5A5 inset', borderRadius: 8 } : undefined}
          />
        </FormField>

        <FormField label="Agreed Price per Unit" required>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, fontWeight: 600, color: '#9CA3AF', pointerEvents: 'none',
            }}>RWF</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              style={{ ...formInputStyle, paddingLeft: 48 }}
            />
          </div>
        </FormField>

        <FormField label="Unit of Measure" hint="Default unit is set by the Product Catalog.">
          <Select
            value={uom}
            onChange={setUom}
            width="100%"
            options={['KG', 'Crate', 'Bunch', 'Piece']}
          />
        </FormField>
      </FormSection>

      <FormInfoBox>
        {duplicate
          ? 'To change the price, use the "Edit Price" button on the existing mapping row.'
          : 'This mapping will appear in the supplier\'s price book immediately. To change the price later, use the "Edit Price" button on the mapping row.'}
      </FormInfoBox>
    </SlideOverForm>
  );
}

/* ---------- Scorecard ---------- */
function SDScorecard({ supplier } = {}) {
  const highRisk = !!supplier?.highRisk;
  const lowConfidence = !!supplier?.lowConfidence;
  const [period, setPeriod] = React.useState(lowConfidence ? 'all' : '30d');
  const productsCount = parseInt((supplier?.products || '8').toString(), 10);
  const isEmpty = !isNaN(productsCount) && productsCount === 0;

  if (isEmpty) {
    return (
      <Card padding={64}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32, background: '#F3F5F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            <i data-lucide="bar-chart-3" style={{ width: 30, height: 30, color: '#8896A4' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1729' }}>No scorecard data yet</div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 8, maxWidth: 440, lineHeight: 1.6 }}>
            Scorecard metrics will appear after the first delivery is logged and QC-inspected for this supplier. Performance tracking includes QC pass rate, delivery timeliness, and lead time.
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 24, padding: '8px 14px', borderRadius: 8,
            background: '#F3F5F7', color: '#5F6B7A',
            fontSize: 11.5, fontWeight: 500,
          }}>
            <i data-lucide="info" style={{ width: 13, height: 13 }} />
            Low-confidence indicator is shown for suppliers with fewer than 3 deliveries
          </div>
        </div>
      </Card>
    );
  }

  const periods = [
    { id: '30d',  label: '30 days' },
    { id: '90d',  label: '90 days' },
    { id: 'all',  label: 'All time' },
  ];

  const kpis = lowConfidence ? [
    {
      label: 'Total Deliveries',
      value: '2',
      icon: 'truck',
      pill: 'Based on 2 deliveries',
    },
    {
      label: 'QC Rejection Rate',
      value: '0%',
      valueTone: 'success',
      icon: 'check-circle',
      pill: 'Based on 2 deliveries',
    },
    {
      label: 'Avg Lead Time',
      value: '2.5',
      unit: 'days',
      icon: 'timer',
      pill: 'Based on 2 deliveries',
    },
    {
      label: 'On-Time Delivery Rate',
      value: '100%',
      valueTone: 'success',
      icon: 'clock',
      pill: 'Based on 2 deliveries',
    },
  ] : highRisk ? [
    {
      label: 'Total Deliveries',
      value: '31',
      sub: '-2 from last period',
      subTone: 'muted',
      icon: 'truck',
    },
    {
      label: 'QC Pass Rate',
      value: '73%',
      sub: '27% rejection — ABOVE THRESHOLD',
      subTone: 'danger',
      icon: 'x-circle',
      valueTone: 'danger',
      borderTone: 'danger',
    },
    {
      label: 'On-Time Delivery',
      value: '78%',
      sub: '7 late deliveries',
      subTone: 'muted',
      icon: 'clock',
      valueTone: 'warning',
      iconTone: 'warning',
    },
    {
      label: 'Avg Lead Time',
      value: '2.8',
      unit: 'days',
      sub: '1.3 days slower than avg',
      subTone: 'danger',
      icon: 'timer',
    },
  ] : [
    {
      label: 'Total Deliveries',
      value: '47',
      sub: '+8 from last period',
      subTone: 'success',
      icon: 'truck',
    },
    {
      label: 'QC Pass Rate',
      value: '96%',
      sub: '2 rejections out of 47',
      subTone: 'muted',
      icon: 'check-circle',
      valueTone: 'success',
    },
    {
      label: 'On-Time Delivery',
      value: '92%',
      sub: '4 late deliveries',
      subTone: 'muted',
      icon: 'clock',
      valueTone: 'success',
    },
    {
      label: 'Avg Lead Time',
      value: '1.2',
      unit: 'days',
      sub: '0.3 days faster than avg',
      subTone: 'success',
      icon: 'timer',
    },
  ];

  const grades = lowConfidence ? [
    { name: 'Grade A',  count: '2 batches (100%)', pct: 100, color: '#1B8C4E', valueColor: '#0F1729' },
    { name: 'Grade B',  count: '0 batches (0%)',   pct: 0,   color: '#B45309', valueColor: '#0F1729' },
    { name: 'Rejected', count: '0 batches (0%)',   pct: 0,   color: '#B91C1C', valueColor: '#8896A4' },
  ] : highRisk ? [
    { name: 'Grade A',  count: '12 batches (39%)', pct: 39, color: '#1B8C4E', valueColor: '#0F1729' },
    { name: 'Grade B',  count: '11 batches (35%)', pct: 35, color: '#B45309', valueColor: '#0F1729' },
    { name: 'Rejected', count: '8 batches (26%)',  pct: 26, color: '#B91C1C', valueColor: '#B91C1C' },
  ] : [
    { name: 'Grade A',  count: '38 batches (81%)', pct: 81, color: '#1B8C4E', valueColor: '#0F1729' },
    { name: 'Grade B',  count: '7 batches (15%)',  pct: 15, color: '#B45309', valueColor: '#0F1729' },
    { name: 'Rejected', count: '2 batches (4%)',   pct: 4,  color: '#B91C1C', valueColor: '#B91C1C' },
  ];

  const rejections = lowConfidence ? [] : highRisk ? [
    { reason: 'Wilting / Freshness',     count: '4 batches (120 kg)', dot: '#B91C1C' },
    { reason: 'Size Non-Conformity',     count: '2 batches (60 kg)',  dot: '#B45309' },
    { reason: 'Cold-chain break',        count: '1 batch (40 kg)',    dot: '#B91C1C' },
    { reason: 'Pest / Contamination',    count: '1 batch (20 kg)',    dot: '#B91C1C' },
  ] : [
    { reason: 'Wilting / Freshness',  count: '1 batch (30 kg)', dot: '#B91C1C' },
    { reason: 'Size Non-Conformity',  count: '1 batch (15 kg)', dot: '#B45309' },
  ];

  const rejectionTotals = highRisk
    ? { weight: '240.00 kg', value: '118,000 RWF' }
    : { weight: '45.00 kg',  value: '22,500 RWF' };

  const history = lowConfidence ? [
    { date: '3 Apr 2026',  product: 'Sweet Potatoes', kg: '85.00', grade: 'Grade A', lead: '2.0 days', onTime: 'Yes', rejected: false },
    { date: '1 Apr 2026',  product: 'Avocados',       kg: '40.00', grade: 'Grade A', lead: '3.0 days', onTime: 'Yes', rejected: false },
  ] : highRisk ? [
    { date: '5 May 2026',  product: 'Lettuce',     kg: '40.00',  grade: 'Rejected', lead: '3.0 days', onTime: 'Late', rejected: true  },
    { date: '3 May 2026',  product: 'Tomatoes',    kg: '180.00', grade: 'Grade B',  lead: '2.5 days', onTime: 'Late', rejected: false },
    { date: '1 May 2026',  product: 'Cabbage',     kg: '60.00',  grade: 'Rejected', lead: '3.5 days', onTime: 'Late', rejected: true  },
    { date: '28 Apr 2026', product: 'Carrots',     kg: '120.00', grade: 'Grade A',  lead: '2.0 days', onTime: 'Yes',  rejected: false },
    { date: '26 Apr 2026', product: 'Green Beans', kg: '80.00',  grade: 'Grade B',  lead: '3.0 days', onTime: 'Late', rejected: false },
  ] : [
    { date: '4 Apr 2026',  product: 'Tomatoes',    kg: '150.00', grade: 'Grade A',  lead: '1.0 days', onTime: 'Yes',  rejected: false },
    { date: '3 Apr 2026',  product: 'Green Beans', kg: '75.50',  grade: 'Grade A',  lead: '0.5 days', onTime: 'Yes',  rejected: false },
    { date: '1 Apr 2026',  product: 'Lettuce',     kg: '30.00',  grade: 'Rejected', lead: '2.0 days', onTime: 'Late', rejected: true  },
    { date: '30 Mar 2026', product: 'Carrots',     kg: '200.00', grade: 'Grade B',  lead: '1.5 days', onTime: 'Yes',  rejected: false },
    { date: '28 Mar 2026', product: 'Tomatoes',    kg: '120.00', grade: 'Grade A',  lead: '1.0 days', onTime: 'Yes',  rejected: false },
  ];

  const headline = lowConfidence
    ? 'Data from 2 deliveries · Last delivery 3 Apr 2026'
    : highRisk
    ? `Data from 31 deliveries · ${grades[2].count.replace(' batches', '').replace(' (' + grades[2].pct + '%)', '')} rejected · Last delivery yesterday`
    : 'Data from 47 deliveries · Last delivery 2 hours ago';
  const totalCount = lowConfidence ? 2 : highRisk ? 31 : 47;
  const gradePeriodLabel = lowConfidence ? 'All Time' : '30d';

  const gradePill = (g) => {
    if (g === 'Grade A')  return { bg: '#EEF6F2', fg: '#117E44' };
    if (g === 'Grade B')  return { bg: '#FEF3C7', fg: '#B45309' };
    if (g === 'Rejected') return { bg: '#FDECEC', fg: '#B91C1C' };
    return { bg: '#F0F2F5', fg: '#5F6B7A' };
  };
  const otPill = (s) => s === 'Late'
    ? { bg: '#FDECEC', fg: '#B91C1C' }
    : { bg: '#EEF6F2', fg: '#117E44' };

  const valueColor = (tone) => tone === 'success' ? '#117E44' : tone === 'danger' ? '#B91C1C' : tone === 'warning' ? '#B45309' : '#0F1729';
  const subColor   = (tone) => tone === 'success' ? '#117E44' : tone === 'danger' ? '#B91C1C' : tone === 'warning' ? '#B45309' : '#8896A4';
  const iconColor  = (k) => {
    if (k.iconTone === 'warning') return '#B45309';
    if (k.valueTone === 'success') return '#1B8C4E';
    if (k.valueTone === 'danger')  return '#B91C1C';
    return '#9CA3AF';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {lowConfidence && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: 16, borderRadius: 10,
          background: '#FEF9C3', border: '1px solid rgba(180, 83, 9, .25)',
        }}>
          <i data-lucide="info" style={{ width: 20, height: 20, color: '#B45309', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#B45309' }}>
              Low confidence — based on fewer than 3 deliveries
            </div>
            <div style={{ fontSize: 13, color: '#854D0E', marginTop: 4, lineHeight: 1.55 }}>
              Metrics may not be representative of supplier performance. At least 3 completed deliveries are required before these numbers can be considered reliable for procurement decisions.
            </div>
          </div>
        </div>
      )}

      {highRisk && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: 16, borderRadius: 10,
          background: '#FDECEC', border: '1px solid #FCA5A5',
        }}>
          <i data-lucide="alert-triangle" style={{ width: 20, height: 20, color: '#B91C1C', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#B91C1C' }}>
              High-Risk Supplier — QC rejection rate exceeds 20%
            </div>
            <div style={{ fontSize: 13, color: '#1F2937', marginTop: 4, lineHeight: 1.55 }}>
              This supplier's QC rejection rate (27%) exceeds the 20% threshold over the last 30 days. Consider reviewing the commercial agreement, scheduling a quality improvement meeting, or suspending deliveries for affected product lines.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button style={{
                height: 32, padding: '0 12px', borderRadius: 8,
                background: '#B91C1C', border: 'none', color: '#fff',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <i data-lucide="calendar" style={{ width: 13, height: 13 }} />
                Schedule QC Meeting
              </button>
              <button style={{
                height: 32, padding: '0 12px', borderRadius: 8,
                background: '#fff', border: '1px solid #FCA5A5', color: '#B91C1C',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <i data-lucide="file-text" style={{ width: 13, height: 13 }} />
                Review Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Period selector + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#8896A4' }}>Period:</span>
        <div style={{ display: 'inline-flex', borderRadius: 8, border: '1px solid #E8EBE9', overflow: 'hidden', background: '#fff' }}>
          {periods.map((p, i) => {
            const active = period === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  height: 32, padding: '0 14px',
                  fontSize: 12, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
                  background: active ? '#1B8C4E' : '#fff',
                  color:      active ? '#fff'    : '#0F1729',
                  border: 'none',
                  borderLeft: i === 0 ? 'none' : '1px solid #E8EBE9',
                }}
              >{p.label}</button>
            );
          })}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8896A4' }}>
          {headline}
        </span>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map(k => (
          <Card key={k.label} padding={18} style={k.borderTone === 'danger' ? { border: '1px solid #FCA5A5', boxShadow: '0 0 0 1px rgba(185,28,28,.05)' } : undefined}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#8896A4' }}>{k.label}</div>
              <i data-lucide={k.icon} style={{ width: 14, height: 14, color: iconColor(k) }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4, color: valueColor(k.valueTone) }}>
              {k.value}
              {k.unit && <span style={{ fontSize: 14, fontWeight: 400, color: '#8896A4', marginLeft: 6 }}>{k.unit}</span>}
            </div>
            {k.pill ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 10, padding: '3px 8px', borderRadius: 4,
                fontSize: 10.5, fontWeight: 600,
                background: '#FEF3C7', color: '#B45309',
              }}>
                <i data-lucide="info" style={{ width: 11, height: 11 }} />
                {k.pill}
              </span>
            ) : (
              <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 6, color: subColor(k.subTone) }}>{k.sub}</div>
            )}
          </Card>
        ))}
      </div>

      {/* QC Grade Distribution + Rejection Reasons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding={22}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729', marginBottom: 14 }}>QC Grade Distribution ({gradePeriodLabel})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {grades.map(g => (
              <div key={g.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#1F2937' }}>{g.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: g.valueColor }}>{g.count}</span>
                </div>
                <div style={{ width: '100%', height: 10, background: '#F0F2F5', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={22}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729', marginBottom: 14 }}>Rejection Reasons ({gradePeriodLabel})</div>
          {rejections.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 8px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, background: '#EEF6F2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <i data-lucide="check-circle" style={{ width: 22, height: 22, color: '#1B8C4E' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1729' }}>No rejections recorded</div>
              <div style={{ fontSize: 12, color: '#8896A4', marginTop: 4 }}>All deliveries have passed QC inspection</div>
            </div>
          ) : (
          <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rejections.map((r, i) => (
              <div key={r.reason} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i === rejections.length - 1 ? 'none' : '1px solid #F0F2F5',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: r.dot }} />
                  <span style={{ fontSize: 13, color: '#1F2937' }}>{r.reason}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1729' }}>{r.count}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #F0F2F5', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, color: '#8896A4' }}>Total rejected weight</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#B91C1C' }}>{rejectionTotals.weight}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, color: '#8896A4' }}>Estimated loss value</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#B91C1C' }}>{rejectionTotals.value}</span>
            </div>
          </div>
          </>
          )}
        </Card>
      </div>

      {/* Delivery history table */}
      <Card padding={0}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid #F0F2F5' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1729' }}>Recent Delivery History</div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 12px', borderRadius: 8,
            background: '#fff', border: '1px solid #E8EBE9', color: '#0F1729',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter', cursor: 'pointer',
          }}>
            <i data-lucide="download" style={{ width: 13, height: 13 }} />
            Export CSV
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Date', 'Product', 'Weight (KG)', 'QC Grade', 'Lead Time', 'On Time'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 2 ? 'right' : 'left',
                  padding: '12px 22px',
                  fontSize: 11, fontWeight: 700, color: '#8896A4',
                  textTransform: 'uppercase', letterSpacing: 0.4,
                  borderBottom: '1px solid #F0F2F5',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((r, i) => {
              const gp = gradePill(r.grade);
              const op = otPill(r.onTime);
              return (
                <tr key={i} style={r.rejected ? { background: 'rgba(220,38,38,.025)' } : undefined}>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 13, color: '#0F1729' }}>{r.date}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 13, color: '#0F1729', fontWeight: 600 }}>{r.product}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 13, color: '#1F2937', textAlign: 'right', fontFamily: 'Menlo, monospace' }}>{r.kg}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '3px 9px', borderRadius: 999,
                      fontSize: 11, fontWeight: 700, background: gp.bg, color: gp.fg,
                    }}>{r.grade}</span>
                  </td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7', fontSize: 13, color: '#1F2937' }}>{r.lead}</td>
                  <td style={{ padding: '14px 22px', borderBottom: '1px solid #F5F6F7' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '3px 9px', borderRadius: 999,
                      fontSize: 11, fontWeight: 700, background: op.bg, color: op.fg,
                    }}>{r.onTime}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px' }}>
          <span style={{ fontSize: 12, color: '#8896A4' }}>Showing 5 most recent of {totalCount} deliveries</span>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', padding: 0 }}>
            View All Deliveries →
          </button>
        </div>
      </Card>
    </div>
  );
}

window.SupplierDetail = SupplierDetail;
