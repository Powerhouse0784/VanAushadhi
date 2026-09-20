import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import Svg, { Path, Circle } from "react-native-svg";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <View className="items-center justify-center py-16 gap-3">
      <ActivityIndicator size="small" color="#2C6E3B" />
      <Text className="text-canopy-700/70 dark:text-canopy-200/70 font-body text-sm">{label}</Text>
    </View>
  );
}

export function Skeleton({ height = 16, width = "100%", radius = 8 }: { height?: number; width?: number | string; radius?: number }) {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 0.9 }}
      transition={{ type: "timing", duration: 700, loop: true }}
      style={{ height, width: width as any, borderRadius: radius }}
      className="bg-canopy-100 dark:bg-canopy-800"
    />
  );
}

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="items-center justify-center py-14 px-6 gap-3">
      <View className="w-16 h-16 rounded-full bg-canopy-50 dark:bg-canopy-900 items-center justify-center">
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path d="M4 19c6-1 10-5 11-11" stroke="#5FAE70" strokeWidth={1.6} strokeLinecap="round" />
          <Circle cx="17" cy="6" r="2.4" fill="#8CCC99" />
        </Svg>
      </View>
      <Text className="text-canopy-950 dark:text-cream-100 font-body-semibold text-base text-center">{title}</Text>
      {subtitle ? (
        <Text className="text-canopy-700/70 dark:text-canopy-200/70 font-body text-sm text-center max-w-xs">
          {subtitle}
        </Text>
      ) : null}
      {action}
    </View>
  );
}

export function ErrorState({ title = "Something went wrong", subtitle }: { title?: string; subtitle?: string }) {
  return (
    <View className="items-center justify-center py-14 px-6 gap-2">
      <Text className="text-2xl">⚠️</Text>
      <Text className="text-canopy-950 dark:text-cream-100 font-body-semibold text-base">{title}</Text>
      {subtitle ? <Text className="text-canopy-700/70 dark:text-canopy-200/70 font-body text-sm text-center">{subtitle}</Text> : null}
    </View>
  );
}
