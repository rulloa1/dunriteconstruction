export type Album = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  cover: string;
  images: { src: string; alt: string }[];
  externalUrl: string;
};

const STONE =
  "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/concrete-pour-by-dunrite-florida-re9vd1lndzj9oazwh18gdh0p1g93cwhog9krpgcl9c.webp";

export const ALBUMS: Album[] = [
  {
    slug: "full-shell-packages",
    title: "Full Shell Packages",
    kicker: "01 · Builders · Developers · GCs",
    description:
      "Turnkey shell packages — slabs, block, trusses, and framing delivered as one coordinated scope of work across central Florida.",
    cover:
      "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/building-frame-by-dunrite-florida-re9vcqpw742qr71cxipdfot8pq6tbwoc2b1ghskia0.webp",
    externalUrl: "https://www.dunriteconstructiongroup.com/full-shell-packages/",
    images: [
      {
        src: "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/building-frame-by-dunrite-florida-re9vcqpw742qr71cxipdfot8pq6tbwoc2b1ghskia0.webp",
        alt: "Framed shell on a Dun Rite jobsite",
      },
      { src: STONE, alt: "Concrete pour in progress" },
      {
        src: "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/EPPERSON_LAGOON-rcc4gj0v57y78urryzkabukyz5wlclupmdyj1u07t4.webp",
        alt: "Large-scale shell package",
      },
    ],
  },
  {
    slug: "custom-home-shells",
    title: "Custom Home Shells",
    kicker: "02 · Homeowners · Architects",
    description:
      "One-off shell builds for homeowners and architects — beach houses to estate homes, executed to the drawing set.",
    cover: STONE,
    externalUrl: "https://www.dunriteconstructiongroup.com/custom-home-shells/",
    images: [
      { src: STONE, alt: "Custom home shell" },
      {
        src: "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/building-frame-by-dunrite-florida-re9vcqpw742qr71cxipdfot8pq6tbwoc2b1ghskia0.webp",
        alt: "Framed custom home",
      },
    ],
  },
  {
    slug: "developer-projects",
    title: "Developer Projects",
    kicker: "03 · Developers · Production Builders",
    description:
      "Neighborhood-scale concrete for production builders, clubhouses, and amenity centers across ten central Florida counties.",
    cover:
      "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/EPPERSON_LAGOON-rcc4gj0v57y78urryzkabukyz5wlclupmdyj1u07t4.webp",
    externalUrl: "https://www.dunriteconstructiongroup.com/developer-projects/",
    images: [
      {
        src: "https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/EPPERSON_LAGOON-rcc4gj0v57y78urryzkabukyz5wlclupmdyj1u07t4.webp",
        alt: "Epperson Lagoon project",
      },
      {
        src: "https://www.drchomesfl.com/wp-content/uploads/2025/12/cd-5.webp",
        alt: "Community flatwork",
      },
    ],
  },
  {
    slug: "concrete-flatwork",
    title: "Concrete & Flatwork",
    kicker: "04 · Communities · Single Homes",
    description:
      "Driveways, sidewalks, and patios — single home or whole community, screeded and finished by hand.",
    cover: "https://www.drchomesfl.com/wp-content/uploads/2025/12/cd-5.webp",
    externalUrl: "https://www.dunriteconstructiongroup.com/concrete-flatwork/",
    images: [
      {
        src: "https://www.drchomesfl.com/wp-content/uploads/2025/12/cd-5.webp",
        alt: "Finished flatwork",
      },
      { src: STONE, alt: "Slab pour" },
    ],
  },
];

export function getAlbum(slug: string): Album | undefined {
  return ALBUMS.find((a) => a.slug === slug);
}
