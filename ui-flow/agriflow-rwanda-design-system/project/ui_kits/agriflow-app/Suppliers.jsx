// Supplier Directory screen
// Reference: brief screenshot — stat row, search/filter card, suppliers table with RICA status.

function Suppliers({ onOpenSupplier } = {}) {
  const stats = [
    { label: 'Total Suppliers', value: '24', sub: '+3 this month', subTone: 'success', icon: 'truck' },
    { label: 'Active',          value: '21', sub: '87.5% of total',                    icon: 'check-circle' },
    { label: 'Suspended',       value: '3',  sub: '12.5% of total', subTone: 'danger', icon: 'ban' },
    { label: 'High Risk',       value: '2',  sub: 'QC rejection > 20%', subTone: 'warning', icon: 'alert-triangle' },
  ];

  const suppliers = [
    { initials: 'UF', avatar: '#1B8C4E', name: 'Uwimana Farms',         phone: '+250 788 123 456', location: 'Musanze', rica: ['Valid',   'Exp: Dec 2026', 'success'], products: '8 SKUs',  qc: ['96%', '4% rejection', 'success'],  status: 'Active',     contract: 'View',         action: true },
    { initials: 'KA', avatar: '#F59E0B', name: 'Karangwa Aggregators', phone: '+250 788 887 654', location: 'Kigali',  rica: ['Expiring','Exp: May 2026', 'warning'], products: '12 SKUs', qc: ['73%', '27% rejection', 'danger'],  status: 'Active',     contract: 'View',         action: true, highRisk: true },
    { initials: 'MH', avatar: '#3B82F6', name: 'Muhire Horticulture',   phone: '+250 782 555 123', location: 'Huye',    rica: ['Valid',   'Exp: Mar 2027', 'success'], products: '5 SKUs',  qc: ['99%', '1% rejection', 'success'],  status: 'Active',     contract: 'View',         action: true },
    { initials: 'HF', avatar: '#8B5CF6', name: 'Habimana Fresh Foods',  phone: '+250 783 991 204', location: 'Rusizi',  rica: ['Valid',   'Exp: Jul 2027', 'success'], products: '2 SKUs',  qc: ['100%', '2 deliveries', 'muted'],   status: 'Active',     contract: 'View',         action: true, lowConfidence: true },
    { initials: 'NS', avatar: '#9CA3AF', name: 'Nyiranzega Seeds Co.', phone: '+250 788 222 333', location: 'Rubavu',  rica: ['Expired', 'Exp: Jan 2026', 'danger'],  products: '3 SKUs',  qc: ['—',   'No data', 'muted'],          status: 'Suspended',  contract: 'No contract', action: true, muted: true },
    { initials: 'IG', avatar: '#10B981', name: 'Ingabo Green Produce', phone: '+250 785 444 567', location: 'Kigali',  rica: ['Valid',   'Exp: Sep 2027', 'success'], products: '0 SKUs',  qc: ['—',   'New supplier', 'muted'],     status: 'Active',     contract: 'View',         action: true },
  ];

  const [statusFilter, setStatusFilter] = React.useState('All Statuses');
  const [locationFilter, setLocationFilter] = React.useState('All Locations');
  const [ricaFilter, setRicaFilter] = React.useState('All RICA Status');
  const [openRow, setOpenRow] = React.useState(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);

  React.useEffect(() => {
    const onClick = () => setOpenRow(null);
    if (openRow !== null) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openRow]);

  const ricaStyles = {
    success: { bg: '#EEF6F2', fg: '#117E44' },
    warning: { bg: '#FEF9C3', fg: '#854D0E' },
    danger:  { bg: '#FEE2E2', fg: '#B91C1C' },
  };
  const qcColor = { success: '#117E44', danger: '#B91C1C', muted: '#9CA3AF' };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Inter' }} data-screen-label="suppliers">
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3 }}>Supplier Directory</div>
          <div style={{ fontSize: 13, color: '#5F6B7A', marginTop: 4 }}>Manage your verified supplier network and track performance</div>
        </div>
        <button
          onClick={() => setRegisterOpen(true)}
          style={{ ...btnPrimary, padding: '10px 18px', borderRadius: 999 }}
        >
          <i data-lucide="plus" style={{ width: 14, height: 14 }} /> Register Supplier
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
            {s.sub && (
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: s.subTone === 'success' ? '#117E44' : s.subTone === 'danger' ? '#B91C1C' : s.subTone === 'warning' ? '#B45309' : '#8896A4' }}>{s.sub}</div>
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
              <span>Search suppliers by name, location, or contact…</span>
            </div>
          </Field>
          <Field label="Status">
            <Select value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Active', 'Suspended', 'Pending']} />
          </Field>
          <Field label="Location">
            <Select value={locationFilter} onChange={setLocationFilter} options={['All Locations', 'Kigali', 'Musanze', 'Huye', 'Rubavu']} />
          </Field>
          <Field label="RICA Status">
            <Select value={ricaFilter} onChange={setRicaFilter} options={['All RICA Status', 'Valid', 'Expiring', 'Expired']} />
          </Field>
          <button style={{ ...btnPrimary, padding: '9px 18px' }}>Apply</button>
          <button style={{ background: 'transparent', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '9px 6px' }}>Clear</button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 12, color: '#5F6B7A' }}>
          <span style={{ fontWeight: 600 }}>Active filters:</span>
          <FilterChip label="Active" onClose={() => setStatusFilter('All Statuses')} />
          <FilterChip label="Kigali" onClose={() => setLocationFilter('All Locations')} />
          <span style={{ color: '#D0D5DD' }}>|</span>
          <span>24 suppliers found</span>
        </div>
      </Card>

      {/* Suppliers table */}
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
          <colgroup>
            <col /><col /><col /><col /><col /><col /><col />
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              {['Supplier', 'Location', 'RICA Status', 'Products', 'QC Rate', 'Status', 'Contract', ''].map((h, i) => (
                <th key={i} style={{ textAlign: i === 6 ? 'right' : i === 7 ? 'center' : 'left', padding: i === 7 ? '14px 14px 14px 0' : i === 6 ? '14px 8px 14px 22px' : '14px 22px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => {
              const rs = ricaStyles[s.rica[2]] || ricaStyles.success;
              const statusTone = s.status === 'Active' ? 'success' : s.status === 'Suspended' ? 'danger' : 'warning';
              return (
                <tr key={i} style={{ borderBottom: i < suppliers.length - 1 ? '1px solid #F0F2F5' : 'none', opacity: s.muted ? 0.7 : 1 }}>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: s.avatar, color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.initials}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, color: '#1F2937' }}>{s.name}</span>
                          {s.highRisk && <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#FEE2E2', color: '#B91C1C' }}>High Risk</span>}
                          {s.lowConfidence && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#B45309', letterSpacing: 0.3 }}><i data-lucide="info" style={{ width: 9, height: 9 }} />Low Confidence</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Menlo, monospace' }}>{s.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{s.location}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: rs.bg, color: rs.fg }}>{s.rica[0]}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{s.rica[1]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', color: '#5F6B7A' }}>{s.products}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontWeight: 700, color: qcColor[s.qc[2]] }}>{s.qc[0]}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.qc[1]}</div>
                  </td>
                  <td style={{ padding: '14px 22px' }}><Pill tone={statusTone}>{s.status}</Pill></td>
                  <td style={{ padding: '14px 8px 14px 22px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {s.contract === 'No contract'
                      ? <span style={{ color: '#9CA3AF', fontSize: 12.5 }}>No contract</span>
                      : <button style={{ background: 'none', border: 'none', color: '#1B8C4E', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: 0 }}>
                          <i data-lucide="file-text" style={{ width: 13, height: 13 }} /> View
                        </button>}
                  </td>
                  <td style={{ padding: '14px 14px 14px 0', textAlign: 'center', width: 44, position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenRow(openRow === i ? null : i); }}
                      style={{ background: openRow === i ? '#F0F2F5' : 'transparent', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'inline-flex' }}
                      aria-label="Row actions"
                    >
                      <i data-lucide="more-vertical" style={{ width: 16, height: 16, color: '#5F6B7A' }} />
                    </button>
                    {openRow === i && (
                      <SupplierActionsMenu supplier={s} onPick={(id) => {
                        setOpenRow(null);
                        if (id === 'suspend' || id === 'reinstate') return; // placeholder — destructive flow not wired in this kit
                        if (onOpenSupplier) onOpenSupplier(s, id);
                      }} />
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
            Showing <span style={{ fontWeight: 700, color: '#1F2937' }}>1-5</span> of <span style={{ fontWeight: 700, color: '#1F2937' }}>24</span> suppliers
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
        <span>All supplier changes are recorded in the audit log (5-year retention per Rwanda FDA).</span>
      </div>

      {/* Register Supplier slide-over */}
      <RegisterSupplierForm
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onCreate={() => setRegisterOpen(false)}
      />
    </div>
  );
}

window.Suppliers = Suppliers;

function SupplierActionsMenu({ supplier, onPick }) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, []);
  const items = [
    { id: 'overview',  label: 'Overview',   sub: 'Profile, contacts, regions',    icon: 'building-2' },
    { id: 'documents', label: 'Documents',  sub: 'RICA, contracts, certificates', icon: 'folder-open' },
    { id: 'scorecard', label: 'Scorecard',  sub: 'On-time, QC rate, score',       icon: 'gauge' },
    { id: 'pricebook', label: 'Price Book', sub: 'Negotiated SKU prices',         icon: 'tag' },
  ];
  const isSuspended = supplier && supplier.status === 'Suspended';
  const danger = isSuspended
    ? { id: 'reinstate', label: 'Reinstate', sub: 'Restore supplier & visibility', icon: 'rotate-ccw', danger: false, separator: true }
    : { id: 'suspend',   label: 'Suspend',   sub: 'Soft-disable supplier',          icon: 'ban',         danger: true,  separator: true };

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
      {items.map(it => <SupplierMenuItem key={it.id} item={it} onPick={onPick} />)}
      <SupplierMenuItem item={danger} onPick={onPick} />
    </div>
  );
}

function SupplierMenuItem({ item, onPick }) {
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
