import frameAsset from "@/assets/albums/frame.webp.asset.json";
import eppersonAsset from "@/assets/albums/epperson.webp.asset.json";
import flatworkAsset from "@/assets/albums/flatwork.webp.asset.json";

const FRAME = frameAsset.url;
import customAsset from "@/assets/orig/customhome.webp.asset.json";
import concreteAsset from "@/assets/orig/concrete.webp.asset.json";
import foundationAsset from "@/assets/orig/foundation.webp.asset.json";
import wallsAsset from "@/assets/orig/walls.webp.asset.json";
import finishedAsset from "@/assets/orig/finished.webp.asset.json";

const STONE = customAsset.url;
const CONCRETE = concreteAsset.url;
const FOUNDATION = foundationAsset.url;
const WALLS = wallsAsset.url;
const FINISHED = finishedAsset.url;
const EPPERSON = eppersonAsset.url;
const FLATWORK = flatworkAsset.url;

export type Album = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  cover: string;
  images: { src: string; alt: string }[];
  externalUrl: string;
};

export const ALBUMS: Album[] = [
  {
    slug: "full-shell-packages",
    title: "Full Shell Packages",
    kicker: "01 · Builders · Developers · GCs",
    description:
      "Turnkey shell packages — slabs, block, trusses, and framing delivered as one coordinated scope of work across central Florida.",
    cover: FRAME,
    externalUrl: "https://www.dunriteconstructiongroup.com/full-shell-packages/",
    images: [
      { src: FRAME, alt: "Framed shell on a Dun Rite jobsite" },
      { src: CONCRETE, alt: "Concrete pour in progress" },
      { src: EPPERSON, alt: "Large-scale shell package" },
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
      { src: FINISHED, alt: "Finished custom home" },
      { src: WALLS, alt: "Stone wall home" },
      { src: FRAME, alt: "Framed custom home" },
    ],
  },
  {
    slug: "developer-projects",
    title: "Developer Projects",
    kicker: "03 · Developers · Production Builders",
    description:
      "Neighborhood-scale concrete for production builders, clubhouses, and amenity centers across ten central Florida counties.",
    cover: EPPERSON,
    externalUrl: "https://www.dunriteconstructiongroup.com/developer-projects/",
    images: [
      { src: EPPERSON, alt: "Epperson Lagoon project" },
      { src: FLATWORK, alt: "Community flatwork" },
    ],
  },
  {
    slug: "concrete-flatwork",
    title: "Concrete & Flatwork",
    kicker: "04 · Communities · Single Homes",
    description:
      "Driveways, sidewalks, and patios — single home or whole community, screeded and finished by hand.",
    cover: FLATWORK,
    externalUrl: "https://www.dunriteconstructiongroup.com/concrete-flatwork/",
    images: [
      { src: FLATWORK, alt: "Finished flatwork" },
      { src: FOUNDATION, alt: "Slab pour" },
      { src: CONCRETE, alt: "Crew finishing a pavement path" },
    ],
  },
];

export function getAlbum(slug: string): Album | undefined {
  return ALBUMS.find((a) => a.slug === slug);
}
