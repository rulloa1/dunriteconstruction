import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/controls/primitives";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <div className="mb-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && <div className="kbd-label mb-1">{eyebrow}</div>}
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && <div className="text-muted mt-1 text-sm">{subtitle}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
