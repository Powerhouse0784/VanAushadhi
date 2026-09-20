import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import Svg, { Path } from "react-native-svg";
import { Card, Badge, SectionHeader, Divider } from "@/components/Primitives";
import { EvidenceBadge } from "@/components/StatusBadges";
import AlertCard from "@/components/AlertCard";
import Button from "@/components/Button";
import AppImage from "@/components/AppImage";
import BotanicalAccent from "@/components/BotanicalAccent";
import PartIcon from "@/components/PartIcon";
import { getPlantById, PLANTS } from "@/data/plants";
import { EVIDENCE_META } from "@/types";
import { useAppData } from "@/context/AppDataContext";

function BackButton() {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/(app)/dashboard" as any))}
      className="w-10 h-10 rounded-full bg-white/15 items-center justify-center"
    >
      <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
    </Pressable>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 min-w-[45%]">
      <Text className="text-[11px] text-canopy-200/70 font-body-medium uppercase tracking-wide">{label}</Text>
      <Text className="text-sm text-white font-body-medium mt-0.5">{value}</Text>
    </View>
  );
}

export default function PlantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlantById(id);
  const { savedPlantIds, toggleSavedPlant } = useAppData();

  if (!plant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <Text className="text-center mt-20 text-canopy-700">Plant not found.</Text>
      </SafeAreaView>
    );
  }

  const saved = savedPlantIds.includes(plant.id);
  const evidence = EVIDENCE_META[plant.evidenceLevel];
  const related = PLANTS.filter((p) => plant.relatedPlantIds.includes(p.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <LinearGradient colors={["#0F2A17", "#22562F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingBottom: 24, overflow: "hidden" }}>
          <BotanicalAccent size={190} style={{ position: "absolute", top: -20, right: -30 }} opacity={0.1} />
          <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
            <BackButton />
            <Pressable onPress={() => toggleSavedPlant(plant.id)} className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
              <Text style={{ color: saved ? "#8CCC99" : "#fff", fontSize: 16 }}>{saved ? "★" : "☆"}</Text>
            </Pressable>
          </View>

          <View className="px-5 flex-row gap-4">
            <View style={{ width: 96, height: 96, borderRadius: 20, overflow: "hidden" }}>
              <AppImage imageKey={`plant-${plant.id}-1`} label={`${plant.commonName} photo`} icon="leaf" />
            </View>
            <View className="flex-1">
              <Text className="font-display text-2xl text-white leading-8">{plant.commonName}</Text>
              <Text className="text-canopy-200/80 text-sm" style={{ fontStyle: "italic" }}>{plant.scientificName}</Text>
              <Text className="text-canopy-200/70 text-sm mt-0.5">{plant.localName} · {plant.category}</Text>
              <View className="mt-2"><EvidenceBadge level={plant.evidenceLevel} /></View>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-4 px-5 mt-5">
            <InfoBlock label="Sunlight" value={plant.sunlight} />
            <InfoBlock label="Watering" value={plant.watering} />
          </View>

          <View className="flex-row gap-3 px-5 mt-5">
            <View className="flex-1"><Button label="Safety checker" variant="secondary" fullWidth onPress={() => router.push(`/(app)/safety/${plant.id}` as any)} /></View>
            <View className="flex-1"><Button label="Ask assistant" fullWidth onPress={() => router.push("/(app)/assistant" as any)} /></View>
          </View>
        </LinearGradient>

        <View className="px-5 mt-6">
          <Card>
            <SectionHeader title="Overview" />
            <Text className="font-body text-sm text-canopy-800/80 leading-6 mb-3">{plant.identificationFeatures}</Text>
            <Divider />
            <Text className="font-body-semibold text-canopy-950 text-sm mb-1">Habitat & growing conditions</Text>
            <Text className="font-body text-sm text-canopy-800/70 leading-5 mb-2">{plant.habitat}</Text>
            <Text className="font-body text-sm text-canopy-800/70 leading-5">{plant.climateAndSoil}</Text>
          </Card>
        </View>

        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Parts commonly used" />
            <View className="flex-row flex-wrap gap-3">
              {plant.partsUsed.map((part) => (
                <View key={part} className="items-center" style={{ width: 74 }}>
                  <View className="w-14 h-14 rounded-full bg-canopy-50 dark:bg-canopy-900 border border-canopy-100 dark:border-canopy-800 items-center justify-center mb-1.5">
                    <PartIcon label={part} color="#2C6E3B" />
                  </View>
                  <Text className="text-[11px] text-center font-body-medium text-canopy-800 dark:text-canopy-200" numberOfLines={2}>
                    {part}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Care instructions" />
            {plant.careInstructions.map((c) => (
              <View key={c} className="flex-row gap-2 mb-1.5">
                <Text className="text-canopy-500">•</Text>
                <Text className="flex-1 font-body text-sm text-canopy-800/80">{c}</Text>
              </View>
            ))}
          </Card>
        </View>

        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Traditional knowledge" subtitle={evidence.label} />
            {plant.traditionalUses.map((u) => (
              <View key={u} className="flex-row gap-2 mb-1.5">
                <Text className="text-canopy-500">•</Text>
                <Text className="flex-1 font-body text-sm text-canopy-800/80">{u}</Text>
              </View>
            ))}
            {plant.preparationInfo ? (
              <View className="mt-3 bg-cream-100 rounded-2xl p-3 border border-bark-200">
                <Text className="font-body-semibold text-xs text-bark-700 mb-1">Traditional preparation</Text>
                <Text className="font-body text-xs text-bark-600 leading-5">{plant.preparationInfo}</Text>
              </View>
            ) : null}
            {plant.nutrition ? (
              <View className="mt-3">
                <Text className="font-body-semibold text-xs text-canopy-800 mb-1">Nutrition</Text>
                <Text className="font-body text-xs text-canopy-700/70 leading-5">{plant.nutrition}</Text>
              </View>
            ) : null}
            <View className="mt-3">
              <Pressable onPress={() => router.push("/(app)/evidence" as any)}>
                <Text className="text-canopy-600 font-body-semibold text-xs">What does "{evidence.label}" mean? →</Text>
              </Pressable>
            </View>
          </Card>
        </View>

        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Environmental benefits" />
            {plant.environmentalBenefits.map((b) => (
              <View key={b} className="flex-row gap-2 mb-1.5">
                <Text className="text-canopy-500">🌿</Text>
                <Text className="flex-1 font-body text-sm text-canopy-800/80">{b}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* SAFETY & NOTES — prominent */}
        <View className="px-5 mt-5 gap-3">
          <Text className="font-display text-xl text-canopy-950 mb-1">Safety & Notes</Text>
          <AlertCard tone="warning" title="Allergy warning">{plant.allergyWarning}</AlertCard>
          <AlertCard tone="warning" title="Medicine interactions">{plant.medicineInteractionWarning}</AlertCard>
          <AlertCard tone="danger" title="Pregnancy & breastfeeding">{plant.pregnancyWarning}</AlertCard>
          <AlertCard tone="danger" title="Child safety">{plant.childSafetyWarning}</AlertCard>

          <Card>
            <Text className="font-body-bold text-canopy-950 mb-2">When not to use</Text>
            {plant.whenNotToUse.map((w) => (
              <View key={w} className="flex-row gap-2 mb-1">
                <Text className="text-red-600">⛔</Text>
                <Text className="flex-1 font-body text-sm text-canopy-800/80">{w}</Text>
              </View>
            ))}
          </Card>
          <Card>
            <Text className="font-body-bold text-canopy-950 mb-2">When to consult a professional</Text>
            {plant.whenToConsult.map((w) => (
              <View key={w} className="flex-row gap-2 mb-1">
                <Text className="text-canopy-600">👩‍⚕️</Text>
                <Text className="flex-1 font-body text-sm text-canopy-800/80">{w}</Text>
              </View>
            ))}
          </Card>
        </View>

        {related.length > 0 && (
          <View className="px-5 mt-5">
            <SectionHeader title="Related plants" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {related.map((r) => (
                <Pressable key={r.id} onPress={() => router.push(`/(app)/plant/${r.id}` as any)} className="mr-3">
                  <Card className="w-40">
                    <View style={{ height: 70, borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                      <AppImage imageKey={`plant-${r.id}-1`} icon="leaf" />
                    </View>
                    <Text className="font-body-bold text-sm text-canopy-950" numberOfLines={1}>{r.commonName}</Text>
                    <EvidenceBadge level={r.evidenceLevel} />
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="px-5 mt-6">
          <Text className="text-center text-xs text-canopy-700/50 font-body leading-5">
            GreenRoots does not diagnose, prescribe, or guarantee any outcome. This page is general education only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
