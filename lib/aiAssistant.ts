import { PLANTS } from "@/data/plants";
import { EVIDENCE_META } from "@/types";
import { EMERGENCY_MESSAGE, isEmergencyText } from "./emergency";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const ASSISTANT_DISCLAIMER =
  "This AI assistant provides general educational information only. It is not a doctor and cannot diagnose or treat medical conditions.";

const SYSTEM_INSTRUCTION = `You are the GreenRoots Plant & Health Assistant, an educational assistant embedded in a tree-verification and plant-knowledge app.
Rules you must always follow:
- Respond in simple English (or Hindi if the user writes in Hindi).
- Clearly separate traditional use from scientific evidence; mention uncertainty where it exists.
- Never diagnose a disease, never prescribe a treatment or dosage, never tell a user to stop a prescribed medicine, never guarantee a cure.
- Always include relevant safety warnings (allergy, medicine interaction, pregnancy/breastfeeding, children) when discussing a specific plant or remedy.
- If the user describes symptoms, give general educational information only and recommend consulting a qualified healthcare professional, especially if symptoms are persistent, severe, or worsening.
- Ask a brief clarifying question when the request is ambiguous.
- Keep answers concise (roughly 80-150 words) and end with a short safety or "consult a professional" note when discussing any remedy.
- Never use unsupported claims such as "cures", "guaranteed remedy", "no side effects", or "safe for everyone".`;

function findMentionedPlant(text: string) {
  const lower = text.toLowerCase();
  return PLANTS.find(
    (p) =>
      lower.includes(p.commonName.toLowerCase()) ||
      lower.includes(p.scientificName.toLowerCase()) ||
      lower.includes(p.id)
  );
}

function ruleBasedReply(userText: string): string {
  const plant = findMentionedPlant(userText);
  const lower = userText.toLowerCase();

  if (!plant) {
    if (/garden|grow|home garden|balcony/.test(lower)) {
      const suggestions = PLANTS.slice(0, 5).map((p) => p.commonName).join(", ");
      return `A few beginner-friendly options for a home garden include: ${suggestions}. Most of these are low-maintenance and tolerate pots well. Open any plant's profile in the Library for exact sunlight, watering, and soil needs.\n\n${ASSISTANT_DISCLAIMER}`;
    }
    if (/medicine|interact|combine/.test(lower)) {
      return `Herbal or plant-based products can interact with prescribed medicines by changing how the body absorbs or processes them — this is true even for common kitchen ingredients like ginger, garlic, or turmeric at concentrated doses. Always tell your doctor or pharmacist about any herbal products you use regularly, especially before surgery or if you're on blood thinners, diabetes medication, or thyroid medication.\n\n${ASSISTANT_DISCLAIMER}`;
    }
    return `I can share general educational information about plants, traditional uses, care, and safety — for example, try asking "What are the traditional uses of Tulsi?" or "Is Aloe vera safe during pregnancy?". Could you tell me which plant or topic you're curious about?\n\n${ASSISTANT_DISCLAIMER}`;
  }

  const evidence = EVIDENCE_META[plant.evidenceLevel].label;
  const uses = plant.traditionalUses.slice(0, 2).join(" ");
  let answer = `${plant.commonName} (${plant.scientificName}) — ${evidence}.\n\nTraditionally, it is used as follows: ${uses} Research on these specific uses is still developing, so this should be treated as traditional knowledge rather than a proven medical treatment.\n\n`;

  if (/pregnan|breastfeed/.test(lower)) {
    answer += `Regarding pregnancy/breastfeeding: ${plant.pregnancyWarning}\n\n`;
  } else if (/child|kid|baby/.test(lower)) {
    answer += `Regarding children: ${plant.childSafetyWarning}\n\n`;
  } else if (/medicine|interact/.test(lower)) {
    answer += `Regarding medicine interactions: ${plant.medicineInteractionWarning}\n\n`;
  } else if (/safe|side effect/.test(lower)) {
    answer += `Safety note: ${plant.sideEffects[0] ?? "Individual reactions can vary."} ${plant.allergyWarning}\n\n`;
  }

  answer += `Consult a qualified healthcare professional before using this for a specific health concern, especially if you are pregnant, breastfeeding, managing a condition, or taking medication.\n\n${ASSISTANT_DISCLAIMER}`;
  return answer;
}

async function geminiReply(userText: string, historyText: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [
            { role: "user", parts: [{ text: `Conversation so far:\n${historyText}\n\nUser: ${userText}` }] },
          ],
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

export async function getAssistantReply(userText: string, historyText = ""): Promise<string> {
  if (isEmergencyText(userText)) {
    return `${EMERGENCY_MESSAGE}\n\nI'm an educational assistant and can't help with urgent or emergency symptoms — please seek immediate medical care.`;
  }

  const aiReply = await geminiReply(userText, historyText);
  if (aiReply) {
    return aiReply.includes(ASSISTANT_DISCLAIMER) ? aiReply : `${aiReply}\n\n${ASSISTANT_DISCLAIMER}`;
  }

  return ruleBasedReply(userText);
}

export const SUGGESTED_QUESTIONS = [
  "What are the traditional uses of Tulsi?",
  "Is Aloe vera safe for everyone?",
  "Can herbs interact with medicines?",
  "Which plants are suitable for a home garden?",
  "What should I know before using an herbal remedy?",
];
