import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { Card, Badge } from "@/components/Primitives";
import { PLANTS } from "@/data/plants";
import { EVIDENCE_META, type EvidenceLevel } from "@/types";
import Svg, { Path } from "react-native-svg";

const FRAMEWORK = [
  { title: "Traditional Knowledge", body: "Passed down through generations, households, or cultural practice. Valuable, but not the same as clinical proof.", icon: "🌿" },
  { title: "Preclinical Research", body: "Lab or animal studies exploring how a compound might work. An early signal, not confirmation in humans.", icon: "🧪" },
  { title: "Human Studies", body: "Small or limited human trials. May point in a direction, but often too small to be conclusive.", icon: "🧑‍🤝‍🧑" },
  { title: "Clinical Evidence", body: "Larger, rigorous human trials. The strongest tier — and still rare for most traditional plant remedies.", icon: "🔬" },
];

const LEVELS: EvidenceLevel[] = ["strong", "limited", "traditional_only", "insufficient", "unavailable"];

export default function EvidenceGuide() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row items-center px-5 pt-3 pb-1 gap-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-canopy-50 items-center justify-center">
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#2C6E3B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </Pressable>
          <Text className="font-display text-2xl text-canopy-950">What does the evidence say?</Text>
        </View>
        <Text className="px-5 font-body text-sm text-canopy-800/70 mt-1 mb-5">
          Understand the difference between traditional knowledge, scientific research, and unsupported claims —
          before you trust a home remedy.
        </Text>

        {/* Framework */}
        <View className="px-5">
          <Text className="font-body-semibold text-xs text-canopy-700/60 uppercase tracking-wide mb-3">Visual evidence framework</Text>
          <View className="gap-3">
            {FRAMEWORK.map((f, i) => (
              <MotiView key={f.title} from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 90 }}>
                <Card className="flex-row items-center gap-3">
                  <Text className="text-2xl">{f.icon}</Text>
                  <View className="flex-1">
                    <Text className="font-body-bold text-canopy-950">{f.title}</Text>
                    <Text className="text-xs text-canopy-800/70 mt-0.5 leading-4">{f.body}</Text>
                  </View>
                  {i < FRAMEWORK.length - 1 && <Text className="text-canopy-400 text-lg">→</Text>}
                </Card>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Labels used in this app */}
        <View className="px-5 mt-8">
          <Text className="font-body-semibold text-xs text-canopy-700/60 uppercase tracking-wide mb-3">How GreenRoots labels every plant</Text>
          <View className="gap-3">
            {LEVELS.map((level) => {
              const meta = EVIDENCE_META[level];
              const count = PLANTS.filter((p) => p.evidenceLevel === level).length;
              return (
                <Card key={level}>
                  <View className="flex-row items-center justify-between mb-1">
                    <Badge label={meta.label} color={meta.color} />
                    <Text className="text-xs text-canopy-700/50">{count} plant{count !== 1 ? "s" : ""}</Text>
                  </View>
                  <Text className="text-xs text-canopy-800/70 leading-5">
                    {level === "strong" && "Supported by larger, rigorous human clinical trials with consistent results."}
                    {level === "limited" && "Some human or preclinical research exists, but studies are small, mixed, or preliminary."}
                    {level === "traditional_only" && "Documented traditional/cultural use, with little to no formal scientific study yet."}
                    {level === "insufficient" && "Available research is too weak, inconsistent, or narrow to draw a conclusion."}
                    {level === "unavailable" && "Reliable safety data could not be confirmed for this preparation — treat with extra caution."}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>

        <View className="px-5 mt-8">
          <Card className="bg-cream-100 border-bark-200">
            <Text className="font-body-bold text-bark-700 mb-1">A reminder</Text>
            <Text className="text-xs text-bark-600 leading-5">
              Traditional use does not automatically mean proven effectiveness — and it does not mean a plant is
              automatically safe for everyone, either. Evidence labels help you ask better questions, not skip the
              conversation with a qualified healthcare professional.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
