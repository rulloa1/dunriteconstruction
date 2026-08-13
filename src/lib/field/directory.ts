// Directory — Granite Amenity Center
export type CompanyType = "subcontractor" | "vendor" | "owner" | "architect" | "gc";

export interface Contact {
  name: string;
  title: string;
  phone: string;
  email: string;
}
export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  trades: string[];
  phone: string;
  email: string;
  address: string;
  contacts: Contact[];
}

export const COMPANIES: Company[] = [
  {
    id: "c-dunrite",
    name: "Dun Rite Construction Group",
    type: "gc",
    trades: ["General Contractor"],
    phone: "(386) 555-0100",
    email: "ops@dunriteconstruction.com",
    address: "412 Riverside Pkwy, Palm Coast, FL 32137",
    contacts: [
      {
        name: "Wesley Tanner",
        title: "Project Executive",
        phone: "(386) 555-0101",
        email: "wesley@dunriteconstruction.com",
      },
      {
        name: "Marisol Alvarez",
        title: "Superintendent",
        phone: "(386) 555-0118",
        email: "marisol@dunriteconstruction.com",
      },
    ],
  },
  {
    id: "c-owner",
    name: "Granite Hospitality Holdings",
    type: "owner",
    trades: ["Owner / Developer"],
    phone: "(305) 555-0322",
    email: "projects@granitehh.com",
    address: "1450 Bayshore Dr, Miami, FL 33131",
    contacts: [
      {
        name: "Priya Shankar",
        title: "VP Development",
        phone: "(305) 555-0323",
        email: "priya@granitehh.com",
      },
    ],
  },
  {
    id: "c-arch",
    name: "Vermillion Architecture",
    type: "architect",
    trades: ["Architect of Record"],
    phone: "(407) 555-0244",
    email: "studio@vermillionarch.com",
    address: "88 Magnolia Ave, Orlando, FL 32801",
    contacts: [
      {
        name: "Owen Hadley",
        title: "Principal",
        phone: "(407) 555-0245",
        email: "owen@vermillionarch.com",
      },
      {
        name: "Naomi Bishop",
        title: "Project Architect",
        phone: "(407) 555-0247",
        email: "naomi@vermillionarch.com",
      },
    ],
  },
  {
    id: "c-abaco",
    name: "Abaco Sitework Ltd.",
    type: "subcontractor",
    trades: ["Sitework", "Excavation", "Landscaping/Hardscape"],
    phone: "(386) 555-0410",
    email: "dispatch@abacosite.com",
    address: "920 Industrial Way, Bunnell, FL 32110",
    contacts: [
      {
        name: "Felix Yates",
        title: "Site Foreman",
        phone: "(386) 555-0411",
        email: "felix@abacosite.com",
      },
    ],
  },
  {
    id: "c-bahama",
    name: "Bahama Concrete Co.",
    type: "subcontractor",
    trades: ["Concrete", "Piles/Caissons", "Masonry"],
    phone: "(904) 555-0512",
    email: "ops@bahamaconcrete.com",
    address: "240 Quarry Rd, Jacksonville, FL 32218",
    contacts: [
      {
        name: "Carla Ridge",
        title: "Project Manager",
        phone: "(904) 555-0513",
        email: "carla@bahamaconcrete.com",
      },
      {
        name: "Vince Lomeli",
        title: "Concrete Foreman",
        phone: "(904) 555-0514",
        email: "vince@bahamaconcrete.com",
      },
    ],
  },
  {
    id: "c-island-steel",
    name: "Island Steel Fabricators",
    type: "subcontractor",
    trades: ["Structural Steel", "Metal Stud Framing"],
    phone: "(386) 555-0631",
    email: "shop@islandsteelfab.com",
    address: "55 Foundry Ln, Daytona Beach, FL 32114",
    contacts: [
      {
        name: "Dane Holloway",
        title: "Erection Supervisor",
        phone: "(386) 555-0632",
        email: "dane@islandsteelfab.com",
      },
    ],
  },
  {
    id: "c-coastal",
    name: "Coastal Framing LLC",
    type: "subcontractor",
    trades: ["Rough Framing", "Decks", "Exterior/Interior Stairs"],
    phone: "(386) 555-0723",
    email: "office@coastalframing.com",
    address: "1102 Magnolia Pl, Ormond Beach, FL 32174",
    contacts: [
      {
        name: "Frank Yates",
        title: "Framing Foreman",
        phone: "(386) 555-0724",
        email: "frank@coastalframing.com",
      },
    ],
  },
  {
    id: "c-tropic",
    name: "Tropic Roofing Systems",
    type: "subcontractor",
    trades: ["Roofing", "Copper Flashing", "Gutters"],
    phone: "(386) 555-0815",
    email: "estimating@tropicroof.com",
    address: "76 Marina Cove, St. Augustine, FL 32084",
    contacts: [
      {
        name: "Lyle Mercer",
        title: "Roofing Superintendent",
        phone: "(386) 555-0816",
        email: "lyle@tropicroof.com",
      },
    ],
  },
  {
    id: "c-reef",
    name: "Reef Mechanical",
    type: "subcontractor",
    trades: ["HVAC"],
    phone: "(386) 555-0918",
    email: "service@reefmech.com",
    address: "300 Industrial Dr, Palm Coast, FL 32137",
    contacts: [
      {
        name: "Cole Boyd",
        title: "Lead HVAC Tech",
        phone: "(386) 555-0919",
        email: "cole@reefmech.com",
      },
    ],
  },
  {
    id: "c-northshore",
    name: "Northshore Plumbing",
    type: "subcontractor",
    trades: ["Plumbing"],
    phone: "(386) 555-1027",
    email: "office@northshoreplumbing.com",
    address: "12 Pine Crest Rd, Bunnell, FL 32110",
    contacts: [
      {
        name: "Eduardo Han",
        title: "Plumbing Foreman",
        phone: "(386) 555-1028",
        email: "eddie@northshoreplumbing.com",
      },
    ],
  },
  {
    id: "c-bluewave",
    name: "BlueWave Electric",
    type: "subcontractor",
    trades: ["Electrical"],
    phone: "(386) 555-1135",
    email: "ops@bluewaveelectric.com",
    address: "808 Inlet Way, Flagler Beach, FL 32136",
    contacts: [
      {
        name: "Devon Pratt",
        title: "Master Electrician",
        phone: "(386) 555-1136",
        email: "devon@bluewaveelectric.com",
      },
      {
        name: "Hana Brooks",
        title: "Project Coordinator",
        phone: "(386) 555-1137",
        email: "hana@bluewaveelectric.com",
      },
    ],
  },
  {
    id: "c-marsh",
    name: "Marsh Harbour Millwork",
    type: "subcontractor",
    trades: ["Cabinetry", "Casework", "Interior Doors", "Trim"],
    phone: "(386) 555-1242",
    email: "shop@marshharbourmillwork.com",
    address: "47 Cypress Ridge, Palm Coast, FL 32137",
    contacts: [
      {
        name: "Sasha Quinn",
        title: "Install Foreman",
        phone: "(386) 555-1243",
        email: "sasha@marshharbourmillwork.com",
      },
    ],
  },
  {
    id: "c-caytile",
    name: "Cay Tile & Stone",
    type: "subcontractor",
    trades: ["Tile", "Stone Veneer", "Countertops"],
    phone: "(386) 555-1351",
    email: "office@caytilestone.com",
    address: "210 Coquina Ave, St. Augustine, FL 32084",
    contacts: [
      {
        name: "Jorge Inoa",
        title: "Lead Setter",
        phone: "(386) 555-1352",
        email: "jorge@caytilestone.com",
      },
    ],
  },
  {
    id: "c-guana",
    name: "Guana Painting Co.",
    type: "subcontractor",
    trades: ["Painting & Coatings"],
    phone: "(904) 555-1469",
    email: "estimating@guanapaint.com",
    address: "501 Beachside Blvd, Ponte Vedra, FL 32082",
    contacts: [
      {
        name: "Renata Cobb",
        title: "Painting Foreman",
        phone: "(904) 555-1470",
        email: "renata@guanapaint.com",
      },
    ],
  },
  {
    id: "c-glazing",
    name: "Island Glazing Ltd.",
    type: "subcontractor",
    trades: ["Windows", "Exterior Doors", "Shutters"],
    phone: "(386) 555-1573",
    email: "service@islandglazing.com",
    address: "33 Harborview Rd, St. Augustine, FL 32084",
    contacts: [
      {
        name: "Tara Vance",
        title: "Lead Glazier",
        phone: "(386) 555-1574",
        email: "tara@islandglazing.com",
      },
    ],
  },
  {
    id: "c-atlantic-pools",
    name: "Atlantic Pools & Spa",
    type: "subcontractor",
    trades: ["Pool & Spa"],
    phone: "(386) 555-1681",
    email: "office@atlanticpoolsspa.com",
    address: "188 Lagoon Dr, Palm Coast, FL 32137",
    contacts: [
      {
        name: "Bryce Halloran",
        title: "Pool Superintendent",
        phone: "(386) 555-1682",
        email: "bryce@atlanticpoolsspa.com",
      },
    ],
  },
  {
    id: "c-fbm",
    name: "Florida Builder Supply",
    type: "vendor",
    trades: ["Lumber", "Drywall", "Building Materials"],
    phone: "(904) 555-1790",
    email: "orders@flbuildersupply.com",
    address: "1900 Industrial Park, Jacksonville, FL 32209",
    contacts: [
      {
        name: "Maria Calderon",
        title: "Account Manager",
        phone: "(904) 555-1791",
        email: "mcalderon@flbuildersupply.com",
      },
    ],
  },
  {
    id: "c-sunbelt",
    name: "Sunbelt Rentals — Daytona",
    type: "vendor",
    trades: ["Equipment Rental"],
    phone: "(386) 555-1855",
    email: "daytona@sunbeltrentals.com",
    address: "920 Industrial Way, Daytona Beach, FL 32114",
    contacts: [
      {
        name: "Trent Mayfield",
        title: "Branch Manager",
        phone: "(386) 555-1856",
        email: "trent.m@sunbeltrentals.com",
      },
    ],
  },
];

/* ---------------- Selectors ---------------- */
export const totalCompanies = () => COMPANIES.length;
export const countByType = (t: CompanyType) => COMPANIES.filter((c) => c.type === t).length;
export const totalContacts = () => COMPANIES.reduce((s, c) => s + c.contacts.length, 0);
