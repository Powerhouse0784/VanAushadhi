// ── GreenRoots domain types ────────────────────────────────────────────────

export type TreeStatus =
  | "planted"
  | "alive"
  | "needs_attention"
  | "at_risk"
  | "lost"
  | "replaced"
  | "pending_verification";

export const TREE_STATUS_META: Record<
  TreeStatus,
  { label: string; color: string; marker: string }
> = {
  planted: { label: "Planted", color: "#2E6FA6", marker: "#2E6FA6" },
  alive: { label: "Alive & Healthy", color: "#2C6E3B", marker: "#2C6E3B" },
  needs_attention: { label: "Needs Attention", color: "#C99A2E", marker: "#C99A2E" },
  at_risk: { label: "At Risk", color: "#C05621", marker: "#C05621" },
  lost: { label: "Lost", color: "#B3392C", marker: "#B3392C" },
  replaced: { label: "Replaced", color: "#7C4FB0", marker: "#7C4FB0" },
  pending_verification: { label: "Pending Verification", color: "#2E6FA6", marker: "#2E6FA6" },
};

export interface Organization {
  id: string;
  name: string;
  description?: string;
  city?: string;
  logoUrl?: string;
}

export interface PlantationProject {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  startDate: string;
  treesRegistered: number;
}

export interface Tree {
  id: string;
  treeCode: string; // human friendly e.g. GD-DL-00842
  projectId: string;
  organizationName: string;
  species: string;
  commonName: string;
  localName?: string;
  scientificName: string;
  latitude: number;
  longitude: number;
  plantationDate: string;
  initialPhotoUrl: string;
  latestPhotoUrl?: string;
  status: TreeStatus;
  caretakerName?: string;
  wateringPlan?: string;
  lastVerificationDate?: string;
  createdAt: string;
}

export interface TreeVerification {
  id: string;
  treeId: string;
  volunteerName: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  condition: TreeStatus;
  notes?: string;
  aiObservation?: string;
  approved: boolean;
}

export type EvidenceLevel =
  | "strong"
  | "limited"
  | "traditional_only"
  | "insufficient"
  | "unavailable";

export const EVIDENCE_META: Record<EvidenceLevel, { label: string; color: string }> = {
  strong: { label: "Strong evidence", color: "#2C6E3B" },
  limited: { label: "Limited evidence", color: "#C99A2E" },
  traditional_only: { label: "Traditional use only", color: "#8C6C3C" },
  insufficient: { label: "Insufficient evidence", color: "#C05621" },
  unavailable: { label: "Safety information unavailable", color: "#B3392C" },
};

export interface PlantProfile {
  id: string;
  commonName: string;
  localName: string;
  scientificName: string;
  category: string;
  images: string[];
  identificationFeatures: string;
  habitat: string;
  climateAndSoil: string;
  sunlight: string;
  watering: string;
  careInstructions: string[];
  environmentalBenefits: string[];
  partsUsed: string[];
  traditionalUses: string[];
  nutrition?: string;
  evidenceLevel: EvidenceLevel;
  preparationInfo?: string;
  sideEffects: string[];
  allergyWarning: string;
  medicineInteractionWarning: string;
  pregnancyWarning: string;
  childSafetyWarning: string;
  whenNotToUse: string[];
  whenToConsult: string[];
  relatedPlantIds: string[];
}

export interface SafetyCheckInput {
  plantId: string;
  ageGroup: "child" | "teen" | "adult" | "senior";
  pregnancyStatus: "not_applicable" | "pregnant" | "breastfeeding" | "none";
  allergies: string;
  currentMedicines: string;
  healthConditions: string;
  intendedUse: string;
}

export type SafetyLevel = "generally_low_concern" | "use_caution" | "avoid_without_advice";

export interface SafetyCheckResult {
  level: SafetyLevel;
  allergyWarnings: string[];
  interactionWarnings: string[];
  pregnancyChildWarnings: string[];
  questionsForProfessional: string[];
  disclaimer: string;
}

export type CommunitySubmissionStatus =
  | "pending_review"
  | "community_contribution"
  | "verified"
  | "evidence_not_reviewed"
  | "requires_correction"
  | "rejected";

export interface CommunitySubmission {
  id: string;
  plantName: string;
  localName?: string;
  photoUrl?: string;
  traditionalUse: string;
  cultivationTip?: string;
  observation?: string;
  source?: string;
  notes?: string;
  submittedBy: string;
  status: CommunitySubmissionStatus;
  createdAt: string;
}

export interface HealthVideoSubmission {
  id: string;
  userId: string;
  description?: string;
  language: "en" | "hi";
  mockTranscript: string;
  summary: string;
  relatedPlantIds: string[];
  createdAt: string;
  isEmergency: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "user" | "volunteer" | "admin";
  savedPlantIds: string[];
  adoptedTreeIds: string[];
}
