import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Hammer, LineChart, ClipboardList, BookOpen, LogOut, Menu, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LOGO = "/uploads/Dunrite-Logo_invert-e1758651959544.png";

const NAV = [
  { to: "/app" as const, label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/jobs" as const, label: "Jobs", icon: Hammer, exact: false },
  { to: "/app/financials" as const, label: "Financials", icon: LineChart, exact: false },
  { to: "/app/controls" as const, label: "Project Controls", icon: ClipboardList, exact: false },
  { to: "/app/documents" as const, label: "Documents", icon: BookOpen, exact: false },
];

export function AppShell({ title, eyebrow, actions, children }: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const NavItems = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to, item.exact);
        return (
          <Link
            key={item.to}
            to={item.to}
            className="nav-link focus-ring"
            data-status={active ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="app-shell">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex w-60 shrink-0 flex-col border-r"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}
        >
          <Link to="/app" className="flex items-center gap-3 px-5 py-5 focus-ring">
            <img src={LOGO} alt="Dun Rite" className="h-8 w-auto" />
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold tracking-wide">DUN RITE</div>
              <div className="kbd-label" style={{ fontSize: 10 }}>Operations</div>
            </div>
          </Link>
          <div className="divider mx-3" />
          <div className="pt-4">{NavItems}</div>
          <div className="mt-auto px-3 pb-4">
            <button onClick={signOut} className="nav-link focus-ring w-full" type="button">
              <LogOut size={16} strokeWidth={1.75} /> <span>Sign out</span>
            </button>
            <div className="px-2 pt-3 text-dim font-ui" style={{ fontSize: 11 }}>v0.1 · Internal build</div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <aside
              className="relative w-64 flex flex-col"
              style={{ background: "var(--bg-elev)", borderRight: "1px solid var(--border-soft)" }}
            >
              <div className="flex items-center justify-between px-5 py-5">
                <Link to="/app" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                  <img src={LOGO} alt="Dun Rite" className="h-8 w-auto" />
                  <span className="font-display text-sm font-semibold tracking-wide">DUN RITE</span>
                </Link>
                <button onClick={() => setOpen(false)} className="btn !p-2" aria-label="Close menu">
                  <X size={16} />
                </button>
              </div>
              <div className="divider mx-3" />
              <div className="pt-4">{NavItems}</div>
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <header
            className="sticky top-0 z-30 border-b backdrop-blur"
            style={{
              borderColor: "var(--border-soft)",
              background: "color-mix(in oklch, var(--bg) 85%, transparent)",
            }}
          >
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
              <button
                className="lg:hidden btn !p-2"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={16} />
              </button>
              <Link to="/app" className="lg:hidden flex items-center gap-2">
                <img src={LOGO} alt="Dun Rite" className="h-7 w-auto" />
              </Link>
              <div className="min-w-0 flex-1">
                {eyebrow && <div className="kbd-label">{eyebrow}</div>}
                <h1 className="font-display text-xl sm:text-2xl font-semibold truncate">{title}</h1>
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
          </header>
          <div className="px-4 sm:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AppLayoutOutlet() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
