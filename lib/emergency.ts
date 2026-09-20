export const EMERGENCY_MESSAGE =
  "This may require urgent medical attention. Contact local emergency services or visit the nearest emergency department immediately.";

const EMERGENCY_PATTERNS: RegExp[] = [
  /breath(ing)?\s*(is\s*)?(difficult|hard|trouble)/i,
  /can'?t\s*breathe/i,
  /chest\s*pain/i,
  /unconscious/i,
  /passed?\s*out/i,
  /severe\s*bleed/i,
  /heavy\s*bleed/i,
  /stroke/i,
  /face\s*droop/i,
  /slurred\s*speech/i,
  /poison(ing)?/i,
  /severe\s*allerg/i,
  /throat\s*(closing|swelling)/i,
  /suicid/i,
  /self[-\s]?harm/i,
  /want to die/i,
  /rapidly\s*worsen/i,
  /seizure/i,
];

export function isEmergencyText(text: string): boolean {
  return EMERGENCY_PATTERNS.some((re) => re.test(text));
}
