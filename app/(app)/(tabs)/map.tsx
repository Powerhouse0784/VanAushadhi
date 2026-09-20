import React, { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import IllustratedMap, { MapLegend } from "@/components/IllustratedMap";
import { Card, Chip } from "@/components/Primitives";
import { TreeStatusBadge } from "@/components/StatusBadges";
import Button from "@/components/Button";
import { PROJECTS, TREES } from "@/data/trees";
import { TREE_STATUS_META, type TreeStatus } from "@/types";
import { useAppData } from "@/context/AppDataContext";

const LEGEND = (Object.keys(TREE_STATUS_META) as TreeStatus[]).map((k) => ({
  label: TREE_STATUS_META[k].label,
  color: TREE_STATUS_META[k].marker,
}));

export default function MapScreen() {
  const [projectFilter, setProjectFilter] = useState<string | "all">("all");
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const { treeStatusOverrides } = useAppData();

  const trees = useMemo(
    () => (projectFilter === "all" ? TREES : TREES.filter((t) => t.projectId === projectFilter)),
    [projectFilter]
  );

  const pins = trees.map((t) => {
    const status = treeStatusOverrides[t.id] ?? t.status;
    return {
      id: t.id,
      latitude: t.latitude,
      longitude: t.longitude,
      color: TREE_STATUS_META[status].marker,
      selected: t.id === selectedTreeId,
    };
  });

  const selectedTree = trees.find((t) => t.id === selectedTreeId);
  const selectedStatus = selectedTree ? treeStatusOverrides[selectedTree.id] ?? selectedTree.status : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScreenHeader title="Plantation Map" subtitle="Tap a pin to open a tree's digital ID" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <Chip label="All projects" active={projectFilter === "all"} onPress={() => setProjectFilter("all")} />
            {PROJECTS.map((p) => (
              <Chip key={p.id} label={p.name} active={projectFilter === p.id} onPress={() => setProjectFilter(p.id)} />
            ))}
          </ScrollView>

          <IllustratedMap pins={pins} onPinPress={setSelectedTreeId} height={360} />
          <MapLegend items={LEGEND} />
        </View>

        <View className="px-5 mt-5">
          {selectedTree && selectedStatus ? (
            <Card>
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="font-body-bold text-canopy-950 text-base">{selectedTree.treeCode}</Text>
                  <Text className="text-xs text-canopy-700/70 mt-0.5">
                    {selectedTree.commonName} · <Text style={{ fontStyle: "italic" }}>{selectedTree.scientificName}</Text>
                  </Text>
                </View>
                <TreeStatusBadge status={selectedStatus} />
              </View>
              <Text className="text-xs text-canopy-700/60 mb-3">
                Caretaker: {selectedTree.caretakerName} · Last verified{" "}
                {selectedTree.lastVerificationDate ? new Date(selectedTree.lastVerificationDate).toLocaleDateString() : "—"}
              </Text>
              <Button label="Open digital ID" onPress={() => router.push(`/(app)/tree/${selectedTree.id}` as any)} fullWidth />
            </Card>
          ) : (
            <Card>
              <Text className="text-center text-canopy-700/60 text-sm py-4">Tap any pin above to preview a tree here.</Text>
            </Card>
          )}
        </View>

        <View className="px-5 mt-4">
          <Text className="text-xs text-canopy-700/50 font-body text-center">
            {trees.length} individually-tracked trees shown for this prototype, sampled from{" "}
            {PROJECTS.reduce((s, p) => s + p.treesRegistered, 0).toLocaleString()} total registered across all projects.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
