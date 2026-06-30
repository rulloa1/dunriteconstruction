// Daily Logs — Granite Amenity Center (finishes phase, mid-2026)
export interface WeatherInfo {
  condition: string;
  tempHigh: number;
  tempLow: number;
  precipitation: number; // inches
}
export interface ManpowerRow { company: string; workers: number; hours: number; }
export interface DeliveryRow { item: string; vendor: string; }
export interface DailyLog {
  id: string;
  date: string; // ISO
  author: string;
  weather: WeatherInfo;
  manpower: ManpowerRow[];
  workCompleted: string[];
  deliveries: DeliveryRow[];
  notes: string;
}

export const DAILY_LOGS: DailyLog[] = [
  {
    id: "dl-2026-06-12",
    date: "2026-06-12",
    author: "M. Alvarez, Superintendent",
    weather: { condition: "Partly Cloudy", tempHigh: 89, tempLow: 74, precipitation: 0 },
    manpower: [
      { company: "Marsh Harbour Millwork", workers: 6, hours: 54 },
      { company: "Cay Tile & Stone", workers: 4, hours: 36 },
      { company: "Guana Painting Co.", workers: 5, hours: 45 },
      { company: "BlueWave Electric", workers: 3, hours: 27 },
    ],
    workCompleted: [
      "Installed upper cabinetry in catering pantry",
      "Set master bath floor tile (Rooms 110, 112)",
      "First coat paint on great-room ceiling",
      "Pulled branch circuits for under-cabinet lighting",
    ],
    deliveries: [
      { item: "Quartz countertop slabs (4)", vendor: "Cay Tile & Stone" },
      { item: "Trim package — base & casing", vendor: "Marsh Harbour Millwork" },
    ],
    notes: "Owner walk scheduled for Friday — confirm protective floor covering in lobby.",
  },
  {
    id: "dl-2026-06-11",
    date: "2026-06-11",
    author: "M. Alvarez, Superintendent",
    weather: { condition: "Scattered T-Storms", tempHigh: 86, tempLow: 73, precipitation: 0.45 },
    manpower: [
      { company: "Marsh Harbour Millwork", workers: 6, hours: 48 },
      { company: "Cay Tile & Stone", workers: 4, hours: 32 },
      { company: "Reef Mechanical", workers: 2, hours: 16 },
      { company: "Northshore Plumbing", workers: 3, hours: 24 },
    ],
    workCompleted: [
      "Continued base cabinet install — catering pantry",
      "Tile underlayment in pool restrooms",
      "HVAC trim — registers in fitness suite",
      "Plumbing fixture set in Rooms 108–110",
    ],
    deliveries: [{ item: "Plumbing trim kits", vendor: "Northshore Plumbing" }],
    notes: "Brief stoppage 2:10–2:55 PM due to lightning in area.",
  },
  {
    id: "dl-2026-06-10",
    date: "2026-06-10",
    author: "T. Wells, Asst. Superintendent",
    weather: { condition: "Sunny", tempHigh: 91, tempLow: 75, precipitation: 0 },
    manpower: [
      { company: "Guana Painting Co.", workers: 6, hours: 54 },
      { company: "BlueWave Electric", workers: 4, hours: 36 },
      { company: "Marsh Harbour Millwork", workers: 5, hours: 45 },
    ],
    workCompleted: [
      "Prime + first finish coat on corridor walls",
      "Device install — lobby & corridor",
      "Set interior doors on second floor",
    ],
    deliveries: [
      { item: "Interior door hardware", vendor: "Marsh Harbour Millwork" },
      { item: "Decora device packs", vendor: "BlueWave Electric" },
    ],
    notes: "Heat advisory — additional water stations posted.",
  },
  {
    id: "dl-2026-06-09",
    date: "2026-06-09",
    author: "M. Alvarez, Superintendent",
    weather: { condition: "Sunny", tempHigh: 90, tempLow: 74, precipitation: 0 },
    manpower: [
      { company: "Cay Tile & Stone", workers: 5, hours: 45 },
      { company: "Guana Painting Co.", workers: 4, hours: 36 },
      { company: "Marsh Harbour Millwork", workers: 5, hours: 45 },
      { company: "Reef Mechanical", workers: 2, hours: 16 },
    ],
    workCompleted: [
      "Stone veneer at lobby fireplace surround",
      "Wood paneling in board room",
      "Began ceiling grid prep in corridor",
    ],
    deliveries: [{ item: "Stone veneer (12 pallets)", vendor: "Cay Tile & Stone" }],
    notes: "Forklift inspected — green tag posted.",
  },
  {
    id: "dl-2026-06-08",
    date: "2026-06-08",
    author: "M. Alvarez, Superintendent",
    weather: { condition: "Overcast", tempHigh: 84, tempLow: 72, precipitation: 0.05 },
    manpower: [
      { company: "Marsh Harbour Millwork", workers: 4, hours: 32 },
      { company: "BlueWave Electric", workers: 4, hours: 32 },
      { company: "Northshore Plumbing", workers: 2, hours: 16 },
    ],
    workCompleted: [
      "Trim and crown in great room",
      "Panel terminations — main switchgear",
      "Punch repairs — Rooms 101–106",
    ],
    deliveries: [],
    notes: "Light Monday — punch crew picking up RFI-038 fixes.",
  },
  {
    id: "dl-2026-06-05",
    date: "2026-06-05",
    author: "T. Wells, Asst. Superintendent",
    weather: { condition: "Sunny", tempHigh: 88, tempLow: 73, precipitation: 0 },
    manpower: [
      { company: "Cay Tile & Stone", workers: 6, hours: 54 },
      { company: "Guana Painting Co.", workers: 5, hours: 45 },
      { company: "Reef Mechanical", workers: 3, hours: 27 },
      { company: "BlueWave Electric", workers: 3, hours: 27 },
    ],
    workCompleted: [
      "Pool deck tile — east edge",
      "Finish coat in fitness suite",
      "Final HVAC trim — pool restrooms",
    ],
    deliveries: [{ item: "Diffusers and grilles", vendor: "Reef Mechanical" }],
    notes: "",
  },
  {
    id: "dl-2026-06-04",
    date: "2026-06-04",
    author: "M. Alvarez, Superintendent",
    weather: { condition: "Partly Cloudy", tempHigh: 87, tempLow: 72, precipitation: 0 },
    manpower: [
      { company: "Coastal Framing LLC", workers: 3, hours: 27 },
      { company: "Marsh Harbour Millwork", workers: 4, hours: 36 },
      { company: "BlueWave Electric", workers: 4, hours: 36 },
      { company: "Northshore Plumbing", workers: 2, hours: 18 },
    ],
    workCompleted: [
      "Exterior deck railing punch — east elevation",
      "Built-in bench install in board room",
      "Whip drops at island in catering pantry",
    ],
    deliveries: [{ item: "Railing balusters", vendor: "Coastal Framing LLC" }],
    notes: "Mock-up wall approved by architect 11:30 AM.",
  },
];

/* ---------------- Selectors ---------------- */
export const totalLogs = () => DAILY_LOGS.length;
export const totalManHours = () =>
  DAILY_LOGS.reduce((s, l) => s + l.manpower.reduce((a, m) => a + m.hours, 0), 0);
export const totalWorkers = (log: DailyLog) =>
  log.manpower.reduce((a, m) => a + m.workers, 0);
export const totalHours = (log: DailyLog) =>
  log.manpower.reduce((a, m) => a + m.hours, 0);
export const avgCrewSize = () => {
  if (!DAILY_LOGS.length) return 0;
  const tot = DAILY_LOGS.reduce((s, l) => s + totalWorkers(l), 0);
  return Math.round((tot / DAILY_LOGS.length) * 10) / 10;
};
export const totalDeliveries = () =>
  DAILY_LOGS.reduce((s, l) => s + l.deliveries.length, 0);

export const formatLogDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
