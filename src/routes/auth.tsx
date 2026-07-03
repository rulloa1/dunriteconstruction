import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LOGO } from "@/lib/dashboard/brand";
import authBg from "@/assets/auth-bg.png.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Dun Rite OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setInfo(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr(error.message);
    navigate({ to: "/app" });
  }

  async function onForgot() {
    if (!email) {
      setErr("Enter your email above, then tap 'Forgot password'.");
      return;
    }
    setResetting(true);
    setErr(null);
    setInfo(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetting(false);
    if (error) setErr(error.message);
    else setInfo("Reset link sent. Check your inbox.");
  }

  return (
    <div className="auth-shell">
      <div className="auth-frame">
        {/* LEFT — brand / context panel */}
        <aside className="auth-brand-panel" aria-hidden="true">
          <div
            className="auth-brand-image"
            style={{ backgroundImage: `url(${authBg.url})` }}
          />
          <div className="auth-brand-scrim" />
          <div className="auth-brand-grid" />

          {/* corner tick marks */}
          <span className="tick tl" />
          <span className="tick tr" />
          <span className="tick bl" />
          <span className="tick br" />

          <div className="auth-brand-inner">
            <div className="auth-brand-mark">
              <img src={LOGO} alt="" />
            </div>
            <div className="auth-brand-name font-display">
              DUN<span className="accent">·</span>RITE
            </div>
            <div className="auth-brand-rule" />
            <div className="auth-brand-sub kbd-label">
              Operations Management Portal
            </div>

            <div className="auth-brand-stats">
              <Stat label="Active jobs" value="12" />
              <Stat label="Crews" value="04" />
              <Stat label="Uptime" value="99.9" />
            </div>

            <div className="auth-brand-footline kbd-label">
              Authorized personnel only · v4.2
            </div>
          </div>
        </aside>

        {/* RIGHT — form panel */}
        <section className="auth-form-panel">
          <div className="auth-card">
            <header className="auth-card-head">
              <div className="kbd-label auth-eyebrow">DUN RITE OS</div>
              <h1 className="font-display auth-title">Operator sign-in</h1>
              <p className="auth-lede">
                Secure access for construction personnel only.
              </p>
            </header>

            <div className="auth-notice">
              <ShieldCheck size={14} />
              <span>Internal access only. Sessions are encrypted.</span>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              <Field label="Identity / Email" htmlFor="em">
                <input
                  id="em"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@dunrite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-ring auth-input"
                />
              </Field>

              <Field
                label="Access key"
                htmlFor="pw"
                aside={
                  <button
                    type="button"
                    onClick={onForgot}
                    disabled={resetting}
                    className="auth-link-btn"
                  >
                    {resetting ? "Sending…" : "Forgot?"}
                  </button>
                }
              >
                <div className="auth-pw-wrap">
                  <input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus-ring auth-input"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="auth-eye"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {err && (
                <div role="alert" className="auth-alert auth-alert-err">
                  {err}
                </div>
              )}
              {info && (
                <div role="status" className="auth-alert auth-alert-info">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="auth-submit focus-ring"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Initializing…
                  </>
                ) : (
                  <>
                    Initialize session <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-card-foot">
              <span className="text-dim">Need an account? Ask the office.</span>
              <Link to="/" className="auth-back">
                <ArrowLeft size={12} /> Back to site
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .auth-shell {
          min-height: 100svh;
          background: #070b14;
          color: var(--fg);
          display: grid;
          place-items: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-shell::before {
          content: "";
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(91,159,204,0.18) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: .35;
          pointer-events: none;
        }
        .auth-shell::after {
          content: "";
          position: absolute; inset-inline: 0; top: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #5B9FCC, transparent);
          opacity: .7;
        }

        .auth-frame {
          position: relative;
          width: 100%;
          max-width: 1120px;
          display: grid;
          grid-template-columns: 1fr;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            0 40px 120px rgba(0,0,0,.55),
            0 0 0 1px rgba(91,159,204,0.05);
        }
        @media (min-width: 960px) {
          .auth-frame { grid-template-columns: 1.05fr 1fr; min-height: 640px; }
        }

        /* ---------------- LEFT / BRAND ---------------- */
        .auth-brand-panel {
          display: none;
          position: relative;
          background: #0a0f1a;
          border-right: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
        }
        @media (min-width: 960px) { .auth-brand-panel { display: block; } }

        .auth-brand-image {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          filter: grayscale(0.55) contrast(1.05) brightness(0.55);
          opacity: 0.75;
        }
        .auth-brand-scrim {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.85) 65%, rgba(10,15,26,0.95) 100%),
            linear-gradient(90deg, rgba(10,15,26,0.6), rgba(10,15,26,0.25) 60%, rgba(10,15,26,0.85));
        }
        .auth-brand-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(91,159,204,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,159,204,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 55%, transparent 90%);
        }
        .tick { position: absolute; width: 14px; height: 14px; opacity: .5; }
        .tick.tl { top: 14px; left: 14px; border-top: 2px solid #5B9FCC; border-left: 2px solid #5B9FCC; }
        .tick.tr { top: 14px; right: 14px; border-top: 2px solid #5B9FCC; border-right: 2px solid #5B9FCC; }
        .tick.bl { bottom: 14px; left: 14px; border-bottom: 2px solid #5B9FCC; border-left: 2px solid #5B9FCC; }
        .tick.br { bottom: 14px; right: 14px; border-bottom: 2px solid #5B9FCC; border-right: 2px solid #5B9FCC; }

        .auth-brand-inner {
          position: relative;
          height: 100%;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .auth-brand-mark {
          width: 64px; height: 64px;
          border: 2px solid #5B9FCC;
          display: grid; place-items: center;
          background: rgba(91,159,204,0.08);
        }
        .auth-brand-mark img { height: 40px; width: auto; }
        .auth-brand-name {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #fff;
          text-transform: uppercase;
        }
        .auth-brand-name .accent { color: #5B9FCC; margin: 0 4px; }
        .auth-brand-rule {
          width: 56px; height: 3px;
          background: #5B9FCC;
        }
        .auth-brand-sub {
          font-size: 11px;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.55);
        }

        .auth-brand-stats {
          margin-top: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .auth-brand-footline {
          font-size: 10px;
          letter-spacing: 0.24em;
          color: rgba(255,255,255,0.35);
          margin-top: 6px;
        }

        /* ---------------- RIGHT / FORM ---------------- */
        .auth-form-panel {
          display: grid;
          place-items: center;
          padding: 40px 28px;
          background: #0f172a;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          display: grid;
          gap: 18px;
        }
        .auth-card-head { display: grid; gap: 6px; }
        .auth-eyebrow { color: #5B9FCC; letter-spacing: 0.22em; }
        .auth-title { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; color: #fff; }
        .auth-lede { font-size: 13px; color: rgba(255,255,255,0.55); margin: 0; }

        .auth-notice {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px;
          padding: 9px 11px;
          border: 1px solid rgba(91,159,204,0.25);
          background: rgba(91,159,204,0.06);
          color: rgba(255,255,255,0.7);
          border-radius: 4px;
        }
        .auth-notice svg { color: #5B9FCC; flex: none; }

        .auth-form { display: grid; gap: 14px; }
        .auth-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 4px;
          background: #070b14;
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-size: 14px;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-input:focus {
          outline: none;
          border-color: #5B9FCC;
          box-shadow: 0 0 0 3px rgba(91,159,204,0.18);
        }
        .auth-pw-wrap { position: relative; }
        .auth-eye {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          background: none; border: 0; color: rgba(255,255,255,0.5);
          cursor: pointer; padding: 6px; display: grid; place-items: center;
        }
        .auth-eye:hover { color: #5B9FCC; }

        .auth-link-btn {
          background: none; border: 0; padding: 0;
          color: #5B9FCC;
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
        }
        .auth-link-btn:hover { color: #fff; }

        .auth-alert {
          padding: 9px 11px; border-radius: 4px; font-size: 13px;
        }
        .auth-alert-err {
          color: #f1b1b1;
          background: rgba(217,122,122,0.08);
          border: 1px solid rgba(217,122,122,0.28);
        }
        .auth-alert-info {
          color: #a8d5ea;
          background: rgba(91,159,204,0.08);
          border: 1px solid rgba(91,159,204,0.28);
        }

        .auth-submit {
          margin-top: 4px;
          width: 100%;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 48px;
          background: #5B9FCC;
          color: #070b14;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 13px;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 4px 0 rgba(51,114,140,0.9);
          transition: transform .1s ease, background .15s ease, box-shadow .15s ease;
        }
        .auth-submit:hover:not(:disabled) { background: #6cb0dc; }
        .auth-submit:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 rgba(51,114,140,0.9);
        }
        .auth-submit:disabled { opacity: .7; cursor: not-allowed; }

        .auth-card-foot {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 12px;
        }
        .auth-back {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-decoration: none;
        }
        .auth-back:hover { color: #fff; }
      `}</style>
    </div>
  );
}

function Field({
  label, htmlFor, aside, children,
}: { label: string; htmlFor: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "#5B9FCC", lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 9,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}
