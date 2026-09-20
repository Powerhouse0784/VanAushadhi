import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "./Primitives";
import BotanicalAccent from "./BotanicalAccent";
import AppImage from "./AppImage";

function QuickIcon({ onPress, children, label }: { onPress: () => void; children: React.ReactNode; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      className="w-10 h-10 rounded-full bg-canopy-50 dark:bg-canopy-900 items-center justify-center"
    >
      {children}
    </Pressable>
  );
}

export default function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { session } = useAuth();
  const p = { stroke: "#2C6E3B", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  return (
    <View className="px-5 pt-3 pb-2 flex-row items-center justify-between" style={{ overflow: "hidden" }}>
      <BotanicalAccent size={110} color="#2C6E3B" opacity={0.06} style={{ position: "absolute", top: -20, right: 40 }} />
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2">
          <View style={{ width: 26, height: 26, borderRadius: 13, overflow: "hidden" }}>
            <AppImage imageKey="logo-vanaushadhi" label="Logo" icon="tree" />
          </View>
          <Text className="font-display text-2xl text-canopy-950 dark:text-cream-100">{title}</Text>
          {session?.role !== "visitor" ? <Badge label={session?.role ?? ""} color="#2C6E3B" /> : null}
        </View>
        {subtitle ? <Text className="text-canopy-700/70 dark:text-canopy-200/70 font-body text-sm mt-0.5">{subtitle}</Text> : null}
      </View>
      <View className="flex-row gap-2">
        <QuickIcon label="Evidence guide" onPress={() => router.push("/(app)/evidence" as any)}>
          <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" {...p} /></Svg>
        </QuickIcon>
        <QuickIcon label="Health video education" onPress={() => router.push("/(app)/video" as any)}>
          <Svg width={18} height={18} viewBox="0 0 24 24"><Rect x="3" y="6" width="13" height="12" rx="2.5" {...p} /><Path d="m16 10.5 5-3v9l-5-3" {...p} /></Svg>
        </QuickIcon>
        <QuickIcon label="Community knowledge" onPress={() => router.push("/(app)/community" as any)}>
          <Svg width={18} height={18} viewBox="0 0 24 24"><Circle cx="8" cy="9" r="3" {...p} /><Circle cx="16" cy="9" r="3" {...p} /><Path d="M2 20c1-3.5 3.5-5 6-5s5 1.5 6 5M10 20c1-3.5 3.5-5 6-5s5 1.5 6 5" {...p} /></Svg>
        </QuickIcon>
        {session?.role === "admin" ? (
          <QuickIcon label="Admin dashboard" onPress={() => router.push("/(app)/admin" as any)}>
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" {...p} /><Path d="m8.5 12 2.5 2.5 4.5-5" {...p} /></Svg>
          </QuickIcon>
        ) : null}
      </View>
    </View>
  );
}
