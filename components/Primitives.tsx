import React from "react";
import { View, Text, ViewProps } from "react-native";

export function Card({ children, style, className = "" }: ViewProps & { className?: string }) {
  return (
    <View
      className={`bg-cream-50 dark:bg-canopy-950 rounded-3xl p-4 border border-bark-100 dark:border-canopy-800 ${className}`}
      style={[
        { shadowColor: "#0F2A17", shadowOpacity: 0.05, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 1 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg?: string;
}) {
  return (
    <View
      className="px-2.5 py-1 rounded-full self-start"
      style={{ backgroundColor: bg ?? `${color}1A` }}
    >
      <Text style={{ color }} className="text-xs font-body-semibold">
        {label}
      </Text>
    </View>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-end justify-between mb-3">
      <View className="flex-1 pr-2">
        <Text className="text-canopy-950 dark:text-cream-100 font-display text-xl">{title}</Text>
        {subtitle ? (
          <Text className="text-canopy-700/70 dark:text-canopy-200/70 font-body text-sm mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function Divider() {
  return <View className="h-px bg-canopy-100 dark:bg-canopy-800 my-3" />;
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <View
      className={`px-3.5 py-2 rounded-full mr-2 ${
        active ? "bg-canopy-600" : "bg-canopy-50 dark:bg-canopy-900 border border-canopy-100 dark:border-canopy-800"
      }`}
      onTouchEnd={onPress}
    >
      <Text className={`text-sm font-body-medium ${active ? "text-white" : "text-canopy-700 dark:text-canopy-200"}`}>
        {label}
      </Text>
    </View>
  );
}
