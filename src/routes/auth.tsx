import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LOGO } from "@/lib/dashboard/brand";

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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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

  return (
    <div className="app-shell" style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <img src={LOGO} alt="Dun Rite" style={{ height: 36, width: "auto" }} />
          <div>
            <div className="kbd-label">Dun Rite OS</div>
            <div className="font-display font-semibold">Operator sign-in</div>
          </div>
        </div>
        <p className="text-muted font-ui" style={{ fontSize: 14, marginBottom: 20 }}>
          Internal access only. Sign in with your company email.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label className="kbd-label" htmlFor="em">Email</label>
          <input
            id="em" type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="focus-ring"
            style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg-elev)", border: "1px solid var(--border-soft)", color: "var(--fg)" }}
          />
          <label className="kbd-label" htmlFor="pw">Password</label>
          <input
            id="pw" type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="focus-ring"
            style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg-elev)", border: "1px solid var(--border-soft)", color: "var(--fg)" }}
          />
          {err && <div style={{ color: "var(--negative, #d97a7a)", fontSize: 13 }}>{err}</div>}
          {info && <div style={{ color: "var(--gold, #c4a35a)", fontSize: 13 }}>{info}</div>}
          <button type="submit" disabled={busy} className="btn btn-primary focus-ring" style={{ marginTop: 6 }}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div style={{ marginTop: 18, fontSize: 12 }} className="text-dim">
          Forgot password? Ask the office to reset it. <Link to="/" className="text-blue">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
