import React from "react";
import { View, Text } from "react-native";
import { MotiView } from "moti";
import { Card } from "./Primitives";

export default function StatCard({
  label,
  value,
  accent = "#2C6E3B",
  delay = 0,
  sub,
}: {
  label: string;
  value: string;
  accent?: string;
  delay?: number;
  sub?: string;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 420, delay }}
      style={{ flexGrow: 1, flexBasis: "47%" }}
    >
      <Card className="p-4">
        <View className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: accent }} />
        <Text className="text-2xl font-display text-canopy-950 dark:text-cream-100">{value}</Text>
        <Text className="text-xs text-canopy-700/70 dark:text-canopy-200/70 font-body-medium mt-1">{label}</Text>
        {sub ? <Text className="text-[11px] text-canopy-600 mt-1">{sub}</Text> : null}
      </Card>
    </MotiView>
  );
}
