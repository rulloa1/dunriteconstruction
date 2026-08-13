export type DocGroup = "HR & Onboarding" | "Safety & Compliance" | "Operations";

export interface DocItem {
  id: string;
  title: string;
  group: DocGroup;
  file: string;
  description: string;
}

export const DOCUMENTS: DocItem[] = [
  {
    id: "employee-handbook",
    title: "Employee Handbook",
    group: "HR & Onboarding",
    file: "/docs/employee-handbook.html",
    description: "Company-wide handbook — employment, compensation, benefits, leave, conduct.",
  },
  {
    id: "new-hire-orientation",
    title: "New Hire Orientation Guide",
    group: "HR & Onboarding",
    file: "/docs/new-hire-orientation.html",
    description: "Day-one onboarding guide for new employees.",
  },
  {
    id: "handbook-review-log",
    title: "Handbook Review Log",
    group: "HR & Onboarding",
    file: "/docs/handbook-review-log.html",
    description: "Acknowledgment and revision history for the handbook.",
  },
  {
    id: "drug-free-workplace",
    title: "Drug-Free Workplace Program",
    group: "Safety & Compliance",
    file: "/docs/drug-free-workplace.html",
    description: "Florida drug-free workplace policy and testing program.",
  },
  {
    id: "fleet-safety",
    title: "Fleet Safety Program",
    group: "Safety & Compliance",
    file: "/docs/fleet-safety.html",
    description: "Company vehicle and driver safety policy.",
  },
  {
    id: "safety-manual",
    title: "Safety Manual",
    group: "Safety & Compliance",
    file: "/docs/safety-manual.html",
    description: "Field safety standards and procedures.",
  },
  {
    id: "sop-manual",
    title: "SOP Manual",
    group: "Operations",
    file: "/docs/sop-manual.html",
    description: "Standard operating procedures across the business.",
  },
  {
    id: "pm-workbook",
    title: "Project Management Workbook",
    group: "Operations",
    file: "/docs/pm-workbook.html",
    description: "Project controls methodology and templates.",
  },
];

export const DOC_GROUPS: DocGroup[] = ["HR & Onboarding", "Safety & Compliance", "Operations"];

export const BID_PACKET_PATH = "/docs/bid-packet-bp-2026-014.pdf";
export const HERO_IMAGE_PATH = "/dunrite-hero.jpg";

export const findDoc = (id: string) => DOCUMENTS.find((d) => d.id === id);
export const docsByGroup = (group: DocGroup) => DOCUMENTS.filter((d) => d.group === group);
