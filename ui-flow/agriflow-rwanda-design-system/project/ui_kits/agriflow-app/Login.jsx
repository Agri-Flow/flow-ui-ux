// Login screen — split-screen (brand panel + form) with default, invalid-credentials,
// and account-locked states. Mirrors flow-ui/ui-flow/e1-identity-access-management/e1-login.html.
function Login({ onSubmit, onForgot }) {
  const MAX_ATTEMPTS = 3;
  const [email, setEmail] = React.useState('sarah@agriflow.rw');
  const [password, setPassword] = React.useState('••••••••••');
  const [showPwd, setShowPwd] = React.useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(true);
  const [attempts, setAttempts] = React.useState(0);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const locked = attempts >= MAX_ATTEMPTS;
  const showError = attempts > 0 && !locked;
  const remaining = Math.max(MAX_ATTEMPTS - attempts, 0);

  const handleSignIn = () => {
    if (locked) return;
    // Demo wiring: any submit increments attempts so the error → locked progression is visible.
    // Empty fields are treated as the "wrong creds" path; with creds we just call onSubmit.
    if (!email.trim() || !password.trim()) {
      setAttempts(a => a + 1);
      return;
    }
    if (attempts >= MAX_ATTEMPTS - 1) {
      setAttempts(a => a + 1);
      return;
    }
    if (onSubmit) onSubmit();
    else setAttempts(a => a + 1);
  };

  const resetDemo = () => setAttempts(0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', width: '100%', minHeight: '100vh', fontFamily: 'Inter', background: '#F0F2F5' }}>
      <BrandPanel showStats={!locked && !showError} />
      <main style={{ background: '#F0F2F5', display: 'grid', placeItems: 'center', padding: 24, minWidth: 0 }}>
        {locked ? (
          <LockedState onReset={resetDemo} />
        ) : (
          <SignInForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            showPwd={showPwd} setShowPwd={setShowPwd}
            keepLoggedIn={keepLoggedIn} setKeepLoggedIn={setKeepLoggedIn}
            showError={showError} remaining={remaining}
            onSubmit={handleSignIn}
            onSSO={() => onSubmit && onSubmit()}
            onForgot={onForgot}
          />
        )}
      </main>
    </div>
  );
}

function BrandPanel({ showStats }) {
  return (
    <aside style={{
      background: '#1B8C4E', color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: 40, gap: 24,
    }}>
      {/* Logo lockup — same lockup as the sidebar (leaf PNG inside a tinted tile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box', flexShrink: 0,
        }}>
          <img src="../../assets/logo/agriflow-leaf.svg" alt="AgriFlow" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.3, color: '#fff' }}>AgriFlow</span>
      </div>

      {/* Middle block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <h1 style={{
          fontSize: 36, fontWeight: 700, lineHeight: 1.2,
          letterSpacing: -0.4, color: '#fff', margin: 0,
        }}>
          Reducing post-harvest<br />food loss in Rwanda
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#fff', maxWidth: 448, margin: 0 }}>
          A digital supply chain platform connecting farmers, warehouses, and retailers through real-time traceability, quality control, and intelligent logistics.
        </p>
        {showStats && (
          <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
            <StatBlock value="40%" label="Loss Reduced" />
            <StatBlock value="200+" label="Retail Partners" />
            <StatBlock value="24/7" label="Cold Chain" />
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#fff', margin: 0 }}>© 2026 AgriFlow Rwanda Ltd. All rights reserved.</p>
    </aside>
  );
}

function StatBlock({ value, label }) {
  return (
    <div>
      <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: '#fff', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 600, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1.2, color: '#fff' }}>{label}</p>
    </div>
  );
}

function SignInForm({ email, setEmail, password, setPassword, showPwd, setShowPwd, keepLoggedIn, setKeepLoggedIn, showError, remaining, onSubmit, onSSO, onForgot }) {
  return (
    <div style={{ width: 420, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F1729', letterSpacing: -0.3, margin: 0 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: '#5F6B7A', marginTop: 4, margin: 0, marginTop: 4 }}>Enter your credentials to access the platform</p>
      </div>

      {showError && (
        <div role="alert" style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 14px', borderRadius: 8,
          background: 'rgba(231,76,60,.05)', border: '1px solid rgba(231,76,60,.3)',
        }}>
          <i data-lucide="alert-triangle" style={{ width: 16, height: 16, color: '#E74C3C', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#E74C3C', margin: 0 }}>Invalid credentials</p>
            <p style={{ fontSize: 12, color: 'rgba(231,76,60,0.9)', margin: '2px 0 0', lineHeight: 1.4 }}>The email or password you entered is incorrect. Please try again.</p>
          </div>
        </div>
      )}

      {/* Email */}
      <FieldWrap label="Email address">
        <InputWithIcon
          icon="mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@agriflow.rw"
          error={showError}
        />
      </FieldWrap>

      {/* Password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: '#1F2937' }}>Password</label>
          <a href="#" onClick={(e) => { e.preventDefault(); if (onForgot) onForgot(); }} style={{ fontSize: 12, color: '#1B8C4E', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>Forgot password?</a>
        </div>
        <InputWithIcon
          icon="lock"
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          error={showError}
          rightSlot={
            <button type="button" onClick={() => setShowPwd(s => !s)} aria-label="Toggle password visibility"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#5F6B7A', display: 'inline-flex' }}>
              <i data-lucide={showPwd ? 'eye-off' : 'eye'} style={{ width: 16, height: 16 }} />
            </button>
          }
        />
        {showError && (
          <p style={{ fontSize: 12, color: '#E74C3C', margin: '2px 0 0' }}>
            Incorrect password. <span style={{ fontWeight: 600 }}>{remaining} attempt{remaining === 1 ? '' : 's'} remaining</span> before account lockout.
          </p>
        )}
      </div>

      {/* Keep me logged in */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#5F6B7A', cursor: 'pointer' }}>
        <input type="checkbox" checked={keepLoggedIn} onChange={e => setKeepLoggedIn(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: '#1B8C4E' }} />
        <span>Keep me logged in</span>
      </label>

      {/* Sign in */}
      <button onClick={onSubmit} style={{
        height: 40, padding: '0 16px', borderRadius: 8, border: 'none',
        background: '#1B8C4E', color: '#fff', fontWeight: 600, fontSize: 14,
        cursor: 'pointer', fontFamily: 'Inter',
        boxShadow: '0 1px 2px rgba(0,0,0,.05)',
        transition: 'opacity .15s ease',
      }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >Sign in</button>

      {!showError && (
        <>
          {/* Divider */}
          <div style={{ position: 'relative', margin: '4px 0' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', borderTop: '1px solid #E8EBE9' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{ background: '#F0F2F5', padding: '0 12px', fontSize: 12, color: '#8896A4' }}>or</span>
            </div>
          </div>

          {/* SSO */}
          <button onClick={onSSO} style={{
            height: 40, padding: '0 16px', borderRadius: 8,
            border: '1px solid #E8EBE9', background: '#fff', color: '#1F2937',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background .15s ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3FAF6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            <i data-lucide="globe" style={{ width: 16, height: 16 }} />
            Sign in with SSO
          </button>
        </>
      )}

      <p style={{ textAlign: 'center', fontSize: 12, color: '#5F6B7A', margin: 0 }}>
        Need access? <a href="#" style={{ color: '#1B8C4E', fontWeight: 600, textDecoration: 'none' }}>Contact your system administrator</a>
      </p>
    </div>
  );
}

function FieldWrap({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: '#1F2937' }}>{label}</label>
      {children}
    </div>
  );
}

function InputWithIcon({ icon, type, value, onChange, placeholder, error, rightSlot }) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? '#E74C3C' : (focused ? '#1B8C4E' : '#E8EBE9');
  const ringColor = error ? 'rgba(231,76,60,.18)' : 'rgba(27,140,78,.15)';
  return (
    <div style={{ position: 'relative' }}>
      <i data-lucide={icon} style={{
        width: 16, height: 16, color: error ? '#E74C3C' : '#5F6B7A',
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 40, padding: rightSlot ? '0 40px 0 38px' : '0 12px 0 38px',
          boxSizing: 'border-box',
          border: `1px solid ${borderColor}`, borderRadius: 8,
          background: '#fff', fontSize: 14, fontFamily: 'Inter', color: '#1F2937',
          outline: 'none',
          boxShadow: focused ? `0 0 0 3px ${ringColor}` : 'none',
          transition: 'border-color .12s ease, box-shadow .12s ease',
        }}
      />
      {rightSlot && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}

function LockedState({ onReset }) {
  return (
    <div style={{ width: 420, maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(231,76,60,.1)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i data-lucide="lock" style={{ width: 32, height: 32, color: '#E74C3C' }} />
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F1729', letterSpacing: -0.2, margin: 0 }}>Account temporarily locked</h2>
        <p style={{ fontSize: 14, color: '#5F6B7A', margin: '8px 0 0', lineHeight: 1.5, maxWidth: 384, marginLeft: 'auto', marginRight: 'auto' }}>
          Your account has been locked after 5 failed login attempts. Try again in <span style={{ fontWeight: 600, color: '#1F2937' }}>15 minutes</span> or reset your password.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: 8 }}>
        <button onClick={onReset} style={{
          height: 40, padding: '0 16px', borderRadius: 8, border: 'none',
          background: '#1B8C4E', color: '#fff', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', fontFamily: 'Inter',
          boxShadow: '0 1px 2px rgba(0,0,0,.05)',
        }}>Reset password</button>
        <button onClick={onReset} style={{
          height: 40, padding: '0 16px', borderRadius: 8,
          border: '1px solid #E8EBE9', background: '#fff', color: '#1F2937',
          fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter',
        }}>Contact administrator</button>
      </div>

      <p style={{ fontSize: 12, color: '#5F6B7A', margin: '8px 0 0', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span>This event has been logged for security purposes.</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#1B8C4E', fontWeight: 600 }}>
          <i data-lucide="shield-check" style={{ width: 12, height: 12 }} />
          Audit logged
        </span>
      </p>
    </div>
  );
}

window.Login = Login;
window.BrandPanel = BrandPanel;
window.InputWithIcon = InputWithIcon;
window.FieldWrap = FieldWrap;
