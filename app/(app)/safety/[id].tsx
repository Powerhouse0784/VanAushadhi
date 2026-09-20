import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import Svg, { Path } from "react-native-svg";
import { Card, Chip, Badge } from "@/components/Primitives";
import AlertCard from "@/components/AlertCard";
import Button from "@/components/Button";
import { getPlantById } from "@/data/plants";
import { runSafetyCheck, SAFETY_LEVEL_META } from "@/lib/safetyChecker";
import { useAppData } from "@/context/AppDataContext";
import type { SafetyCheckInput, SafetyCheckResult } from "@/types";

const AGE_GROUPS: SafetyCheckInput["ageGroup"][] = ["child", "teen", "adult", "senior"];
const PREGNANCY: SafetyCheckInput["pregnancyStatus"][] = ["none", "pregnant", "breastfeeding", "not_applicable"];

export default function SafetyChecker() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlantById(id);
  const { addSafetyHistory } = useAppData();

  const [ageGroup, setAgeGroup] = useState<SafetyCheckInput["ageGroup"]>("adult");
  const [pregnancyStatus, setPregnancyStatus] = useState<SafetyCheckInput["pregnancyStatus"]>("none");
  const [allergies, setAllergies] = useState("");
  const [currentMedicines, setCurrentMedicines] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [result, setResult] = useState<SafetyCheckResult | null>(null);

  if (!plant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <Text className="text-center mt-20 text-canopy-700">Plant not found.</Text>
      </SafeAreaView>
    );
  }

  const runCheck = () => {
    const input: SafetyCheckInput = { plantId: plant.id, ageGroup, pregnancyStatus, allergies, currentMedicines, healthConditions, intendedUse };
    const res = runSafetyCheck(plant, input);
    setResult(res);
    addSafetyHistory({ plantId: plant.id, input, result: res });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 mb-4">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-canopy-50 items-center justify-center">
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#2C6E3B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </Pressable>
          <Text className="font-display text-2xl text-canopy-950">Safety Checker</Text>
        </View>
        <Text className="text-sm text-canopy-700/70 mb-5">
          For <Text className="font-body-bold">{plant.commonName}</Text> — this is a prototype rule-based tool, not medical clearance.
        </Text>

        {!result ? (
          <>
            <Card className="mb-4">
              <Text className="font-body-bold text-canopy-950 mb-2">Age group</Text>
              <View className="flex-row flex-wrap gap-2">
                {AGE_GROUPS.map((a) => (
                  <Pressable key={a} onPress={() => setAgeGroup(a)}>
                    <Chip label={a} active={ageGroup === a} />
                  </Pressable>
                ))}
              </View>
            </Card>

            <Card className="mb-4">
              <Text className="font-body-bold text-canopy-950 mb-2">Pregnancy / breastfeeding status</Text>
              <View className="flex-row flex-wrap gap-2">
                {PREGNANCY.map((p) => (
                  <Pressable key={p} onPress={() => setPregnancyStatus(p)}>
                    <Chip label={p.replace("_", " ")} active={pregnancyStatus === p} />
                  </Pressable>
                ))}
              </View>
            </Card>

            <Card className="mb-4">
              <Text className="font-body-bold text-canopy-950 mb-2">Known allergies</Text>
              <TextInput value={allergies} onChangeText={setAllergies} placeholder="e.g. none, pollen, latex..." className="border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm" />
            </Card>

            <Card className="mb-4">
              <Text className="font-body-bold text-canopy-950 mb-2">Current medicines</Text>
              <TextInput value={currentMedicines} onChangeText={setCurrentMedicines} placeholder="e.g. blood thinners, diabetes medication..." className="border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm" />
            </Card>

            <Card className="mb-4">
              <Text className="font-body-bold text-canopy-950 mb-2">Existing health conditions</Text>
              <TextInput value={healthConditions} onChangeText={setHealthConditions} placeholder="e.g. none, thyroid condition..." className="border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm" />
            </Card>

            <Card className="mb-5">
              <Text className="font-body-bold text-canopy-950 mb-2">Intended use</Text>
              <TextInput value={intendedUse} onChangeText={setIntendedUse} placeholder="e.g. occasional tea, skin application..." className="border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm" />
            </Card>

            <Button label="Run safety check" onPress={runCheck} fullWidth size="lg" />
          </>
        ) : (
          <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}>
            <Card className="mb-4 items-center py-5">
              <Badge label={SAFETY_LEVEL_META[result.level].label} color={SAFETY_LEVEL_META[result.level].color} />
              <Text className="text-xs text-canopy-700/60 mt-2">for {plant.commonName}</Text>
            </Card>

            <AlertCard tone="warning" title="Allergy warnings">
              <View>{result.allergyWarnings.map((w) => <Text key={w} className="text-sm text-bark-700 mb-1">• {w}</Text>)}</View>
            </AlertCard>
            <View className="h-3" />
            <AlertCard tone="warning" title="Medicine interaction warnings">
              <View>{result.interactionWarnings.map((w) => <Text key={w} className="text-sm text-bark-700 mb-1">• {w}</Text>)}</View>
            </AlertCard>
            <View className="h-3" />
            <AlertCard tone="danger" title="Pregnancy & child-safety concerns">
              <View>{result.pregnancyChildWarnings.map((w) => <Text key={w} className="text-sm mb-1">• {w}</Text>)}</View>
            </AlertCard>
            <View className="h-3" />
            <Card className="mb-3">
              <Text className="font-body-bold text-canopy-950 mb-2">Questions to ask a healthcare professional</Text>
              {result.questionsForProfessional.map((q) => (
                <Text key={q} className="text-sm text-canopy-800/80 mb-1">• {q}</Text>
              ))}
            </Card>
            <AlertCard tone="danger" title="Important">
              {result.disclaimer}
            </AlertCard>

            <View className="flex-row gap-3 mt-5">
              <View className="flex-1"><Button label="Run again" variant="outline" fullWidth onPress={() => setResult(null)} /></View>
              <View className="flex-1"><Button label="Back to plant" fullWidth onPress={() => router.replace(`/(app)/plant/${plant.id}` as any)} /></View>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
