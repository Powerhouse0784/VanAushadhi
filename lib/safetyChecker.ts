import type { PlantProfile, SafetyCheckInput, SafetyCheckResult, SafetyLevel } from "@/types";

/**
 * PROTOTYPE rule-based safety logic.
 * This is intentionally simple pattern-matching against the plant's own
 * documented warnings — it is NOT a clinical decision tool and must never be
 * presented as medical clearance. See disclaimer in the returned result.
 */
export function runSafetyCheck(plant: PlantProfile, input: SafetyCheckInput): SafetyCheckResult {
  const allergyWarnings: string[] = [];
  const interactionWarnings: string[] = [];
  const pregnancyChildWarnings: string[] = [];
  const questionsForProfessional: string[] = [];

  let riskPoints = 0;

  if (input.allergies.trim().length > 0) {
    allergyWarnings.push(plant.allergyWarning);
    allergyWarnings.push(
      `You mentioned allergies (${input.allergies.trim()}). Introduce any new plant-based product in a very small amount first and stop immediately if you notice itching, swelling, or rash.`
    );
    riskPoints += 1;
  }

  if (input.currentMedicines.trim().length > 0) {
    interactionWarnings.push(plant.medicineInteractionWarning);
    interactionWarnings.push(
      `You listed current medicines (${input.currentMedicines.trim()}). Herbal products can change how medicines are absorbed or processed by the body.`
    );
    questionsForProfessional.push(
      `Could ${plant.commonName} interact with any of my current medicines (${input.currentMedicines.trim()})?`
    );
    riskPoints += 2;
  }

  if (input.healthConditions.trim().length > 0) {
    questionsForProfessional.push(
      `Is ${plant.commonName} appropriate given my health condition(s): ${input.healthConditions.trim()}?`
    );
    riskPoints += 1;
  }

  if (input.pregnancyStatus === "pregnant" || input.pregnancyStatus === "breastfeeding") {
    pregnancyChildWarnings.push(plant.pregnancyWarning);
    questionsForProfessional.push(
      `Is ${plant.commonName} safe to use while ${input.pregnancyStatus === "pregnant" ? "pregnant" : "breastfeeding"}?`
    );
    riskPoints += 2;
  }

  if (input.ageGroup === "child") {
    pregnancyChildWarnings.push(plant.childSafetyWarning);
    questionsForProfessional.push(`What is an appropriate, safe way (if any) to introduce ${plant.commonName} for a child?`);
    riskPoints += 2;
  }

  if (plant.whenNotToUse.length > 0) {
    questionsForProfessional.push(`Do any of these apply to me: ${plant.whenNotToUse.join("; ")}?`);
  }

  let level: SafetyLevel = "generally_low_concern";
  if (riskPoints >= 4) level = "avoid_without_advice";
  else if (riskPoints >= 1) level = "use_caution";

  if (allergyWarnings.length === 0) {
    allergyWarnings.push(
      "No allergies were mentioned, but individual reactions can still occur. Discontinue use if any unusual symptoms appear."
    );
  }
  if (interactionWarnings.length === 0) {
    interactionWarnings.push(plant.medicineInteractionWarning);
  }
  if (pregnancyChildWarnings.length === 0) {
    pregnancyChildWarnings.push(
      "No pregnancy, breastfeeding, or child-specific flags were raised for this input, but the plant's own precautions above still apply."
    );
  }

  return {
    level,
    allergyWarnings,
    interactionWarnings,
    pregnancyChildWarnings,
    questionsForProfessional:
      questionsForProfessional.length > 0
        ? questionsForProfessional
        : [`Is regular use of ${plant.commonName} appropriate for my overall health profile?`],
    disclaimer:
      "This is a prototype educational safety check using simple rule-based logic — it is not medical clearance, a diagnosis, or a substitute for professional advice. Always consult a qualified healthcare professional before starting any herbal or plant-based remedy, especially if you are pregnant, breastfeeding, managing a health condition, or taking medication.",
  };
}

export const SAFETY_LEVEL_META: Record<SafetyLevel, { label: string; color: string }> = {
  generally_low_concern: { label: "Generally low concern (prototype)", color: "#2C6E3B" },
  use_caution: { label: "Use caution — check the details", color: "#C99A2E" },
  avoid_without_advice: { label: "Avoid without professional advice", color: "#B3392C" },
};
