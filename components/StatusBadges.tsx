import React from "react";
import { View, Text } from "react-native";
import { Badge } from "./Primitives";
import { TREE_STATUS_META, EVIDENCE_META, type TreeStatus, type EvidenceLevel } from "@/types";

export function TreeStatusBadge({ status }: { status: TreeStatus }) {
  const meta = TREE_STATUS_META[status];
  return <Badge label={meta.label} color={meta.color} />;
}

// Solid pill styling for evidence levels — mirrors the "Traditional use /
// Research available / Evidence limited" tags from the VanAushadhi reference:
// sage-green for traditional/strong claims, tan for developing research,
// dusty rose for anything with limited or no safety data.
const EVIDENCE_PILL: Record<EvidenceLevel, { bg: string; text: string }> = {
  strong: { bg: "#2C6E3B", text: "#FFFFFF" },
  traditional_only: { bg: "#6B8F63", text: "#FFFFFF" },
  limited: { bg: "#E3D5B0", text: "#5C4A28" },
  insufficient: { bg: "#E3B7AE", text: "#7A2E22" },
  unavailable: { bg: "#E3B7AE", text: "#7A2E22" },
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const meta = EVIDENCE_META[level];
  const pill = EVIDENCE_PILL[level];
  return (
    <View className="px-3 py-1.5 rounded-full self-start" style={{ backgroundColor: pill.bg }}>
      <Text style={{ color: pill.text }} className="text-xs font-body-semibold">
        {meta.label}
      </Text>
    </View>
  );
}
