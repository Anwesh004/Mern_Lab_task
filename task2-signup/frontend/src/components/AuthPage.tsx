// @ts-nocheck
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sprout,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");


function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "Add a password" };

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Getting started", "Fair", "Good", "Strong"];

  return { score, label: labels[score] };
}

export default function AuthPage() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const isSignup = mode === "signup";
  const strength = getPasswordStrength(password);

  function switchMode() {
    setMode(isSignup ? "login" : "signup");
    setNotice(null);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmation(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNotice({ type: "error", text: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setNotice({ type: "error", text: "Your password must contain at least 8 characters." });
      return;
    }
    if (password.length > 128) {
      setNotice({ type: "error", text: "Your password must be 128 characters or fewer." });
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setNotice({ type: "error", text: "Those passwords don’t match. Please check and try again." });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to complete your request.");
      }

      if (isSignup) {
        setNotice({ type: "success", text: "Your account is ready. Welcome aboard!" });
      } else {
        setUser(data.user || { email: normalizedEmail });
        setNotice({ type: "success", text: "You’re signed in. Welcome back!" });
      }
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof TypeError
        ? "Couldn’t reach the account service. Check that the MongoDB backend is running."
        : error.message;
      setNotice({ type: "error", text: message });
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setUser(null);
    setNotice(null);
  }

  return (
    <main className="auth-page">
      <div className="background-grid" aria-hidden="true" />
      <div className="ambient-glow glow-left" aria-hidden="true" />
      <div className="ambient-glow glow-right" aria-hidden="true" />
      <div className="liquid-blob blob-a" aria-hidden="true" />
      <div className="liquid-blob blob-b" aria-hidden="true" />
      <div className="liquid-blob blob-c" aria-hidden="true" />

      <header className="topbar">
        <div className="portal-mark" aria-hidden="true"><Sprout size={18} strokeWidth={1.8} /></div>
        <span className="portal-name">ACCOUNT PORTAL</span>
        <div className="secure-label"><LockKeyhole size={14} /> <span>Private and secure</span></div>
      </header>

      <div className="auth-layout">
        <section className="story-panel" aria-label="Welcome">
          <div className="story-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> A SPACE OF YOUR OWN</p>
            <h1>Make room for<br />what’s <span>next.</span></h1>
            <p className="story-description">
              Create your account to get started. It only takes a moment.
            </p>
          </div>

          <div className="orbit-scene" aria-hidden="true">
            <svg className="scene-graphic" viewBox="0 0 500 310" focusable="false">
              <defs>
                <radialGradient id="orbit-glow">
                  <stop offset="0%" stopColor="#b5cda7" stopOpacity=".55" />
                  <stop offset="100%" stopColor="#f4f3ed" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#68896b" stopOpacity=".55" />
                  <stop offset="100%" stopColor="#b69a63" stopOpacity=".4" />
                </linearGradient>
              </defs>
              <circle className="graphic-halo" cx="250" cy="155" r="126" fill="url(#orbit-glow)" />
              <ellipse className="graphic-ring ring-one" cx="250" cy="155" rx="170" ry="91" transform="rotate(-21 250 155)" />
              <ellipse className="graphic-ring ring-two" cx="250" cy="155" rx="143" ry="118" transform="rotate(27 250 155)" />
              <ellipse className="graphic-ring ring-three" cx="250" cy="155" rx="108" ry="58" transform="rotate(-8 250 155)" />
              <path className="graphic-orbit-dash" d="M83 162 C131 72 224 56 311 76 C382 92 422 139 417 181" />
              <path className="graphic-trace" d="M91 212 C153 248 222 257 283 240 C332 227 365 205 391 175" />
              <g className="graphic-satellite satellite-one">
                <circle cx="407" cy="113" r="8" />
                <circle className="satellite-core" cx="407" cy="113" r="3" />
              </g>
              <g className="graphic-satellite satellite-two">
                <circle cx="112" cy="190" r="6" />
                <circle className="satellite-core" cx="112" cy="190" r="2.5" />
              </g>
              <circle className="graphic-star star-one" cx="158" cy="84" r="2.5" />
              <circle className="graphic-star star-two" cx="353" cy="224" r="2" />
              <circle className="graphic-star star-three" cx="326" cy="64" r="1.8" />
            </svg>
            <div className="orbit-center"><Sprout size={29} strokeWidth={1.5} /></div>
            <div className="float-card float-card-top"><span className="float-icon"><CheckCircle2 size={15} /></span><span>Made for you</span></div>
            <div className="float-card float-card-bottom"><span className="signal-dot" /><span>Ready when you are</span></div>
          </div>

          <div className="story-footnote"><span className="footnote-rule" /> One simple step to begin.</div>
        </section>

        <div className="form-card-wrap">
          <span className="drop-impact" aria-hidden="true" />
          <span className="drop-ring" aria-hidden="true" />
          <span className="drop-ring r2" aria-hidden="true" />
        <section className="form-card" aria-labelledby="form-title">
          <span className="glass-caustic" aria-hidden="true" />
          <span className="glass-rim" aria-hidden="true" />
          <div className="form-card-topline">
            <span className="form-kicker">{isSignup ? "GET STARTED" : "WELCOME BACK"}</span>
            <span className="secure-badge"><LockKeyhole size={12} /> SECURE ACCESS</span>
          </div>
          <div className="heading-block" key={mode}>
            <h2 id="form-title">{isSignup ? "Create your account" : "Good to see you"}</h2>
            <p>{isSignup ? "A few details, then you’re on your way." : "Sign in to pick up where you left off."}</p>
          </div>

          {user ? (
            <div className="auth-form">
              <div className="notice success" role="status"><CheckCircle2 size={18} /><span>Signed in as {user.email}</span></div>
              <button className="submit-button" type="button" onClick={signOut}><span>Sign out</span></button>
            </div>
          ) : (<>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="field" htmlFor="email">
              <span className="field-label">Email address</span>
              <span className="input-shell">
                <Mail className="input-icon" size={17} strokeWidth={1.8} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setNotice(null); }}
                  required
                  maxLength={254}
                  aria-label="Email address"
                />
              </span>
            </label>

            <label className="field" htmlFor="password">
              <span className="field-label">Password</span>
              <span className="input-shell">
                <LockKeyhole className="input-icon" size={17} strokeWidth={1.8} aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setNotice(null); }}
                  required
                  minLength={8}
                  maxLength={128}
                  aria-label="Password"
                />
                <button
                  className="visibility-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {isSignup && (
              <div className="strength-meter" aria-live="polite">
                <div className="strength-heading"><span>Password strength</span><span className={`strength-label strength-${strength.score}`}>{strength.label}</span></div>
                <div className="strength-bars" aria-hidden="true">
                  {[1, 2, 3, 4].map((bar) => <span className={bar <= strength.score ? `filled strength-${strength.score}` : ""} key={bar} />)}
                </div>
              </div>
            )}

            {isSignup && (
              <label className="field confirm-field" htmlFor="confirm-password">
                <span className="field-label">Confirm password</span>
                <span className="input-shell">
                  <LockKeyhole className="input-icon" size={17} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="confirm-password"
                    type={showConfirmation ? "text" : "password"}
                    name="confirm-password"
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(event) => { setConfirmPassword(event.target.value); setNotice(null); }}
                    required
                    maxLength={128}
                    aria-label="Confirm password"
                  />
                  <button
                    className="visibility-toggle"
                    type="button"
                    onClick={() => setShowConfirmation(!showConfirmation)}
                    aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmation}
                  >
                    {showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            )}

            <button className="submit-button" type="submit" disabled={busy}>
              {busy ? <span className="loading-spinner" aria-hidden="true" /> : null}
              <span>{busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</span>
              {!busy && <ArrowRight size={17} className="button-arrow" />}
            </button>
          </form>

          {notice && (
            <div className={`notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"} aria-live="polite">
              {notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{notice.text}</span>
            </div>
          )}

          <p className="mode-switch">
            {isSignup ? "Already have an account?" : "New around here?"}
            <button className="text-link" type="button" onClick={switchMode}>
              {isSignup ? "Sign in" : "Create an account"} <ArrowRight size={15} />
            </button>
          </p>
          </>)}
          <p className="terms">By continuing, you agree to our <span>Terms</span> and <span>Privacy Policy</span>.</p>
        </section>
        </div>
      </div>

      <footer className="page-footer"><span>BUILT AROUND YOU</span><span className="footer-dot" /><span>HERE WHEN YOU NEED IT</span></footer>
    </main>
  );
}
