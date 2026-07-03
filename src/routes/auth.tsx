import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
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
    if (error) {
      setErr(error.message);
      return;
    }
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
      redirectTo: `${window.location.origin}/auth`,
    });
    setResetting(false);
    if (error) setErr(error.message);
    else setInfo("Reset link sent. Check your inbox.");
  }

  return (
    <div
      className="app-shell"
      style={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "1fr",
        backgroundImage:
          "linear-gradient(180deg, rgba(10,14,20,0.72) 0%, rgba(10,14,20,0.55) 45%, rgba(10,14,20,0.85) 100%)," +
          `url(${authBg.url})`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundAttachment: "fixed, fixed",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          minHeight: "100svh",
        }}
        className="auth-grid"
      >
        {/* Form panel */}
        <section
          className="auth-form-panel"
          style={{
            display: "grid",
            placeItems: "center",
            padding: "32px 20px",
          }}
        >
          <div className="card auth-card" style={{ width: "100%", maxWidth: 420, padding: "36px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <img src={LOGO} alt="Dun Rite" style={{ height: 38, width: "auto" }} />
              <div>
                <div className="kbd-label">Dun Rite OS</div>
                <div className="font-display font-semibold" style={{ fontSize: 16 }}>Operator sign-in</div>
              </div>
            </div>

            <div
              className="text-muted font-ui"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 12, padding: "8px 10px", marginBottom: 18,
                border: "1px solid var(--border-soft)", borderRadius: 8,
                background: "color-mix(in oklch, var(--bg-elev) 70%, transparent)",
              }}
            >
              <ShieldCheck size={14} style={{ color: "var(--blue, #5B9FCC)" }} />
              <span>Internal access only. Sessions are encrypted.</span>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
              <Field label="Email" htmlFor="em">
                <input
                  id="em"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@dunrite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-ring auth-input"
                />
              </Field>

              <Field
                label="Password"
                htmlFor="pw"
                aside={
                  <button
                    type="button"
                    onClick={onForgot}
                    disabled={resetting}
                    className="text-blue"
                    style={{ fontSize: 11, background: "none", border: 0, cursor: "pointer", padding: 0 }}
                  >
                    {resetting ? "Sending…" : "Forgot password?"}
                  </button>
                }
              >
                <div style={{ position: "relative" }}>
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
                    style={{
                      position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: 0, color: "var(--text-muted)", cursor: "pointer",
                      padding: 6, display: "grid", placeItems: "center",
                    }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {err && (
                <div
                  role="alert"
                  style={{
                    color: "#f1b1b1",
                    background: "rgba(217,122,122,0.08)",
                    border: "1px solid rgba(217,122,122,0.28)",
                    padding: "8px 10px", borderRadius: 8, fontSize: 13,
                  }}
                >
                  {err}
                </div>
              )}
              {info && (
                <div
                  role="status"
                  style={{
                    color: "#e7cf9c",
                    background: "rgba(196,163,90,0.08)",
                    border: "1px solid rgba(196,163,90,0.28)",
                    padding: "8px 10px", borderRadius: 8, fontSize: 13,
                  }}
                >
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary focus-ring"
                style={{
                  marginTop: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 44, fontWeight: 600,
                }}
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="divider" style={{ margin: "20px 0 14px" }} />
            <div className="text-dim" style={{ fontSize: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Need an account? Ask the office.</span>
              <Link to="/" className="text-blue">← Back to site</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .auth-grid { grid-template-columns: 1.05fr 1fr !important; }
          .auth-brand { display: flex !important; }
        }
        .auth-input {
          width: 100%;
          padding: 11px 12px;
          border-radius: 8px;
          background: var(--bg-elev);
          border: 1px solid var(--border-soft);
          color: var(--fg);
          font-size: 14px;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .auth-input::placeholder { color: var(--text-dim, #6c7886); }
        .auth-input:focus {
          outline: none;
          border-color: var(--blue, #5B9FCC);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--blue, #5B9FCC) 25%, transparent);
        }
        .auth-card {
          backdrop-filter: blur(8px);
          box-shadow: 0 24px 72px rgba(0,0,0,.35);
        }
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
        <label className="kbd-label" htmlFor={htmlFor}>{label}</label>
        {aside}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 600, color: "var(--blue, #5B9FCC)" }}>{value}</div>
      <div className="kbd-label" style={{ fontSize: 10 }}>{label}</div>
    </div>
  );
}
