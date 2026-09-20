import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Card, Badge } from "@/components/Primitives";
import { EmptyState } from "@/components/States";
import Button from "@/components/Button";
import { useAppData } from "@/context/AppDataContext";
import type { CommunitySubmissionStatus } from "@/types";

const STATUS_META: Record<CommunitySubmissionStatus, { label: string; color: string }> = {
  pending_review: { label: "Pending review", color: "#2E6FA6" },
  community_contribution: { label: "Community contribution", color: "#8C6C3C" },
  verified: { label: "Verified", color: "#2C6E3B" },
  evidence_not_reviewed: { label: "Evidence not reviewed", color: "#C99A2E" },
  requires_correction: { label: "Requires correction", color: "#C05621" },
  rejected: { label: "Rejected", color: "#B3392C" },
};

export default function CommunityIndex() {
  const { communitySubmissions } = useAppData();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-canopy-50 items-center justify-center">
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#2C6E3B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </Pressable>
          <Text className="font-display text-2xl text-canopy-950">Community Knowledge</Text>
        </View>
      </View>
      <Text className="px-5 text-sm text-canopy-700/70 mb-4">
        Local, traditional plant knowledge — submitted, reviewed, and responsibly labelled. Never treated as confirmed medical advice until verified.
      </Text>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {communitySubmissions.length === 0 ? (
          <Card><EmptyState title="No submissions yet" subtitle="Be the first to share traditional plant knowledge from your community." /></Card>
        ) : (
          <View className="gap-3">
            {communitySubmissions.map((s) => (
              <Card key={s.id}>
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="font-body-bold text-canopy-950">{s.plantName}{s.localName ? ` (${s.localName})` : ""}</Text>
                  <Badge label={STATUS_META[s.status].label} color={STATUS_META[s.status].color} />
                </View>
                <Text className="text-sm text-canopy-800/80 mb-1">{s.traditionalUse}</Text>
                {s.cultivationTip ? <Text className="text-xs text-canopy-700/60 mb-1">Tip: {s.cultivationTip}</Text> : null}
                {s.source ? <Text className="text-xs text-canopy-700/50">Source: {s.source}</Text> : null}
                <Text className="text-xs text-canopy-700/40 mt-2">Submitted by {s.submittedBy} · {new Date(s.createdAt).toLocaleDateString()}</Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-6 left-5 right-5">
        <Button label="Share your plant knowledge" size="lg" fullWidth onPress={() => router.push("/(app)/community/new" as any)} />
      </View>
    </SafeAreaView>
  );
}
