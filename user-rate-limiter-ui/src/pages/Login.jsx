import { useState } from "react";
import { login, initiateRegister, verifyOtp } from "../api/authApi";

// ── tiny icons as inline SVG ─────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);
const LockIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V7z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// ── reusable input ────────────────────────────────────────────────────────────
function Field({ label, icon, type = "text", value, onChange, placeholder, autoFocus }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={e => e.key === "Enter" && e.currentTarget.form?.requestSubmit()}
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: 44,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: 12,
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 10,
            color: "#f1f5f9",
            fontSize: 15,
            outline: "none",
            transition: "border-color .2s",
          }}
          onFocus={e => (e.target.style.borderColor = "#3b82f6")}
          onBlur={e => (e.target.style.borderColor = "#334155")}
        />
      </div>
    </div>
  );
}

// ── primary button ────────────────────────────────────────────────────────────
function Btn({ onClick, loading, disabled, children, variant = "blue" }) {
  const bg = variant === "emerald" ? "#10b981" : "#3b82f6";
  const hover = variant === "emerald" ? "#059669" : "#2563eb";
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "13px 0",
        background: loading || disabled ? "#1e293b" : hovered ? hover : bg,
        color: loading || disabled ? "#475569" : "#fff",
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: loading || disabled ? "not-allowed" : "pointer",
        transition: "background .2s, transform .15s",
        transform: hovered && !loading ? "scale(1.015)" : "scale(1)",
        letterSpacing: ".3px",
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

// ── alert box ─────────────────────────────────────────────────────────────────
function Alert({ msg, type = "error" }) {
  if (!msg) return null;
  const isError = type === "error";
  return (
    <div style={{
      background: isError ? "rgba(239,68,68,.1)" : "rgba(16,185,129,.1)",
      border: `1px solid ${isError ? "rgba(239,68,68,.4)" : "rgba(16,185,129,.4)"}`,
      color: isError ? "#f87171" : "#34d399",
      padding: "10px 14px",
      borderRadius: 8,
      fontSize: 13,
    }}>
      {msg}
    </div>
  );
}

// ── step indicator ────────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Email", "OTP", "Password"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: done ? "#10b981" : active ? "#3b82f6" : "#1e293b",
                border: `2px solid ${done ? "#10b981" : active ? "#3b82f6" : "#334155"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: done || active ? "#fff" : "#475569",
                transition: "all .3s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, color: active ? "#93c5fd" : done ? "#6ee7b7" : "#475569" }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 48, height: 2, marginBottom: 16,
                background: done ? "#10b981" : "#1e293b",
                transition: "background .3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── main Login page ───────────────────────────────────────────────────────────
export default function Login({ onSuccess }) {
  const [tab, setTab] = useState("login"); // "login" | "register"

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // register state
  const [regStep, setRegStep] = useState(0); // 0 = email, 1 = otp, 2 = password
  const [regEmail, setRegEmail] = useState("");
  const [regOtp, setRegOtp] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // ── login handler ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) { setLoginError("Please fill in all fields."); return; }
    try {
      setLoginLoading(true); setLoginError("");
      const res = await login(loginEmail, loginPassword);
      localStorage.setItem("token", res.data.token);
      onSuccess();
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── register step 1: send OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!regEmail) { setRegError("Please enter your email."); return; }
    if (!/\S+@\S+\.\S+/.test(regEmail)) { setRegError("Enter a valid email address."); return; }
    try {
      setRegLoading(true); setRegError(""); setRegSuccess("");
      await initiateRegister(regEmail);
      setRegSuccess("OTP sent! Check your inbox.");
      setRegStep(1);
    } catch (err) {
      setRegError(err.response?.data?.error || "Failed to send OTP. Try again.");
    } finally {
      setRegLoading(false);
    }
  };

  // ── register step 2: verify OTP ───────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!regOtp || regOtp.length !== 6) { setRegError("Enter the 6-digit OTP."); return; }
    // just advance — actual verification happens with the password in step 3
    setRegError("");
    setRegStep(2);
  };

  // ── register step 3: create account ──────────────────────────────────────
  const handleCreateAccount = async () => {
    if (!regPassword) { setRegError("Please enter a password."); return; }
    if (regPassword.length < 6) { setRegError("Password must be at least 6 characters."); return; }
    if (regPassword !== regConfirm) { setRegError("Passwords do not match."); return; }
    try {
      setRegLoading(true); setRegError("");
      const res = await verifyOtp(regEmail, regOtp, regPassword);
      localStorage.setItem("token", res.data.token);
      onSuccess();
    } catch (err) {
      setRegError(err.response?.data?.error || "Invalid or expired OTP. Please start over.");
      if (err.response?.data?.error?.toLowerCase().includes("otp")) {
        setRegStep(0); // restart if OTP itself is bad
      }
    } finally {
      setRegLoading(false);
    }
  };

  // ── tab toggle ─────────────────────────────────────────────────────────────
  const switchTab = (t) => {
    setTab(t);
    setLoginError(""); setRegError(""); setRegSuccess("");
    setRegStep(0); setRegEmail(""); setRegOtp(""); setRegPassword(""); setRegConfirm("");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      padding: 16, fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* background glow */}
      <div style={{ position: "fixed", top: "20%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,.06)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "20%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(16,185,129,.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{
        background: "rgba(15,23,42,.95)",
        border: "1px solid #1e293b",
        borderRadius: 20,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 440,
        boxShadow: "0 25px 60px rgba(0,0,0,.5)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #1e3a5f, #14532d)",
            borderRadius: 12, padding: "8px 16px", marginBottom: 12,
          }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              FlowGate
            </span>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>API Rate Limiting Platform</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#0f172a", borderRadius: 10, padding: 4, marginBottom: 28, border: "1px solid #1e293b" }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer",
              background: tab === t ? (t === "login" ? "#3b82f6" : "#10b981") : "transparent",
              color: tab === t ? "#fff" : "#64748b",
              fontWeight: 600, fontSize: 14, transition: "all .25s",
              textTransform: "capitalize",
            }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ─────────────────────────────────────────────────────── */}
        {tab === "login" && (
          <form onSubmit={e => { e.preventDefault(); handleLogin(); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>Welcome back</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Sign in to manage your APIs</p>
            </div>

            <Alert msg={loginError} />

            <Field label="Email" icon={<MailIcon />} type="email" value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)} placeholder="name@company.com" autoFocus />
            <Field label="Password" icon={<LockIcon />} type="password" value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />

            <Btn onClick={handleLogin} loading={loginLoading}>Sign In</Btn>

            <p style={{ textAlign: "center", fontSize: 13, color: "#475569", margin: 0 }}>
              Don't have an account?{" "}
              <button onClick={() => switchTab("register")} type="button"
                style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                Register
              </button>
            </p>
          </form>
        )}

        {/* ── REGISTER FORM ──────────────────────────────────────────────────── */}
        {tab === "register" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>Create account</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Verify your email to get started</p>
            </div>

            <Steps current={regStep} />

            <Alert msg={regError} />
            <Alert msg={regSuccess} type="success" />

            {/* Step 0 – Email */}
            {regStep === 0 && (
              <form onSubmit={e => { e.preventDefault(); handleSendOtp(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Email address" icon={<MailIcon />} type="email" value={regEmail}
                  onChange={e => setRegEmail(e.target.value)} placeholder="name@company.com" autoFocus />
                <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
                  We'll send a 6-digit verification code to this email.
                </p>
                <Btn onClick={handleSendOtp} loading={regLoading}>Send OTP</Btn>
              </form>
            )}

            {/* Step 1 – OTP */}
            {regStep === 1 && (
              <form onSubmit={e => { e.preventDefault(); handleVerifyOtp(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#93c5fd" }}>
                  Code sent to <strong>{regEmail}</strong>
                </div>
                <Field label="6-digit OTP" icon={<ShieldIcon />} value={regOtp}
                  onChange={e => setRegOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456" autoFocus />
                <Btn onClick={handleVerifyOtp} variant="emerald">Verify OTP</Btn>
                <button onClick={() => { setRegStep(0); setRegOtp(""); setRegError(""); setRegSuccess(""); }}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13 }}>
                  ← Use a different email
                </button>
              </form>
            )}

            {/* Step 2 – Password */}
            {regStep === 2 && (
              <form onSubmit={e => { e.preventDefault(); handleCreateAccount(); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#6ee7b7" }}>
                  ✓ OTP verified for <strong>{regEmail}</strong>
                </div>
                <Field label="Create password" icon={<LockIcon />} type="password"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min. 6 characters" autoFocus />
                <Field label="Confirm password" icon={<LockIcon />} type="password"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                  placeholder="Repeat password" />
                <Btn onClick={handleCreateAccount} loading={regLoading} variant="emerald">Create Account</Btn>
              </form>
            )}

            <p style={{ textAlign: "center", fontSize: 13, color: "#475569", margin: 0 }}>
              Already have an account?{" "}
              <button onClick={() => switchTab("login")}
                style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
