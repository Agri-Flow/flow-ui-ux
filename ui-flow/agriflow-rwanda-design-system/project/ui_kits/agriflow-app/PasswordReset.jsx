// Password Reset screen — mirrors Figma node 39:2 with all 5 states:
//   1. request       — enter email, send reset link
//   2. sent          — confirmation, resend / open simulated link
//   3. newPassword   — create new password with strength meter
//   4. rateLimited   — too many requests, button disabled with countdown
//   5. expired       — reset link expired, request a new one
//
// Layout mirrors Login.jsx (split-screen with BrandPanel left, centered card right).
// "Forgot password?" on Login switches to this screen; "Back to sign in" returns.

function PasswordReset({ onBackToLogin, initialEmail = '' }) {
  const MAX_REQUESTS = 3;
  const [state, setState] = React.useState('request');
  const [email, setEmail] = React.useState(initialEmail || 'jean.uwimana@agriflow.rw');
  const [requests, setRequests] = React.useState(0);

  // Create-new-password state
  const [newPwd, setNewPwd] = React.useState('');
  const [confirmPwd, setConfirmPwd] = React.useState('');
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const handleSend = () => {
    if (requests >= MAX_REQUESTS - 1) {
      setRequests(r => r + 1);
      setState('rateLimited');
      return;
    }
    setRequests(r => r + 1);
    setState('sent');
  };

  const handleRequestNewLink = () => setState('request');
  const handleResetPassword = () => {
    // simulate completion → back to login
    onBackToLogin && onBackToLogin();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', width: '100%', minHeight: '100vh', fontFamily: 'Inter', background: '#F0F2F5' }}>
      <BrandPanel showStats={state === 'request'} />
      <main style={{ background: '#F0F2F5', display: 'grid', placeItems: 'center', padding: 24, minWidth: 0 }}>
        <ResetCard
          state={state}
          email={email}
          setEmail={setEmail}
          newPwd={newPwd} setNewPwd={setNewPwd}
          confirmPwd={confirmPwd} setConfirmPwd={setConfirmPwd}
          showNew={showNew} setShowNew={setShowNew}
          showConfirm={showConfirm} setShowConfirm={setShowConfirm}
          onSend={handleSend}
          onResend={() => setState('sent')}
          onOpenSimulatedLink={() => setState('newPassword')}
          onSimulateExpired={() => setState('expired')}
          onRequestNewLink={handleRequestNewLink}
          onResetPassword={handleResetPassword}
          onBack={onBackToLogin}
        />
      </main>
    </div>
  );
}

function ResetCard(props) {
  const { state } = props;
  // Matches the Login form layout: 420px column on the page background, no card chrome.
  return (
    <div style={{ width: 420, maxWidth: '100%', fontFamily: 'Inter' }}>
      {state === 'request'     && <RequestState     {...props} />}
      {state === 'sent'        && <SentState        {...props} />}
      {state === 'newPassword' && <NewPasswordState {...props} />}
      {state === 'rateLimited' && <RateLimitedState {...props} />}
      {state === 'expired'     && <ExpiredState     {...props} />}
    </div>
  );
}

/* ---------- State 1 — request ---------- */
function RequestState({ email, setEmail, onSend, onBack }) {
  return (
    <>
      <h2 style={heading}>Reset your password</h2>
      <p style={subhead}>Enter your email address and we'll send you a secure link to reset your password.</p>

      <FieldWrap label="Email address">
        <InputWithIcon icon="mail" type="email" value={email} onChange={setEmail} placeholder="you@agriflow.rw" />
      </FieldWrap>
      <p style={helper}>We'll never share your email with third parties.</p>

      <button onClick={onSend} style={primaryBtn}>Send reset link</button>
      <BackToSignIn onBack={onBack} />
    </>
  );
}

/* ---------- State 2 — sent ---------- */
function SentState({ email, onResend, onOpenSimulatedLink, onBack }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <IconTile icon="mail" tone="success" center />
      <h2 style={{ ...heading, textAlign: 'center' }}>Check your email</h2>
      <p style={{ ...subhead, textAlign: 'center', margin: '0 0 4px' }}>We've sent a password reset link to</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', margin: '0 0 20px' }}>{email}</p>

      <div style={{ background: '#F3FAF6', border: '1px solid rgba(27,140,78,.15)', borderRadius: 8, padding: 12, fontSize: 12, color: '#1F2937', textAlign: 'left', marginBottom: 20, lineHeight: 1.5 }}>
        The link will expire in <strong>15 minutes</strong>. If you don't see the email, check your spam folder.
      </div>

      <button onClick={onResend} style={secondaryBtn}>Resend email</button>
      <button onClick={onOpenSimulatedLink} style={{ ...linkBtn, marginTop: 8 }}>
        <i data-lucide="external-link" style={{ width: 13, height: 13 }} /> Open simulated reset link
      </button>
      <BackToSignIn onBack={onBack} center />
    </div>
  );
}

/* ---------- State 3 — newPassword ---------- */
function NewPasswordState({ newPwd, setNewPwd, confirmPwd, setConfirmPwd, showNew, setShowNew, showConfirm, setShowConfirm, onResetPassword }) {
  const checks = {
    length: newPwd.length >= 8,
    upper:  /[A-Z]/.test(newPwd),
    number: /[0-9]/.test(newPwd),
    symbol: /[^A-Za-z0-9]/.test(newPwd),
  };
  const strength = Object.values(checks).filter(Boolean).length; // 0..4
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong password'][strength];
  const strengthColor = ['#E74C3C', '#E74C3C', '#F59E0B', '#3B82F6', '#1B8C4E'][strength];
  const match = confirmPwd.length > 0 && newPwd === confirmPwd;
  const canSubmit = strength >= 3 && match;

  return (
    <>
      <IconTile icon="lock" tone="success" />
      <h2 style={heading}>Create new password</h2>
      <p style={subhead}>Your new password must be different from previously used passwords.</p>

      {/* New password with strength meter */}
      <FieldWrap label="New password">
        <InputWithIcon
          icon="lock"
          type={showNew ? 'text' : 'password'}
          value={newPwd}
          onChange={setNewPwd}
          placeholder="Enter new password"
          rightSlot={
            <button type="button" onClick={() => setShowNew(s => !s)} aria-label="Toggle password visibility" style={iconBtn}>
              <i data-lucide={showNew ? 'eye-off' : 'eye'} style={{ width: 16, height: 16 }} />
            </button>
          }
        />
      </FieldWrap>

      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < strength ? strengthColor : '#E8EBE9',
            transition: 'background .15s ease',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 12, color: newPwd ? strengthColor : '#8896A4', margin: '6px 0 16px', fontWeight: newPwd ? 600 : 400 }}>
        {newPwd ? strengthLabel : 'Enter a password'}
      </p>

      {/* Confirm password */}
      <FieldWrap label="Confirm password">
        <InputWithIcon
          icon="lock"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPwd}
          onChange={setConfirmPwd}
          placeholder="Re-enter new password"
          error={confirmPwd.length > 0 && !match}
          rightSlot={
            match ? (
              <i data-lucide="check" style={{ width: 16, height: 16, color: '#1B8C4E' }} />
            ) : (
              <button type="button" onClick={() => setShowConfirm(s => !s)} aria-label="Toggle password visibility" style={iconBtn}>
                <i data-lucide={showConfirm ? 'eye-off' : 'eye'} style={{ width: 16, height: 16 }} />
              </button>
            )
          }
        />
      </FieldWrap>
      <p style={{ fontSize: 12, color: confirmPwd.length === 0 ? '#8896A4' : (match ? '#1B8C4E' : '#E74C3C'), margin: '6px 0 16px', fontWeight: confirmPwd.length > 0 ? 600 : 400 }}>
        {confirmPwd.length === 0 ? 'Re-enter the password to confirm' : (match ? 'Passwords match' : 'Passwords do not match')}
      </p>

      {/* Requirements */}
      <div style={{ background: '#F9FAFB', border: '1px solid #E8EBE9', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#1F2937', margin: '0 0 8px' }}>Password requirements:</p>
        <RequirementRow met={checks.length} label="At least 8 characters" />
        <RequirementRow met={checks.upper}  label="One uppercase letter" />
        <RequirementRow met={checks.number} label="One number" />
        <RequirementRow met={checks.symbol} label="One special character" />
      </div>

      <button onClick={onResetPassword} disabled={!canSubmit} style={{ ...primaryBtn, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
        Reset password
      </button>
    </>
  );
}

function RequirementRow({ met, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: met ? '#1B8C4E' : '#5F6B7A', marginTop: 2 }}>
      <i data-lucide={met ? 'check' : 'circle'} style={{ width: 13, height: 13, color: met ? '#1B8C4E' : '#9CA3AF' }} />
      <span>{label}</span>
    </div>
  );
}

/* ---------- State 4 — rateLimited ---------- */
function RateLimitedState({ email, setEmail, onBack }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 8, background: '#FEF9E7', border: '1px solid rgba(245,158,11,.3)', marginBottom: 20 }}>
        <i data-lucide="alert-triangle" style={{ width: 18, height: 18, color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#92400E', margin: 0 }}>Too many requests</p>
          <p style={{ fontSize: 12, color: '#92400E', margin: '4px 0 0', lineHeight: 1.5 }}>You have reached the maximum of 3 password reset requests in the last hour. Please wait before trying again.</p>
        </div>
      </div>

      <h2 style={heading}>Reset your password</h2>
      <p style={subhead}>Enter your email address and we'll send you a secure link to reset your password.</p>

      <FieldWrap label="Email address">
        <InputWithIcon icon="mail" type="email" value={email} onChange={setEmail} placeholder="you@agriflow.rw" />
      </FieldWrap>

      <button disabled style={{ ...primaryBtn, marginTop: 16, opacity: 0.5, cursor: 'not-allowed' }}>
        Send reset link (available in 47 min)
      </button>
      <BackToSignIn onBack={onBack} />
    </>
  );
}

/* ---------- State 5 — expired ---------- */
function ExpiredState({ onRequestNewLink, onBack }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <IconTile icon="clock" tone="danger" center large />
      <h2 style={{ ...heading, textAlign: 'center' }}>Reset link expired</h2>
      <p style={{ ...subhead, textAlign: 'center' }}>This password reset link has expired. Reset links are valid for 15 minutes due to security purposes.</p>

      <button onClick={onRequestNewLink} style={primaryBtn}>Request new reset link</button>
      <BackToSignIn onBack={onBack} center />
    </div>
  );
}

/* ---------- Shared bits ---------- */

function IconTile({ icon, tone = 'success', center = false, large = false }) {
  const size = large ? 56 : 48;
  const inner = large ? 28 : 24;
  const bg = tone === 'danger' ? 'rgba(231,76,60,.1)' : 'rgba(27,140,78,.1)';
  const fg = tone === 'danger' ? '#E74C3C' : '#1B8C4E';
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, background: bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: center ? '0 auto 16px' : '0 0 16px',
    }}>
      <i data-lucide={icon} style={{ width: inner, height: inner, color: fg }} />
    </div>
  );
}

function BackToSignIn({ onBack, center }) {
  return (
    <div style={{ display: 'flex', justifyContent: center ? 'center' : 'center', marginTop: 16 }}>
      <button onClick={onBack} style={linkBtn}>
        <i data-lucide="arrow-left" style={{ width: 13, height: 13 }} /> Back to sign in
      </button>
    </div>
  );
}

/* ---------- Styles ---------- */
const heading = { fontSize: 20, fontWeight: 600, color: '#0F1729', letterSpacing: -0.2, margin: '0 0 8px' };
const subhead = { fontSize: 14, color: '#5F6B7A', lineHeight: 1.5, margin: '0 0 24px' };
const helper  = { fontSize: 11, color: '#8896A4', margin: '4px 0 16px' };

const primaryBtn = {
  width: '100%', height: 40, padding: '0 16px', borderRadius: 8, border: 'none',
  background: '#1B8C4E', color: '#fff', fontWeight: 600, fontSize: 14,
  cursor: 'pointer', fontFamily: 'Inter',
  boxShadow: '0 1px 2px rgba(0,0,0,.05)',
  transition: 'opacity .15s ease',
};

const secondaryBtn = {
  width: '100%', height: 40, padding: '0 16px', borderRadius: 8,
  border: '1px solid #E8EBE9', background: '#fff', color: '#1F2937',
  fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter',
};

const linkBtn = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: '#5F6B7A', fontSize: 13, fontFamily: 'Inter', fontWeight: 500,
  display: 'inline-flex', alignItems: 'center', gap: 6,
};

const iconBtn = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: '#5F6B7A', display: 'inline-flex', padding: 0,
};

window.PasswordReset = PasswordReset;
