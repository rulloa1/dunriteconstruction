// Punch List — Granite Amenity Center
export type PunchStatus = "open" | "ready-for-review" | "closed";
export type PunchPriority = "low" | "medium" | "high";

export interface PunchItem {
  id: string;
  number: string;
  title: string;
  description: string;
  location: string;
  trade: string;
  responsibleCompany: string;
  assignee: string;
  status: PunchStatus;
  priority: PunchPriority;
  createdDate: string;
  dueDate: string;
}

const TODAY = "2026-06-13";

export const PUNCH_ITEMS: PunchItem[] = [
  {
    id: "p1",
    number: "PL-001",
    title: "Touch-up paint at corridor base",
    description: "Scuffs along base trim from cart traffic — full base run.",
    location: "Corridor 1A",
    trade: "Painting",
    responsibleCompany: "Guana Painting Co.",
    assignee: "R. Cobb",
    status: "closed",
    priority: "low",
    createdDate: "2026-05-20",
    dueDate: "2026-06-05",
  },
  {
    id: "p2",
    number: "PL-002",
    title: "Replace cracked floor tile",
    description: "Hairline crack near drain in Pool Restroom — swap single tile.",
    location: "Pool Restroom — Women's",
    trade: "Tile",
    responsibleCompany: "Cay Tile & Stone",
    assignee: "J. Inoa",
    status: "open",
    priority: "medium",
    createdDate: "2026-06-01",
    dueDate: "2026-06-15",
  },
  {
    id: "p3",
    number: "PL-003",
    title: "Cabinet door alignment — pantry",
    description: 'Uppers along east wall sit proud ~1/8". Re-shim and adjust hinges.',
    location: "Catering Pantry",
    trade: "Millwork",
    responsibleCompany: "Marsh Harbour Millwork",
    assignee: "S. Quinn",
    status: "ready-for-review",
    priority: "low",
    createdDate: "2026-05-28",
    dueDate: "2026-06-11",
  },
  {
    id: "p4",
    number: "PL-004",
    title: "GFCI not tripping on test",
    description: "Counter outlet south of sink fails portable tester. Replace + retest.",
    location: "Catering Pantry",
    trade: "Electrical",
    responsibleCompany: "BlueWave Electric",
    assignee: "D. Pratt",
    status: "open",
    priority: "high",
    createdDate: "2026-06-02",
    dueDate: "2026-06-09",
  },
  {
    id: "p5",
    number: "PL-005",
    title: "Leaking p-trap under lav",
    description: "Slow drip on supply riser. Tighten or replace.",
    location: "Room 110 Bath",
    trade: "Plumbing",
    responsibleCompany: "Northshore Plumbing",
    assignee: "E. Han",
    status: "closed",
    priority: "high",
    createdDate: "2026-05-22",
    dueDate: "2026-05-29",
  },
  {
    id: "p6",
    number: "PL-006",
    title: "Door rubs jamb",
    description: "Bottom corner contacts jamb on closing arc — plane and refinish.",
    location: "Room 112",
    trade: "Doors",
    responsibleCompany: "Marsh Harbour Millwork",
    assignee: "S. Quinn",
    status: "open",
    priority: "low",
    createdDate: "2026-06-04",
    dueDate: "2026-06-18",
  },
  {
    id: "p7",
    number: "PL-007",
    title: "Diffuser drift — fitness suite",
    description: 'Two ceiling diffusers off-grid by ~3/4". Reset and torque.',
    location: "Fitness Suite",
    trade: "HVAC",
    responsibleCompany: "Reef Mechanical",
    assignee: "C. Boyd",
    status: "ready-for-review",
    priority: "medium",
    createdDate: "2026-05-30",
    dueDate: "2026-06-10",
  },
  {
    id: "p8",
    number: "PL-008",
    title: "Grout haze on pool deck tile",
    description: "Light haze across center field — buff and seal.",
    location: "Pool Deck — East",
    trade: "Tile",
    responsibleCompany: "Cay Tile & Stone",
    assignee: "J. Inoa",
    status: "open",
    priority: "low",
    createdDate: "2026-06-06",
    dueDate: "2026-06-20",
  },
  {
    id: "p9",
    number: "PL-009",
    title: "Railing baluster spacing exceeds spec",
    description: 'Two bays on east deck >4" gap — replace section per architect.',
    location: "East Deck",
    trade: "Carpentry",
    responsibleCompany: "Coastal Framing LLC",
    assignee: "F. Yates",
    status: "open",
    priority: "high",
    createdDate: "2026-05-18",
    dueDate: "2026-06-03",
  },
  {
    id: "p10",
    number: "PL-010",
    title: "Stone veneer mortar joint repair",
    description: "Mortar pulling at fireplace surround left jamb. Repoint.",
    location: "Lobby Fireplace",
    trade: "Stone",
    responsibleCompany: "Cay Tile & Stone",
    assignee: "J. Inoa",
    status: "open",
    priority: "medium",
    createdDate: "2026-06-07",
    dueDate: "2026-06-21",
  },
  {
    id: "p11",
    number: "PL-011",
    title: "Light fixture missing trim ring",
    description: "Recessed can in corridor missing white trim — install per spec.",
    location: "Corridor 2B",
    trade: "Electrical",
    responsibleCompany: "BlueWave Electric",
    assignee: "D. Pratt",
    status: "ready-for-review",
    priority: "low",
    createdDate: "2026-06-05",
    dueDate: "2026-06-12",
  },
  {
    id: "p12",
    number: "PL-012",
    title: "Shower glass alignment — pool restroom",
    description: "Door drags at top corner — reshim hinges, verify seal.",
    location: "Pool Restroom — Men's",
    trade: "Doors",
    responsibleCompany: "Marsh Harbour Millwork",
    assignee: "S. Quinn",
    status: "open",
    priority: "medium",
    createdDate: "2026-05-25",
    dueDate: "2026-06-08",
  },
  {
    id: "p13",
    number: "PL-013",
    title: "Roof drain debris",
    description: "Construction debris in scupper drain — clear and verify flow.",
    location: "Roof — NE Corner",
    trade: "Roofing",
    responsibleCompany: "Tropic Roofing Systems",
    assignee: "L. Mercer",
    status: "closed",
    priority: "medium",
    createdDate: "2026-05-15",
    dueDate: "2026-05-22",
  },
  {
    id: "p14",
    number: "PL-014",
    title: "Backsplash caulk joint",
    description: "Open caulk joint at counter return — re-caulk in matching color.",
    location: "Catering Pantry",
    trade: "Tile",
    responsibleCompany: "Cay Tile & Stone",
    assignee: "J. Inoa",
    status: "open",
    priority: "low",
    createdDate: "2026-06-08",
    dueDate: "2026-06-22",
  },
];

/* ---------------- Selectors ---------------- */
const toDate = (iso: string) => new Date(iso + "T12:00:00");
export const isOverdue = (p: PunchItem) =>
  p.status !== "closed" && toDate(p.dueDate) < toDate(TODAY);

export const countByStatus = (s: PunchStatus) => PUNCH_ITEMS.filter((p) => p.status === s).length;
export const overdueCount = () => PUNCH_ITEMS.filter(isOverdue).length;

export const formatPunchDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
