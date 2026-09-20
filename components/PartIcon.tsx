import React from "react";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";

type PartKind = "leaf" | "bark" | "seed" | "flower" | "root" | "fruit" | "stem" | "whole";

function guessPart(label: string): PartKind {
  const l = label.toLowerCase();
  if (l.includes("leaf") || l.includes("leaves")) return "leaf";
  if (l.includes("bark")) return "bark";
  if (l.includes("seed")) return "seed";
  if (l.includes("flower")) return "flower";
  if (l.includes("root")) return "root";
  if (l.includes("fruit") || l.includes("berry") || l.includes("rind")) return "fruit";
  if (l.includes("stem") || l.includes("stalk") || l.includes("twig")) return "stem";
  return "whole";
}

const ICONS: Record<PartKind, (color: string) => React.ReactElement> = {
  leaf: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20 4C10 4 4 10 4 18c0 1 .8 1.8 1.8 1.8C15 19.8 20 13.8 20 4Z" stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M6 18C10 13 14 9 19 5" stroke={c} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  ),
  bark: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M5 3v18M9 3v18M13 3v18M17 3v18" stroke={c} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M5 7c2 1 2 -1 4 0M9 13c2 1 2 -1 4 0M13 9c2 1 2 -1 4 0" stroke={c} strokeWidth={1} strokeLinecap="round" />
    </Svg>
  ),
  seed: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="9" cy="12" rx="3" ry="5" stroke={c} strokeWidth={1.6} />
      <Ellipse cx="16" cy="14" rx="2.4" ry="4" stroke={c} strokeWidth={1.6} />
    </Svg>
  ),
  flower: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="2.4" stroke={c} strokeWidth={1.5} />
      <Circle cx="12" cy="6" r="2.6" stroke={c} strokeWidth={1.3} />
      <Circle cx="12" cy="18" r="2.6" stroke={c} strokeWidth={1.3} />
      <Circle cx="6" cy="12" r="2.6" stroke={c} strokeWidth={1.3} />
      <Circle cx="18" cy="12" r="2.6" stroke={c} strokeWidth={1.3} />
    </Svg>
  ),
  root: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v7M12 10c-3 1-4 4-4 8M12 10c3 1 5 3 5 7M12 10c-2 2-2 5-1 8" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  ),
  fruit: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="6.5" stroke={c} strokeWidth={1.6} />
      <Path d="M12 7.5c0-2 1.5-3 2.5-3.5" stroke={c} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  ),
  stem: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21V6M8 10l4-4 4 4" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  whole: (c) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={c} strokeWidth={1.6} />
    </Svg>
  ),
};

export default function PartIcon({ label, color = "#2C6E3B" }: { label: string; color?: string }) {
  const kind = guessPart(label);
  return ICONS[kind](color);
}
