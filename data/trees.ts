import type { Organization, PlantationProject, Tree, TreeStatus, TreeVerification } from "@/types";
import { PLANTS } from "./plants";

export const ORGANIZATION: Organization = {
  id: "org-gdf",
  name: "Green Delhi Foundation",
  description:
    "A community-led environmental organization running plantation and survival-monitoring drives across Delhi NCR since 2019.",
  city: "Delhi, India",
};

export const PROJECTS: PlantationProject[] = [
  {
    id: "proj-yamuna",
    organizationId: "org-gdf",
    name: "Yamuna Riverbank Restoration",
    location: "Yamuna Floodplain, East Delhi",
    latitude: 28.6139,
    longitude: 77.2825,
    startDate: "2024-07-01",
    treesRegistered: 4200,
  },
  {
    id: "proj-ridge",
    organizationId: "org-gdf",
    name: "Southern Ridge Green Belt",
    location: "Southern Ridge Forest, South Delhi",
    latitude: 28.5245,
    longitude: 77.1855,
    startDate: "2024-08-15",
    treesRegistered: 3100,
  },
  {
    id: "proj-schools",
    organizationId: "org-gdf",
    name: "School Courtyards Initiative",
    location: "40 Government Schools, North & West Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    startDate: "2024-09-10",
    treesRegistered: 1700,
  },
  {
    id: "proj-industrial",
    organizationId: "org-gdf",
    name: "Industrial Buffer Zone Plantation",
    location: "Bawana Industrial Area, North-West Delhi",
    latitude: 28.7965,
    longitude: 77.0338,
    startDate: "2024-06-20",
    treesRegistered: 1000,
  },
];

// Deterministic pseudo-random generator so seed data is stable across reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

const SPECIES_POOL = [
  { common: "Neem", scientific: "Azadirachta indica" },
  { common: "Amla", scientific: "Phyllanthus emblica" },
  { common: "Moringa", scientific: "Moringa oleifera" },
  { common: "Guava", scientific: "Psidium guajava" },
  { common: "Pomegranate", scientific: "Punica granatum" },
  { common: "Peepal", scientific: "Ficus religiosa" },
  { common: "Banyan", scientific: "Ficus benghalensis" },
  { common: "Arjuna", scientific: "Terminalia arjuna" },
];

const STATUS_WEIGHTS: { status: TreeStatus; weight: number }[] = [
  { status: "alive", weight: 55 },
  { status: "needs_attention", weight: 15 },
  { status: "at_risk", weight: 9 },
  { status: "lost", weight: 10 },
  { status: "replaced", weight: 6 },
  { status: "pending_verification", weight: 5 },
];

function pickStatus(): TreeStatus {
  const total = STATUS_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = rand() * total;
  for (const w of STATUS_WEIGHTS) {
    if (r < w.weight) return w.status;
    r -= w.weight;
  }
  return "alive";
}

const VOLUNTEERS = [
  "Ananya Sharma", "Rohit Verma", "Fatima Khan", "Karan Mehta", "Priya Nair",
  "Aditya Singh", "Meera Iyer", "Zoya Ahmed", "Suresh Yadav", "Divya Kapoor",
];

const CARETAKER_NOTES: Record<TreeStatus, string[]> = {
  alive: ["Healthy canopy growth observed", "New leaf growth, no visible stress", "Stable — routine watering continues"],
  needs_attention: ["Leaves slightly wilting, watering increased", "Minor pest activity spotted on bark", "Soil compacted, mulching recommended"],
  at_risk: ["Significant leaf drop since last visit", "Bark damage from grazing animals", "Prolonged dry spell — irrigation urgent"],
  lost: ["Tree found uprooted after storm", "No regrowth after repeated dry spell", "Confirmed dead — root rot suspected"],
  replaced: ["Original sapling lost; replacement planted", "Replaced after construction damage"],
  planted: ["Freshly planted, first watering complete"],
  pending_verification: ["Awaiting volunteer visit this cycle"],
};

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function buildTrees(): Tree[] {
  const trees: Tree[] = [];
  let counter = 1;
  for (const project of PROJECTS) {
    const countForProject = 12; // sample individually-trackable trees per project for the prototype
    for (let i = 0; i < countForProject; i++) {
      const species = SPECIES_POOL[Math.floor(rand() * SPECIES_POOL.length)];
      const status = pickStatus();
      const jitterLat = (rand() - 0.5) * 0.02;
      const jitterLng = (rand() - 0.5) * 0.02;
      const plantedDaysAgo = 120 + Math.floor(rand() * 400);
      const verifiedDaysAgo = Math.floor(rand() * 20);
      const code = `GD-${project.id.split("-")[1].slice(0, 2).toUpperCase()}-${String(counter).padStart(5, "0")}`;
      const notesList = CARETAKER_NOTES[status];

      trees.push({
        id: `tree-${counter}`,
        treeCode: code,
        projectId: project.id,
        organizationName: ORGANIZATION.name,
        species: species.common,
        commonName: species.common,
        scientificName: species.scientific,
        latitude: project.latitude + jitterLat,
        longitude: project.longitude + jitterLng,
        plantationDate: daysAgoISO(plantedDaysAgo),
        initialPhotoUrl: `tree-sapling-${(counter % 3) + 1}`,
        latestPhotoUrl: status === "lost" ? undefined : `tree-grown-${(counter % 3) + 1}`,
        status,
        caretakerName: VOLUNTEERS[counter % VOLUNTEERS.length],
        wateringPlan: "Twice weekly (dry season), weekly (monsoon)",
        lastVerificationDate: daysAgoISO(verifiedDaysAgo),
        createdAt: daysAgoISO(plantedDaysAgo),
      });
      counter++;
    }
  }
  return trees;
}

export const TREES: Tree[] = buildTrees();

function buildVerifications(): TreeVerification[] {
  const verifications: TreeVerification[] = [];
  let vCounter = 1;
  for (const tree of TREES) {
    const cycles = 2 + Math.floor(rand() * 3);
    for (let c = cycles; c >= 1; c--) {
      const daysAgo = c * 35 + Math.floor(rand() * 10);
      const condition: TreeStatus = c === 1 ? tree.status : "alive";
      verifications.push({
        id: `verif-${vCounter}`,
        treeId: tree.id,
        volunteerName: tree.caretakerName ?? VOLUNTEERS[vCounter % VOLUNTEERS.length],
        photoUrl: `tree-grown-${(vCounter % 3) + 1}`,
        latitude: tree.latitude,
        longitude: tree.longitude,
        timestamp: daysAgoISO(daysAgo),
        condition,
        notes: CARETAKER_NOTES[condition][vCounter % CARETAKER_NOTES[condition].length],
        aiObservation:
          condition === "at_risk" || condition === "needs_attention"
            ? "AI-assisted observation — possible canopy thinning detected versus previous photo. Human verification recommended."
            : condition === "lost"
            ? "AI-assisted observation — tree not detected in expected frame position. Human verification recommended."
            : "AI-assisted observation — canopy area appears consistent or increased versus previous photo. Human verification recommended.",
        approved: c !== 1,
      });
      vCounter++;
    }
  }
  return verifications;
}

export const VERIFICATIONS: TreeVerification[] = buildVerifications();

export function getTreeById(id: string): Tree | undefined {
  return TREES.find((t) => t.id === id);
}

export function getVerificationsForTree(treeId: string): TreeVerification[] {
  return VERIFICATIONS.filter((v) => v.treeId === treeId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// ── Org-wide dashboard numbers ──────────────────────────────────────────────
// These reflect the full campaign scale (10,000 registered trees), while the
// individually browsable `TREES` above are a representative sample used to
// power the map, list, and digital-ID demo screens.
export const DASHBOARD_STATS = {
  totalRegistered: 10000,
  verifiedAlive: 7842,
  needsAttention: 1204,
  atRisk: 620,
  lost: 954,
  replaced: 620,
  pendingVerification: 760,
  activeVolunteers: 386,
  totalProjects: PROJECTS.length,
  get survivalRate() {
    return Number(((this.verifiedAlive / this.totalRegistered) * 100).toFixed(2));
  },
};

export const SPECIES_SURVIVAL = [
  { species: "Neem", planted: 2100, survivalRate: 88 },
  { species: "Amla", planted: 1450, survivalRate: 81 },
  { species: "Moringa", planted: 1200, survivalRate: 74 },
  { species: "Guava", planted: 1600, survivalRate: 69 },
  { species: "Peepal", planted: 1350, survivalRate: 92 },
  { species: "Banyan", planted: 900, survivalRate: 90 },
  { species: "Pomegranate", planted: 800, survivalRate: 63 },
  { species: "Arjuna", planted: 600, survivalRate: 77 },
];

export const MONTHLY_VERIFICATION_ACTIVITY = [
  { month: "Apr", verifications: 540 },
  { month: "May", verifications: 610 },
  { month: "Jun", verifications: 480 },
  { month: "Jul", verifications: 720 },
  { month: "Aug", verifications: 890 },
  { month: "Sep", verifications: 960 },
];

export { PLANTS };
