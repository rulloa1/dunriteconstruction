// Inspections — Longleaf Amenity Center
export type InspectionStatus = "scheduled" | "passed" | "failed" | "pending";
export type ChecklistResult = "pass" | "fail" | "na";

export interface ChecklistRow {
  item: string;
  result: ChecklistResult;
  note?: string;
}
export interface Inspection {
  id: string;
  number: string;
  title: string;
  type: string;
  date: string; // ISO
  inspector: string;
  location: string;
  status: InspectionStatus;
  checklist: ChecklistRow[];
}

export const INSPECTIONS: Inspection[] = [
  {
    id: "i1", number: "INSP-001", title: "Footing Inspection — South Wing", type: "Footing",
    date: "2025-05-12", inspector: "Flagler County — R. Ostrow", location: "South Wing Foundations",
    status: "passed",
    checklist: [
      { item: "Excavation depth meets plans", result: "pass" },
      { item: "Rebar size & spacing", result: "pass" },
      { item: "Clear cover verified", result: "pass" },
      { item: "Forms plumb & braced", result: "pass" },
    ],
  },
  {
    id: "i2", number: "INSP-002", title: "Slab on Grade — Main Floor", type: "Slab",
    date: "2025-07-22", inspector: "Flagler County — R. Ostrow", location: "Main Pad",
    status: "passed",
    checklist: [
      { item: "Vapor barrier continuous & sealed", result: "pass" },
      { item: "Mesh / dowels placed", result: "pass" },
      { item: "Embedded plumbing protected", result: "pass" },
      { item: "Termite treatment applied", result: "pass", note: "Abaco Pest — green tag posted." },
    ],
  },
  {
    id: "i3", number: "INSP-003", title: "Framing Inspection — Level 1", type: "Framing",
    date: "2025-09-30", inspector: "Flagler County — K. Sayers", location: "Level 1, South Wing",
    status: "passed",
    checklist: [
      { item: "Stud spacing per plan", result: "pass" },
      { item: "Headers / king studs", result: "pass" },
      { item: "Shear wall nailing pattern", result: "pass" },
      { item: "Fire blocking at penetrations", result: "pass" },
    ],
  },
  {
    id: "i4", number: "INSP-004", title: "Electrical Rough-In — Level 1", type: "Electrical Rough-In",
    date: "2025-12-05", inspector: "Flagler County — D. Markham", location: "Level 1",
    status: "failed",
    checklist: [
      { item: "Box fill calculations", result: "pass" },
      { item: "AFCI / GFCI per code", result: "fail", note: "Counter circuits in catering pantry missing AFCI." },
      { item: "Grounding & bonding", result: "pass" },
      { item: "Cable support spacing", result: "fail", note: "NM staples missing within 8\" of box at 4 locations." },
      { item: "Panel directory complete", result: "na" },
    ],
  },
  {
    id: "i5", number: "INSP-005", title: "Electrical Rough-In — Re-Inspection", type: "Electrical Rough-In",
    date: "2025-12-15", inspector: "Flagler County — D. Markham", location: "Level 1",
    status: "passed",
    checklist: [
      { item: "AFCI installed on pantry counter circuits", result: "pass" },
      { item: "All NM properly supported", result: "pass" },
      { item: "Grounding & bonding re-verified", result: "pass" },
    ],
  },
  {
    id: "i6", number: "INSP-006", title: "Plumbing Rough-In — Level 1", type: "Plumbing Rough-In",
    date: "2025-12-08", inspector: "Flagler County — R. Ostrow", location: "Level 1",
    status: "passed",
    checklist: [
      { item: "DWV slope & supports", result: "pass" },
      { item: "Water test held 15 min", result: "pass" },
      { item: "Backflow preventer location", result: "pass" },
      { item: "Hot/cold rough-in spacing", result: "pass" },
    ],
  },
  {
    id: "i7", number: "INSP-007", title: "Above-Ceiling Inspection — Corridor 1A", type: "Above-Ceiling",
    date: "2026-03-18", inspector: "Flagler County — K. Sayers", location: "Corridor 1A",
    status: "passed",
    checklist: [
      { item: "Fire-rated penetrations sealed", result: "pass" },
      { item: "Mechanical hangers properly supported", result: "pass" },
      { item: "Electrical junction boxes accessible", result: "pass" },
      { item: "Damper accessibility", result: "pass" },
    ],
  },
  {
    id: "i8", number: "INSP-008", title: "Final Building Inspection", type: "Final",
    date: "2026-09-18", inspector: "Flagler County — TBD", location: "Whole Building",
    status: "scheduled",
    checklist: [
      { item: "Egress and exit signage", result: "na" },
      { item: "Fire alarm acceptance test", result: "na" },
      { item: "Sprinkler final flush & test", result: "na" },
      { item: "Accessibility — ADA path of travel", result: "na" },
      { item: "Life safety devices commissioned", result: "na" },
    ],
  },
];

/* ---------------- Selectors ---------------- */
export const countByInspectionStatus = (s: InspectionStatus) =>
  INSPECTIONS.filter((i) => i.status === s).length;
export const passRate = () => {
  const decided = INSPECTIONS.filter((i) => i.status === "passed" || i.status === "failed");
  if (!decided.length) return 0;
  const passed = decided.filter((i) => i.status === "passed").length;
  return Math.round((passed / decided.length) * 100);
};

export const formatInspDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
