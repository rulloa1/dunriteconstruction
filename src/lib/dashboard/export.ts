// Client-only P&L export helpers. Dynamic-import jsPDF inside handlers so SSR is safe.
import {
  jobTotals,
  laborTotal,
  materialsTotal,
  subsTotal,
  equipmentTotal,
  sum,
  fmtPct,
  type Job,
  type SubLine,
  type EquipmentLine,
} from "./data";

const LOGO_URL = "/uploads/Dunrite-Logo_invert-e1758651959544.png";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "job";
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function n2(n: number) {
  return Math.round(n * 100) / 100;
}
function csvCell(v: string | number | undefined | null) {
  if (v === undefined || v === null) return "";
  const s = typeof v === "number" ? String(v) : v;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function groupBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// ────────────────────────────────────────────────────────────── CSV

export function exportJobCSV(job: Job) {
  const t = jobTotals(job);
  const cols = ["Section", "Description", "Detail 1", "Detail 2", "Qty", "Rate", "Amount"];
  const rows: (string | number)[][] = [];

  rows.push(["Dun Rite Construction Group — Job P&L"]);
  rows.push(["Job", job.name]);
  rows.push(["Client", job.client]);
  rows.push(["County", job.county]);
  rows.push(["Status", job.status]);
  rows.push(["Start date", job.startDate]);
  rows.push(["Closed date", job.closedDate ?? ""]);
  rows.push(["Generated", today()]);
  rows.push([]);
  rows.push(cols);

  rows.push(["Revenue", "Contract amount", "", "", "", "", n2(job.contractAmount)]);
  for (const c of job.changeOrders) {
    rows.push(["Revenue", `Change order — ${c.description}`, c.date, "", "", "", n2(c.amount)]);
  }
  rows.push(["Revenue", "Total Revenue", "", "", "", "", n2(t.revenue)]);
  rows.push([]);

  for (const l of job.labor) {
    rows.push(["Labor", l.worker, l.role, "", n2(l.hours), n2(l.rate), n2(l.hours * l.rate)]);
  }
  rows.push(["Labor", "Subtotal", "", "", "", "", n2(t.labor)]);
  rows.push([]);

  for (const m of job.materials) {
    rows.push(["Materials", m.item, "", m.unit, n2(m.qty), n2(m.unitCost), n2(m.qty * m.unitCost)]);
  }
  rows.push(["Materials", "Subtotal", "", "", "", "", n2(t.materials)]);
  rows.push([]);

  for (const s of job.subs) {
    rows.push(["Subcontractors", s.vendor, s.trade, "", "", "", n2(s.amount)]);
  }
  rows.push(["Subcontractors", "Subtotal", "", "", "", "", n2(t.subs)]);
  rows.push([]);

  for (const e of job.equipment) {
    rows.push(["Equipment", e.machine, e.category, "", n2(e.days), n2(e.dayRate), n2(e.days * e.dayRate)]);
  }
  rows.push(["Equipment", "Subtotal", "", "", "", "", n2(t.equipment)]);
  rows.push([]);

  rows.push(["Reconciliation", "Total Revenue", "", "", "", "", n2(t.revenue)]);
  rows.push(["Reconciliation", "Total Cost", "", "", "", "", n2(t.totalCost)]);
  rows.push(["Reconciliation", "Gross Profit", "", "", "", "", n2(t.grossProfit)]);
  rows.push(["Reconciliation", "Margin", "", "", "", "", `${(t.margin * 100).toFixed(2)}%`]);

  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `DunRite_PnL_${slug(job.name)}_${today()}.csv`);
}

// ────────────────────────────────────────────────────────────── PDF

async function loadLogoDataURL(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportJobPDF(job: Job) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = (autoTableMod as { default: (doc: unknown, opts: unknown) => void }).default;

  const t = jobTotals(job);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Brand colors
  const BLUE: [number, number, number] = [74, 130, 167]; // #4A82A7
  const GOLD: [number, number, number] = [190, 140, 50];
  const RED: [number, number, number] = [170, 60, 60];
  const INK: [number, number, number] = [25, 30, 38];
  const MUTED: [number, number, number] = [110, 120, 130];

  // ── Header band
  const bandH = 84;
  doc.setFillColor(...INK);
  doc.rect(0, 0, pageW, bandH, "F");

  const logo = await loadLogoDataURL();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", margin, 20, 120, 44, undefined, "FAST");
    } catch {
      /* ignore */
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("DUN RITE", margin, 50);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Job Profit & Loss", pageW - margin, 38, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 220, 230);
  doc.text(`Generated ${today()}`, pageW - margin, 56, { align: "right" });

  // ── Job header block
  let y = bandH + 24;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(job.name, margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const headerLine = [
    job.client,
    `${job.county} County`,
    `Status: ${job.status}`,
    `Started ${job.startDate}`,
    job.closedDate ? `Closed ${job.closedDate}` : null,
  ].filter(Boolean).join("  ·  ");
  doc.text(headerLine, margin, y);
  y += 18;

  const usd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  type Row = (string | number)[];
  const tableStyles = {
    theme: "grid" as const,
    headStyles: { fillColor: BLUE, textColor: 255, fontStyle: "bold" as const, fontSize: 10 },
    bodyStyles: { fontSize: 9, textColor: INK },
    alternateRowStyles: { fillColor: [247, 249, 252] as [number, number, number] },
    margin: { left: margin, right: margin },
    styles: { cellPadding: 5, lineColor: [225, 230, 236] as [number, number, number] },
  };

  function sectionTitle(label: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLUE);
    doc.text(label.toUpperCase(), margin, y);
    y += 6;
  }

  function drawTable(head: string[], body: Row[], subtotal: number, subtotalLabel = "Subtotal") {
    const foot: Row[] = [[
      { content: subtotalLabel, colSpan: head.length - 1, styles: { halign: "right", fontStyle: "bold" } } as unknown as string,
      { content: usd(subtotal), styles: { halign: "right", fontStyle: "bold", textColor: INK } } as unknown as string,
    ]];
    autoTable(doc, {
      ...tableStyles,
      startY: y,
      head: [head],
      body,
      foot,
      footStyles: { fillColor: [240, 244, 249], textColor: INK, fontStyle: "bold" },
      columnStyles: { [head.length - 1]: { halign: "right" } },
    });
    // @ts-expect-error lastAutoTable provided by plugin
    y = (doc.lastAutoTable?.finalY ?? y) + 18;
  }

  // ── Revenue
  sectionTitle("Revenue");
  const revBody: Row[] = [["Contract amount", "—", usd(job.contractAmount)]];
  for (const c of job.changeOrders) {
    revBody.push([`Change order — ${c.description}`, c.date, usd(c.amount)]);
  }
  drawTable(["Description", "Date", "Amount"], revBody, t.revenue, "Total Revenue");

  // ── Labor
  if (job.labor.length) {
    sectionTitle("Labor");
    const body: Row[] = job.labor.map((l) => [l.worker, l.role, l.hours, usd(l.rate), usd(l.hours * l.rate)]);
    drawTable(["Worker", "Role", "Hours", "Rate", "Amount"], body, laborTotal(job.labor));
  }

  // ── Materials
  if (job.materials.length) {
    sectionTitle("Materials");
    const body: Row[] = job.materials.map((m) => [m.item, m.unit, m.qty, usd(m.unitCost), usd(m.qty * m.unitCost)]);
    drawTable(["Item", "Unit", "Qty", "Unit cost", "Amount"], body, materialsTotal(job.materials));
  }

  // ── Subcontractors (grouped by trade)
  if (job.subs.length) {
    sectionTitle("Subcontractors");
    const grouped = groupBy(job.subs, (s: SubLine) => s.trade);
    const body: Row[] = [];
    for (const [trade, lines] of Object.entries(grouped)) {
      const tradeSubtotal = sum(lines.map((l) => l.amount));
      body.push([
        { content: `${trade} — subtotal`, colSpan: 2, styles: { fontStyle: "bold", fillColor: [240, 244, 249] } } as unknown as string,
        { content: usd(tradeSubtotal), styles: { halign: "right", fontStyle: "bold", fillColor: [240, 244, 249] } } as unknown as string,
      ]);
      for (const s of lines) body.push([s.vendor, s.trade, usd(s.amount)]);
    }
    drawTable(["Vendor", "Trade", "Amount"], body, subsTotal(job.subs));
  }

  // ── Equipment (grouped by category)
  if (job.equipment.length) {
    sectionTitle("Equipment");
    const grouped = groupBy(job.equipment, (e: EquipmentLine) => e.category);
    const body: Row[] = [];
    for (const [cat, lines] of Object.entries(grouped)) {
      const catSubtotal = sum(lines.map((l) => l.days * l.dayRate));
      body.push([
        { content: `${cat} — subtotal`, colSpan: 4, styles: { fontStyle: "bold", fillColor: [240, 244, 249] } } as unknown as string,
        { content: usd(catSubtotal), styles: { halign: "right", fontStyle: "bold", fillColor: [240, 244, 249] } } as unknown as string,
      ]);
      for (const e of lines) body.push([e.machine, e.category, e.days, usd(e.dayRate), usd(e.days * e.dayRate)]);
    }
    drawTable(["Machine", "Category", "Days", "Day rate", "Amount"], body, equipmentTotal(job.equipment));
  }

  // ── Reconciliation box
  if (y > pageH - 180) {
    doc.addPage();
    y = margin;
  }
  const boxX = margin;
  const boxY = y;
  const boxW = pageW - margin * 2;
  const boxH = 110;
  doc.setFillColor(...INK);
  doc.rect(boxX, boxY, boxW, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RECONCILIATION", boxX + 12, boxY + 17);

  doc.setDrawColor(225, 230, 236);
  doc.setFillColor(255, 255, 255);
  doc.rect(boxX, boxY + 26, boxW, boxH - 26, "FD");

  const colW = boxW / 4;
  const cellY = boxY + 44;
  const drawCell = (i: number, label: string, value: string, color: [number, number, number], big = false) => {
    const cx = boxX + colW * i + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(label, cx, cellY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(big ? 18 : 14);
    doc.setTextColor(...color);
    doc.text(value, cx, cellY + (big ? 28 : 24));
  };
  const gpColor = t.margin >= 0.08 ? GOLD : t.margin < 0 ? RED : INK;
  drawCell(0, "Revenue", usd(t.revenue), BLUE);
  drawCell(1, "− Total cost", usd(t.totalCost), INK);
  drawCell(2, "= Gross profit", usd(t.grossProfit), gpColor, true);
  drawCell(3, "Margin", fmtPct(t.margin), gpColor);

  // ── Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Dun Rite Construction Group  ·  Generated ${today()}`,
    pageW / 2,
    pageH - 20,
    { align: "center" },
  );

  doc.save(`DunRite_PnL_${slug(job.name)}_${today()}.pdf`);
}
