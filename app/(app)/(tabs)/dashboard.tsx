import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import StatCard from "@/components/StatCard";
import { Card, SectionHeader } from "@/components/Primitives";
import Button from "@/components/Button";
import BotanicalAccent from "@/components/BotanicalAccent";
import { DonutStat, BarChart, LineChart } from "@/components/Charts";
import { DASHBOARD_STATS, SPECIES_SURVIVAL, MONTHLY_VERIFICATION_ACTIVITY, ORGANIZATION, PROJECTS } from "@/data/trees";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { session } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <ScreenHeader title="Impact Dashboard" subtitle={`${ORGANIZATION.name} · ${ORGANIZATION.city}`} />

        {/* Impact statement banner */}
        <View className="px-5 mt-2">
          <MotiView from={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "timing", duration: 500 }}>
            <LinearGradient colors={["#0F2A17", "#22562F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 22, overflow: "hidden" }}>
              <BotanicalAccent size={170} style={{ position: "absolute", top: -24, right: -24 }} opacity={0.1} />
              <Text className="text-canopy-200 font-body-semibold text-xs uppercase tracking-wide">Instead of "trees planted"</Text>
              <Text className="font-display text-2xl text-white mt-2 leading-8">
                {DASHBOARD_STATS.verifiedAlive.toLocaleString()} trees verified alive after 12 months.
              </Text>
              <View className="flex-row items-center gap-4 mt-4">
                <DonutStat
                  percent={DASHBOARD_STATS.survivalRate}
                  size={92}
                  strokeWidth={11}
                  color="#8CCC99"
                  trackColor="rgba(255,255,255,0.15)"
                  textColor="#FFFFFF"
                  labelColor="rgba(255,255,255,0.75)"
                  label="survival"
                />
                <View className="flex-1">
                  <Text className="text-canopy-100/80 font-body text-sm leading-5">
                    Survival Rate = Verified Alive ÷ Total Registered × 100{"\n"}
                    = {DASHBOARD_STATS.verifiedAlive.toLocaleString()} ÷ {DASHBOARD_STATS.totalRegistered.toLocaleString()} × 100
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </MotiView>
        </View>

        {/* Stat grid */}
        <View className="px-5 mt-6">
          <SectionHeader title="Campaign overview" subtitle="Across all plantation projects" />
          <View className="flex-row flex-wrap gap-3">
            <StatCard label="Total registered" value={DASHBOARD_STATS.totalRegistered.toLocaleString()} accent="#2E6FA6" delay={0} />
            <StatCard label="Verified alive" value={DASHBOARD_STATS.verifiedAlive.toLocaleString()} accent="#2C6E3B" delay={60} />
            <StatCard label="Needs attention" value={DASHBOARD_STATS.needsAttention.toLocaleString()} accent="#C99A2E" delay={120} />
            <StatCard label="At risk" value={DASHBOARD_STATS.atRisk.toLocaleString()} accent="#C05621" delay={180} />
            <StatCard label="Lost" value={DASHBOARD_STATS.lost.toLocaleString()} accent="#B3392C" delay={240} />
            <StatCard label="Replaced" value={DASHBOARD_STATS.replaced.toLocaleString()} accent="#7C4FB0" delay={300} />
            <StatCard label="Pending verification" value={DASHBOARD_STATS.pendingVerification.toLocaleString()} accent="#2E6FA6" delay={360} />
            <StatCard label="Active volunteers" value={DASHBOARD_STATS.activeVolunteers.toString()} accent="#2C6E3B" delay={420} sub={`${DASHBOARD_STATS.totalProjects} active projects`} />
          </View>
        </View>

        {/* Species survival */}
        <View className="px-5 mt-6">
          <Card>
            <SectionHeader title="Species-wise survival" subtitle="Percentage verified alive, by species" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart data={SPECIES_SURVIVAL.map((s) => ({ label: s.species, value: s.survivalRate }))} />
            </ScrollView>
          </Card>
        </View>

        {/* Monthly verification activity */}
        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Monthly verification activity" subtitle="Volunteer visits logged per month" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart data={MONTHLY_VERIFICATION_ACTIVITY.map((m) => ({ label: m.month, value: m.verifications }))} color="#2E6FA6" />
            </ScrollView>
          </Card>
        </View>

        {/* Projects list */}
        <View className="px-5 mt-4">
          <SectionHeader title="Plantation projects" subtitle="Tap a project to explore it on the map" />
          <View className="gap-3">
            {PROJECTS.map((p, i) => (
              <MotiView key={p.id} from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 70 }}>
                <Card className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-body-bold text-canopy-950">{p.name}</Text>
                    <Text className="text-xs text-canopy-700/70 mt-0.5">{p.location}</Text>
                    <Text className="text-xs text-canopy-600 mt-1">{p.treesRegistered.toLocaleString()} trees registered</Text>
                  </View>
                  <Button label="View" size="sm" variant="outline" onPress={() => router.push("/(app)/map" as any)} />
                </Card>
              </MotiView>
            ))}
          </View>
        </View>

        {session?.role === "volunteer" && (
          <View className="px-5 mt-4">
            <Card className="bg-canopy-50 border-canopy-100">
              <Text className="font-body-bold text-canopy-950 mb-1">Your next verification round</Text>
              <Text className="text-sm text-canopy-800/70 mb-3">Head to the map, pick a tree, and submit a fresh verification.</Text>
              <Button label="Open map" onPress={() => router.push("/(app)/map" as any)} />
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
