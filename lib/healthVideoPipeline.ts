import { PLANTS } from "@/data/plants";
import { EMERGENCY_MESSAGE, isEmergencyText } from "./emergency";

export const VIDEO_FEATURE_LABEL = "AI-assisted health concern summarization and education";

export const VIDEO_FEATURE_DISCLAIMER =
  "This tool provides general educational information only. It does not diagnose, does not replace a doctor, and does not guarantee any outcome.";

interface PipelineResult {
  transcript: string;
  summary: string;
  relatedPlantIds: string[];
  isEmergency: boolean;
}

const CONCERN_LIBRARY: { keywords: RegExp; concern: string; plantIds: string[]; guidance: string }[] = [
  {
    keywords: /throat|cough|cold/i,
    concern: "throat discomfort or a mild cough/cold",
    plantIds: ["tulsi", "ginger", "mint"],
    guidance:
      "General information around hydration, rest, warm fluids, and commonly discussed ingredients such as tulsi, ginger, or mint may be relevant. Persistent, severe, or worsening symptoms — or symptoms lasting more than a few days — should be assessed by a qualified healthcare professional.",
  },
  {
    keywords: /digest|stomach|indigestion|bloat/i,
    concern: "digestive discomfort",
    plantIds: ["mint", "ginger"],
    guidance:
      "General information about mild digestive discomfort often includes hydration, smaller meals, and commonly discussed ingredients such as mint or ginger tea. Severe abdominal pain, persistent vomiting, or blood in stool needs prompt professional medical evaluation.",
  },
  {
    keywords: /skin|rash|itch|acne/i,
    concern: "a minor skin concern",
    plantIds: ["neem", "aloevera", "turmeric"],
    guidance:
      "General information about minor skin concerns sometimes references topical ingredients such as aloe vera or neem, used externally in small patch tests first. Spreading rashes, signs of infection, or no improvement over time should be evaluated by a dermatologist or doctor.",
  },
  {
    keywords: /immun|energy|fatigue|tired|weak/i,
    concern: "general immunity, energy, or fatigue",
    plantIds: ["amla", "moringa", "ashwagandha"],
    guidance:
      "General wellness information often references a balanced diet, sleep, and nutrient-dense foods such as amla or moringa. Persistent fatigue, especially if sudden or severe, should be discussed with a doctor since it can have many underlying causes.",
  },
];

function buildMockTranscript(description: string, language: "en" | "hi"): string {
  const base = description?.trim()
    ? description.trim()
    : language === "hi"
    ? "मुझे कुछ दिनों से हल्की तकलीफ महसूस हो रही है। क्या मुझे कोई सामान्य जानकारी मिल सकती है?"
    : "I have had some mild discomfort for a couple of days. Is there any general information I should know?";
  return `[Mock transcript — speech-to-text not configured in this prototype]\n"${base}"`;
}

export function runHealthVideoPipeline(description: string, language: "en" | "hi"): PipelineResult {
  const sourceText = description || "";
  if (isEmergencyText(sourceText)) {
    return {
      transcript: buildMockTranscript(description, language),
      summary: EMERGENCY_MESSAGE,
      relatedPlantIds: [],
      isEmergency: true,
    };
  }

  const match = CONCERN_LIBRARY.find((c) => c.keywords.test(sourceText));
  const transcript = buildMockTranscript(description, language);

  const summary = match
    ? `The video/description appears to describe ${match.concern}. This is not a diagnosis. ${match.guidance}\n\n${VIDEO_FEATURE_DISCLAIMER}`
    : `The video/description has been reviewed at a general level. This is not a diagnosis. General educational information related to hydration, rest, and balanced nutrition may be relevant, alongside relevant plant profiles in the Library. Persistent, severe, or worsening symptoms should be assessed by a qualified healthcare professional.\n\n${VIDEO_FEATURE_DISCLAIMER}`;

  const relatedPlantIds = match ? match.plantIds.filter((id) => PLANTS.some((p) => p.id === id)) : [];

  return { transcript, summary, relatedPlantIds, isEmergency: false };
}
