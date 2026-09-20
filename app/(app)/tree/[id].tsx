import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Card, SectionHeader, Divider } from "@/components/Primitives";
import { TreeStatusBadge } from "@/components/StatusBadges";
import AlertCard from "@/components/AlertCard";
import Button from "@/components/Button";
import TreeQRCard from "@/components/TreeQRCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { getTreeById, getVerificationsForTree } from "@/data/trees";
import { useAppData } from "@/context/AppDataContext";
import { TREE_STATUS_META } from "@/types";

export default function TreeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tree = getTreeById(id);
  const { treeStatusOverrides, extraVerifications } = useAppData();

  if (!tree) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <Text className="text-center mt-20 text-canopy-700">Tree not found.</Text>
      </SafeAreaView>
    );
  }

  const status = treeStatusOverrides[tree.id] ?? tree.status;
  const seedVerifications = getVerificationsForTree(tree.id);
  const ownExtra = extraVerifications.filter((v) => v.treeId === tree.id);
  const timeline = [...ownExtra, ...seedVerifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-canopy-50 items-center justify-center">
            <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" stroke="#2C6E3B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
          </Pressable>
          <TreeStatusBadge status={status} />
        </View>

        <View className="px-5">
          <Text className="font-display text-2xl text-canopy-950">{tree.treeCode}</Text>
          <Text className="text-sm text-canopy-700/70 mt-0.5">
            {tree.commonName} · <Text style={{ fontStyle: "italic" }}>{tree.scientificName}</Text>
          </Text>
          <Text className="text-xs text-canopy-600 mt-1">{tree.organizationName}</Text>
        </View>

        <View className="px-5 mt-4">
          <Card>
            <SectionHeader title="Growth comparison" subtitle="Drag to compare initial vs. latest photo" />
            <BeforeAfterSlider beforeKey={tree.initialPhotoUrl} afterKey={tree.latestPhotoUrl ?? tree.initialPhotoUrl} />
          </Card>
        </View>

        <View className="px-5 mt-4">
          <View className="flex-row flex-wrap gap-3">
            <Card className="flex-1 min-w-[45%]">
              <Text className="text-xs text-canopy-700/60">Plantation date</Text>
              <Text className="font-body-bold text-canopy-950 mt-1">{new Date(tree.plantationDate).toLocaleDateString()}</Text>
            </Card>
            <Card className="flex-1 min-w-[45%]">
              <Text className="text-xs text-canopy-700/60">Caretaker</Text>
              <Text className="font-body-bold text-canopy-950 mt-1">{tree.caretakerName}</Text>
            </Card>
            <Card className="flex-1 min-w-[45%]">
              <Text className="text-xs text-canopy-700/60">GPS location</Text>
              <Text className="font-body-bold text-canopy-950 mt-1">{tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}</Text>
            </Card>
            <Card className="flex-1 min-w-[45%]">
              <Text className="text-xs text-canopy-700/60">Watering plan</Text>
              <Text className="font-body-bold text-canopy-950 mt-1">{tree.wateringPlan}</Text>
            </Card>
          </View>
        </View>

        <View className="px-5 mt-4">
          <TreeQRCard treeCode={tree.treeCode} treeId={tree.id} />
        </View>

        <View className="px-5 mt-4">
          <Button label="Submit a new verification" onPress={() => router.push(`/(app)/verify/${tree.id}` as any)} fullWidth />
        </View>

        <View className="px-5 mt-6">
          <SectionHeader title="Verification timeline" subtitle={`${timeline.length} recorded visits`} />
          <View className="gap-3">
            {timeline.map((v, i) => {
              const meta = TREE_STATUS_META[v.condition];
              return (
                <Card key={v.id}>
                  <View className="flex-row items-start justify-between mb-1">
                    <Text className="font-body-bold text-sm text-canopy-950">{v.volunteerName}</Text>
                    <Text className="text-xs text-canopy-700/50">{new Date(v.timestamp).toLocaleDateString()}</Text>
                  </View>
                  <View className="mb-2"><TreeStatusBadge status={v.condition} /></View>
                  {v.notes ? <Text className="text-sm text-canopy-800/80 mb-2">{v.notes}</Text> : null}
                  {v.aiObservation ? (
                    <AlertCard tone="info" title="AI-assisted observation">
                      {v.aiObservation}
                    </AlertCard>
                  ) : null}
                  {!v.approved ? (
                    <View className="mt-2">
                      <Divider />
                      <Text className="text-xs text-amber-700">Pending admin review</Text>
                    </View>
                  ) : null}
                </Card>
              );
            })}
            {timeline.length === 0 && (
              <Card><Text className="text-center text-sm text-canopy-700/60 py-4">No verifications recorded yet.</Text></Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
