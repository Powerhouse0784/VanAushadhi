import React from "react";
import { View, Text, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { Card, Badge } from "@/components/Primitives";
import AppImage from "@/components/AppImage";
import { DASHBOARD_STATS } from "@/data/trees";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    title: "Verified Tree IDs",
    body: "Every tree gets a GPS-tagged digital identity, a QR code, and a real survival timeline — not just a headline count.",
    icon: "🌱",
  },
  {
    title: "AI-Assisted Verification",
    body: "Before/after photo comparison flags trees that need a human look, instead of trusting numbers alone.",
    icon: "🔍",
  },
  {
    title: "Trusted Plant Knowledge",
    body: "Evidence-labelled plant profiles separate traditional use from science — with real safety warnings, not viral claims.",
    icon: "📖",
  },
  {
    title: "Safer Home Remedies",
    body: "A cautious AI assistant and rule-based safety checker flag allergy, medicine, pregnancy and child-safety concerns.",
    icon: "🛡️",
  },
  {
    title: "Volunteer Verification Loop",
    body: "Scan → photograph → GPS-stamp → status. Real accountability, cycle after cycle.",
    icon: "📍",
  },
  {
    title: "Community Knowledge",
    body: "Local, traditional plant knowledge can be submitted, reviewed, and responsibly labelled — not silently trusted.",
    icon: "🤝",
  },
];

export default function Landing() {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const { session } = useAuth();

  const goApp = () => router.push(session ? "/(app)/dashboard" : "/auth/login");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* NAV */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View className="flex-row items-center gap-2">
            <View style={{ width: 32, height: 32, borderRadius: 16, overflow: "hidden" }}>
              <AppImage imageKey="logo-vanaushadhi" label="Logo" icon="tree" />
            </View>
            <Text className="font-display text-canopy-950 text-lg">GreenRoots</Text>
          </View>
          <View className="flex-row gap-2">
            <Button label={session ? "Open dashboard" : "Log in"} size="sm" variant="ghost" onPress={goApp} />
          </View>
        </View>

        {/* HERO */}
        <LinearGradient colors={["#EFF8F1", "#FFFDF8"]} style={{ paddingBottom: 24 }}>
          <View className={`px-6 pt-6 ${isWide ? "flex-row items-center" : ""}`}>
            <MotiView
              from={{ opacity: 0, translateY: 14 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={{ flex: 1 }}
            >
              <Badge label="HACKDAY 1.0 · Tech for a Better Tomorrow" color="#2C6E3B" />
              <Text className="font-display text-4xl leading-tight text-canopy-950 mt-4">
                Verified trees.{"\n"}Trusted plant knowledge.
              </Text>
              <Text className="font-body text-base text-canopy-800/80 mt-4 leading-6 max-w-lg">
                Plantation drives love to announce how many trees were planted. GreenRoots asks the
                harder, more honest question — how many are still alive? At the same time, we replace
                scattered, unsafe home-remedy claims with evidence-labelled, professionally-cautious
                plant education.
              </Text>
              <View className="flex-row gap-3 mt-6 flex-wrap">
                <Button label="Explore the live demo" onPress={goApp} size="lg" />
                <Button label="See the impact data" variant="outline" size="lg" onPress={() => router.push("/(app)/dashboard")} />
              </View>

              <View className="flex-row flex-wrap gap-6 mt-8">
                <Stat label="trees verified alive" value={DASHBOARD_STATS.verifiedAlive.toLocaleString()} />
                <Stat label="survival rate" value={`${DASHBOARD_STATS.survivalRate}%`} />
                <Stat label="active volunteers" value={DASHBOARD_STATS.activeVolunteers.toString()} />
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 600, delay: 150 }}
              style={{ flex: 1, marginTop: isWide ? 0 : 28, marginLeft: isWide ? 24 : 0 }}
            >
              <View style={{ height: 320, borderRadius: 28, overflow: "hidden" }}>
                <AppImage imageKey="hero-forest-canopy" label="Hero image: lush tree canopy / volunteers planting trees" icon="tree" />
              </View>
            </MotiView>
          </View>
        </LinearGradient>

        {/* PROBLEM FRAMING */}
        <View className="px-6 py-10">
          <Text className="font-display text-2xl text-canopy-950 mb-2">Two problems, one root cause: nobody verifies.</Text>
          <Text className="font-body text-canopy-800/80 leading-6 mb-6 max-w-2xl">
            Plantation numbers get announced once and rarely checked again. Plant and health claims spread
            through short videos and forwarded messages with no evidence label attached. Both fail the same way —
            confident numbers and claims, with no way to verify them.
          </Text>
          <View className={isWide ? "flex-row gap-4" : "gap-4"}>
            <Card className={isWide ? "flex-1" : ""}>
              <Text className="text-3xl mb-2">🪧</Text>
              <Text className="font-body-bold text-canopy-950 mb-1">"10,000 trees planted"</Text>
              <Text className="font-body text-sm text-canopy-800/70 leading-5">
                Says nothing about survival. No GPS record. No follow-up. No accountability once the press photo is taken.
              </Text>
            </Card>
            <Card className={isWide ? "flex-1" : "mt-4"}>
              <Text className="text-3xl mb-2">📱</Text>
              <Text className="font-body-bold text-canopy-950 mb-1">"This leaf cures it"</Text>
              <Text className="font-body text-sm text-canopy-800/70 leading-5">
                Traditional knowledge is valuable — but repeated without evidence labels, safety warnings, or context, it can mislead and harm.
              </Text>
            </Card>
          </View>
        </View>

        {/* FEATURES */}
        <View className="px-6 py-6 bg-canopy-950">
          <Text className="font-display text-2xl text-white mb-1">One platform, built for both.</Text>
          <Text className="font-body text-canopy-100/70 mb-6">Environmental accountability and responsible plant education, verified end to end.</Text>
          <View className={`flex-row flex-wrap gap-4`}>
            {FEATURES.map((f, i) => (
              <MotiView
                key={f.title}
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400, delay: i * 80 }}
                style={{ flexBasis: isWide ? "31%" : "100%", flexGrow: 1 }}
              >
                <View className="bg-canopy-900 border border-canopy-800 rounded-3xl p-5">
                  <Text className="text-2xl mb-2">{f.icon}</Text>
                  <Text className="font-body-bold text-white mb-1">{f.title}</Text>
                  <Text className="font-body text-sm text-canopy-100/70 leading-5">{f.body}</Text>
                </View>
              </MotiView>
            ))}
          </View>
        </View>

        {/* IMPACT STATEMENT */}
        <View className="px-6 py-12 items-center">
          <Text className="font-display text-3xl text-canopy-950 text-center max-w-xl">
            "{DASHBOARD_STATS.verifiedAlive.toLocaleString()} trees verified alive after 12 months."
          </Text>
          <Text className="font-body text-canopy-800/70 text-center mt-3 max-w-md">
            Not a plantation-day photo. A living, updating, GPS-verified record — for Green Delhi Foundation and every organization that joins.
          </Text>
          <Button label="Open the live impact dashboard" onPress={goApp} size="lg" />
        </View>

        {/* DISCLAIMER FOOTER */}
        <View className="px-6 pb-10">
          <Card className="bg-cream-100 border-bark-200">
            <Text className="font-body-semibold text-bark-700 text-sm mb-1">A note on the health features</Text>
            <Text className="font-body text-xs text-bark-600 leading-5">
              GreenRoots does not diagnose conditions, prescribe treatment, or claim any plant cures a disease. Health
              content is general education only, clearly separates traditional use from scientific evidence, and always
              recommends consulting a qualified healthcare professional.
            </Text>
          </Card>
          <Text className="text-center text-xs text-canopy-700/50 mt-6">Built for HACKDAY 1.0 · Tech for a Better Tomorrow</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="font-display text-2xl text-canopy-700">{value}</Text>
      <Text className="font-body text-xs text-canopy-800/60">{label}</Text>
    </View>
  );
}
