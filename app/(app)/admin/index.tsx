import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Card, Badge, SectionHeader } from "@/components/Primitives";
import { EmptyState } from "@/components/States";
import Button from "@/components/Button";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { getTreeById } from "@/data/trees";
import { TREE_STATUS_META, type CommunitySubmissionStatus } from "@/types";
import { DASHBOARD_STATS, ORGANIZATION, PROJECTS } from "@/data/trees";
import StatCard from "@/components/StatCard";

const REVIEW_ACTIONS: { status: CommunitySubmissionStatus; label: string; color: string }[] = [
  { status: "verified", label: "Verify", color: "#2C6E3B" },
  { status: "evidence_not_reviewed", label: "Evidence not reviewed", color: "#C99A2E" },
  { status: "requires_correction", label: "Needs correction", color: "#C05621" },
  { status: "rejected", label: "Reject", color: "#B3392C" },
];

export default function AdminDashboard() {
  const { session } = useAuth();
  const { extraVerifications, approveVerification, communitySubmissions, setCommunitySubmissionStatus } = useAppData();

  const pendingVerifications = extraVerifications.filter((v) => !v.approved);
  const pendingSubmissions = communitySubmissions.filter((s) => s.status === "pending_review");

  if (session?.role !== "admin") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">🔒</Text>
          <Text className="font-display text-xl text-canopy-950 text-center mb-2">Admin access required</Text>
          <Text className="text-sm text-canopy-700/70 text-center mb-5">Switch your role to "Admin / Reviewer" from Profile to preview this dashboard.</Text>
          <Button label="Go to Profile" onPress={() => router.replace("/(app)/profile" as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 mb-1">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-canopy-50 items-center justify-center">
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#2C6E3B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </Pressable>
          <Text className="font-display text-2xl text-canopy-950">Admin & Reviewer</Text>
        </View>
        <Text className="text-sm text-canopy-700/70 mb-5 ml-1">{ORGANIZATION.name} · {PROJECTS.length} active projects</Text>

        <View className="flex-row flex-wrap gap-3 mb-6">
          <StatCard label="Survival rate" value={`${DASHBOARD_STATS.survivalRate}%`} accent="#2C6E3B" />
          <StatCard label="Pending verification reports" value={pendingVerifications.length.toString()} accent="#2E6FA6" />
          <StatCard label="Pending community reviews" value={pendingSubmissions.length.toString()} accent="#C99A2E" />
          <StatCard label="Active volunteers" value={DASHBOARD_STATS.activeVolunteers.toString()} accent="#7C4FB0" />
        </View>

        <SectionHeader title="Tree verification reports" subtitle="Approve to update the tree's live status" />
        {pendingVerifications.length === 0 ? (
          <Card className="mb-6"><EmptyState title="Nothing to review" subtitle="Volunteer verification reports will appear here." /></Card>
        ) : (
          <View className="gap-3 mb-6">
            {pendingVerifications.map((v) => {
              const tree = getTreeById(v.treeId);
              const meta = TREE_STATUS_META[v.condition];
              return (
                <Card key={v.id}>
                  <View className="flex-row items-start justify-between mb-1">
                    <Text className="font-body-bold text-canopy-950">{tree?.treeCode ?? v.treeId}</Text>
                    <Badge label={meta.label} color={meta.color} />
                  </View>
                  <Text className="text-xs text-canopy-700/60 mb-2">{v.volunteerName} · {new Date(v.timestamp).toLocaleString()}</Text>
                  {v.notes ? <Text className="text-sm text-canopy-800/80 mb-2">{v.notes}</Text> : null}
                  {v.aiObservation ? <Text className="text-xs text-canopy-600 mb-3 italic">{v.aiObservation}</Text> : null}
                  <Button label="Approve & update tree status" size="sm" onPress={() => approveVerification(v.id)} fullWidth />
                </Card>
              );
            })}
          </View>
        )}

        <SectionHeader title="Community submissions" subtitle="Assign an evidence-honest status" />
        {pendingSubmissions.length === 0 ? (
          <Card><EmptyState title="Nothing to review" subtitle="New community plant knowledge will appear here." /></Card>
        ) : (
          <View className="gap-3">
            {pendingSubmissions.map((s) => (
              <Card key={s.id}>
                <Text className="font-body-bold text-canopy-950 mb-1">{s.plantName}{s.localName ? ` (${s.localName})` : ""}</Text>
                <Text className="text-sm text-canopy-800/80 mb-3">{s.traditionalUse}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {REVIEW_ACTIONS.map((a) => (
                    <Pressable key={a.status} onPress={() => setCommunitySubmissionStatus(s.id, a.status)}>
                      <View className="px-3 py-2 rounded-xl" style={{ backgroundColor: `${a.color}1A` }}>
                        <Text style={{ color: a.color }} className="text-xs font-body-semibold">{a.label}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
