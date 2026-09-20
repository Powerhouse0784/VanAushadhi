/**
 * VideoEducationCard — drop-in entry point to the Health Video Education flow.
 * Use anywhere (Dashboard, Profile, Assistant):
 *
 *   import VideoEducationCard from "@/components/VideoEducationCard";
 *   <VideoEducationCard />
 *
 * Self-contained: no dependency on Icons.tsx / FormField.tsx / ScreenScaffold.tsx.
 */
import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import Svg, { Path, Rect } from "react-native-svg";

const BARS = 16;

export default function VideoEducationCard({ hindi = false }: { hindi?: boolean }) {
  return (
    <Pressable
      onPress={() => router.push("/(app)/video" as any)}
      accessibilityRole="button"
      accessibilityLabel={hindi ? "स्वास्थ्य वीडियो शिक्षा खोलें" : "Open health video education"}
    >
      {({ pressed }) => (
        <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 110 }}>
          <LinearGradient
            colors={["#0F2A17", "#22562F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 18, overflow: "hidden" }}
          >
            <View className="flex-row items-center" style={{ gap: 14 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect x={3} y={6} width={13} height={12} rx={2.5} stroke="#B4DEBC" strokeWidth={1.8} />
                  <Path d="m16 10.5 5-3v9l-5-3" stroke="#B4DEBC" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View className="flex-1">
                <Text className="font-display text-lg text-white">
                  {hindi ? "स्वास्थ्य वीडियो शिक्षा" : "Health video education"}
                </Text>
                <Text style={{ color: "rgba(219,239,222,0.75)" }} className="font-body text-xs mt-0.5">
                  {hindi
                    ? "एक छोटा वीडियो या कुछ शब्द — सामान्य जानकारी, कोई निदान नहीं।"
                    : "A short clip or a few words — general info, never a diagnosis."}
                </Text>
              </View>
            </View>

            <View className="flex-row items-end justify-between mt-4">
              <View style={{ flexDirection: "row", alignItems: "center", height: 26, gap: 3 }}>
                {Array.from({ length: BARS }).map((_, i) => (
                  <MotiView
                    key={i}
                    from={{ height: 5 }}
                    animate={{ height: 6 + ((i * 7) % 5) * 4 }}
                    transition={{ type: "timing", duration: 420 + (i % 4) * 90, delay: i * 40, loop: true, repeatReverse: true }}
                    style={{ width: 3, borderRadius: 2, backgroundColor: "#8CCC99" }}
                  />
                ))}
              </View>
              <View style={{ backgroundColor: "#3D8A4E", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 }}>
                <Text className="font-body-semibold text-xs text-white">{hindi ? "शुरू करें →" : "Try it →"}</Text>
              </View>
            </View>
          </LinearGradient>
        </MotiView>
      )}
    </Pressable>
  );
}
