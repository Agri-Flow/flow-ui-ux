// Dashboard screen
function Dashboard() {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Active orders" value="142" delta="+12%" sub="vs. last week" />
        <StatCard label="Lots in transit" value="38" delta="+4" sub="across 6 routes" />
        <StatCard label="Post-harvest loss" value="6.2%" delta="−0.8pp" sub="MTD" />
        <StatCard label="On-time rate" value="94%" delta="+1.4pp" sub="rolling 30d" />
      </div>

      {/* main 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card padding={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E8EBE9' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>Recent orders</div>
              <div style={{ fontSize: 12, color: '#5F6B7A', marginTop: 2 }}>Last 7 days</div>
            </div>
            <button style={btnSecondary}>View all</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 13 }}>
            <thead>
              <tr>
                {['Order', 'Supplier', 'Quantity', 'Status', 'ETA'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 24px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', borderBottom: '1px solid #E8EBE9', background: '#F9FAFB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['#ORD-2042', 'Kigali Highland', '4.2 t maize', 'success', 'Active', 'Apr 28'],
                ['#ORD-2041', 'Rwamagana Valley', '1.8 t beans', 'warning', 'Pending', '—'],
                ['#ORD-2039', 'Huye Coffee Co.', '900 kg coffee', 'success', 'Active', 'Apr 29'],
                ['#ORD-2037', 'Musanze Dairy', '2,400 L milk', 'info', 'In review', 'Apr 27'],
                ['#ORD-2034', 'Bugesera Grain', '6.0 t sorghum', 'danger', 'Delayed', 'May 02'],
              ].map((r, i) => (
                <tr key={i}>
                  <td style={td}><span style={{ fontWeight: 600, color: '#1F2937' }}>{r[0]}</span></td>
                  <td style={td}>{r[1]}</td>
                  <td style={td}>{r[2]}</td>
                  <td style={td}><Pill tone={r[3]}>{r[4]}</Pill></td>
                  <td style={td}>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', marginBottom: 14 }}>Top suppliers · this month</div>
            {[
              ['Kigali Highland', '94%', '#1B8C4E'],
              ['Musanze Dairy', '89%', '#1B8C4E'],
              ['Rwamagana Valley', '78%', '#F59E0B'],
              ['Huye Coffee Co.', '71%', '#F59E0B'],
            ].map(([n, pct, c], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{n.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{n}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#5F6B7A', fontFamily: 'Menlo, monospace' }}>{pct}</div>
              </div>
            ))}
          </Card>
          <Card style={{ background: '#F3FAF6', borderColor: '#C8ECDA' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F5A33' }}>Reducing post-harvest food loss in Rwanda</div>
            <div style={{ fontSize: 12, color: '#117E44', marginTop: 6, lineHeight: 1.5 }}>
              You've avoided an estimated <b>11.4 t</b> of crop spoilage so far this quarter through faster lot routing.
            </div>
            <button style={{ ...btnPrimary, marginTop: 12 }}>See impact report →</button>
          </Card>
        </div>
      </div>
    </div>
  );
}

const td = { padding: '14px 24px', borderBottom: '1px solid #F0F2F5', color: '#374151', verticalAlign: 'middle' };

window.Dashboard = Dashboard;
