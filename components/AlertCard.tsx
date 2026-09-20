import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

type Tone = "warning" | "danger" | "info" | "success";

const TONE_STYLES: Record<Tone, { bg: string; border: string; text: string; icon: string }> = {
  warning: { bg: "#FBF1DA", border: "#E7BE6C", text: "#7A5A16", icon: "#C99A2E" },
  danger: { bg: "#FBE9E6", border: "#E19686", text: "#7A241A", icon: "#B3392C" },
  info: { bg: "#E7F1FA", border: "#8FBEE0", text: "#1F4E75", icon: "#2E6FA6" },
  success: { bg: "#E9F5EC", border: "#8FCB9E", text: "#194023", icon: "#2C6E3B" },
};

function WarningIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3 2 20h20L12 3Z" fill={color} opacity={0.15} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Circle cx="12" cy="16" r="1" fill={color} />
      <Path d="M12 9v4.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function AlertCard({
  title,
  children,
  tone = "warning",
}: {
  title?: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  const s = TONE_STYLES[tone];
  return (
    <View
      className="rounded-2xl p-4 flex-row gap-3"
      style={{ backgroundColor: s.bg, borderWidth: 1, borderColor: s.border }}
    >
      <View className="mt-0.5">
        <WarningIcon color={s.icon} />
      </View>
      <View className="flex-1">
        {title ? (
          <Text style={{ color: s.text }} className="font-body-semibold text-sm mb-1">
            {title}
          </Text>
        ) : null}
        {typeof children === "string" ? (
          <Text style={{ color: s.text }} className="font-body text-sm leading-5">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}
