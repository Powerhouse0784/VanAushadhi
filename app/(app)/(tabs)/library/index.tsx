import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { Card, Chip, Badge } from "@/components/Primitives";
import { EvidenceBadge } from "@/components/StatusBadges";
import AppImage from "@/components/AppImage";
import { PLANTS } from "@/data/plants";
import { useAppData } from "@/context/AppDataContext";
import Svg, { Path, Circle } from "react-native-svg";

const CATEGORIES = ["All", ...Array.from(new Set(PLANTS.map((p) => p.category)))];

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke="#5FAE70" strokeWidth={1.8} />
      <Path d="m20 20-3.5-3.5" stroke="#5FAE70" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function LibraryIndex() {
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 620 ? 2 : 1;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { savedPlantIds, toggleSavedPlant } = useAppData();

  const filtered = useMemo(() => {
    return PLANTS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.commonName.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.localName.includes(q) ||
        p.traditionalUses.some((u) => u.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <ScreenHeader title="Explore Plants" subtitle="Traditional knowledge, clearly separated from scientific evidence" />

        <View className="px-5 mt-1">
          <View className="flex-row items-center bg-canopy-50 dark:bg-canopy-900 rounded-2xl px-4 py-3 gap-2 border border-canopy-100 dark:border-canopy-800">
            <SearchIcon />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search plants by name, use, or property..."
              placeholderTextColor="#5FAE70"
              className="flex-1 font-body text-canopy-950 dark:text-cream-100"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
            ))}
          </ScrollView>
        </View>

        <View className="px-5 mt-2">
          <Text className="text-xs text-canopy-700/60 font-body mb-3">{filtered.length} plant profiles</Text>
          <View className="flex-row flex-wrap gap-4">
            {filtered.map((plant, i) => {
              const saved = savedPlantIds.includes(plant.id);
              return (
                <MotiView
                  key={plant.id}
                  from={{ opacity: 0, translateY: 14 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 350, delay: (i % 9) * 50 }}
                  style={{ flexBasis: columns === 1 ? "100%" : columns === 2 ? "47%" : "31%", flexGrow: 1 }}
                >
                  <Pressable onPress={() => router.push(`/(app)/plant/${plant.id}` as any)}>
                    <Card className="p-0 overflow-hidden">
                      <View style={{ height: 130 }}>
                        <AppImage imageKey={`plant-${plant.id}-1`} label={`${plant.commonName} photo`} icon="leaf" />
                        <Pressable
                          onPress={() => toggleSavedPlant(plant.id)}
                          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(15,42,23,0.55)", alignItems: "center", justifyContent: "center" }}
                        >
                          <Text style={{ color: saved ? "#8CCC99" : "#fff" }}>{saved ? "★" : "☆"}</Text>
                        </Pressable>
                      </View>
                      <View className="p-4">
                        <Text className="font-display text-lg text-canopy-950">{plant.commonName}</Text>
                        <Text className="text-xs text-canopy-700/60 mb-2" style={{ fontStyle: "italic" }}>{plant.scientificName}</Text>
                        <Text className="text-xs text-canopy-800/70 mb-3" numberOfLines={2}>{plant.traditionalUses[0]}</Text>
                        <View className="flex-row flex-wrap gap-1.5">
                          <Badge label={plant.category} color="#2C6E3B" />
                          <EvidenceBadge level={plant.evidenceLevel} />
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                </MotiView>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
