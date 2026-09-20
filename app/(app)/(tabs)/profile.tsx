import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { Card, Badge, SectionHeader } from "@/components/Primitives";
import { EmptyState } from "@/components/States";
import Button from "@/components/Button";
import VideoEducationCard from "@/components/VideoEducationCard";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getPlantById } from "@/data/plants";

const ROLES: UserRole[] = ["visitor", "volunteer", "admin"];

export default function Profile() {
  const { session, setRole, signOut, isSupabaseConfigured } = useAuth();
  const { savedPlantIds, safetyHistory, videoSubmissions, extraVerifications } = useAppData();

  const savedPlants = savedPlantIds.map((id) => getPlantById(id)).filter(Boolean);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <ScreenHeader title="Profile" subtitle={session?.name} />

        <View className="px-5">
          <VideoEducationCard />
        </View>

        {!isSupabaseConfigured && (
          <View className="px-5 mt-4">
            <Card>
              <Text className="font-body-bold text-canopy-950 mb-2">Demo role switcher</Text>
              <Text className="text-xs text-canopy-700/60 mb-3">
                No backend is connected, so switch roles instantly to preview each dashboard.
              </Text>
              <View className="flex-row gap-2">
                {ROLES.map((r) => (
                  <Pressable key={r} onPress={() => setRole(r)} className="flex-1">
                    <View className={`py-2.5 rounded-xl items-center ${session?.role === r ? "bg-canopy-600" : "bg-canopy-50 border border-canopy-100"}`}>
                      <Text className={`text-xs font-body-semibold capitalize ${session?.role === r ? "text-white" : "text-canopy-700"}`}>{r}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </Card>
          </View>
        )}

        <View className="px-5 mt-5">
          <SectionHeader title="Saved plants" subtitle={`${savedPlants.length} saved`} />
          {savedPlants.length === 0 ? (
            <Card><EmptyState title="No saved plants yet" subtitle="Bookmark plants from the Library to find them here." /></Card>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {savedPlants.map((p) => p && (
                <Pressable key={p.id} onPress={() => router.push(`/(app)/plant/${p.id}` as any)} className="mr-3">
                  <Card className="w-36">
                    <Text className="font-body-bold text-sm text-canopy-950">{p.commonName}</Text>
                    <Text className="text-xs text-canopy-700/60" style={{ fontStyle: "italic" }}>{p.scientificName}</Text>
                  </Card>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="px-5 mt-5">
          <SectionHeader title="Safety check history" subtitle={`${safetyHistory.length} checks run`} />
          {safetyHistory.length === 0 ? (
            <Card><EmptyState title="No safety checks yet" subtitle="Run one from any plant's page." /></Card>
          ) : (
            <View className="gap-2">
              {safetyHistory.slice(0, 5).map((h) => {
                const plant = getPlantById(h.plantId);
                return (
                  <Card key={h.id} className="flex-row items-center justify-between">
                    <Text className="font-body-medium text-sm text-canopy-950">{plant?.commonName ?? h.plantId}</Text>
                    <Text className="text-xs text-canopy-700/50">{new Date(h.createdAt).toLocaleDateString()}</Text>
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        <View className="px-5 mt-5">
          <SectionHeader title="Health video submissions" subtitle={`${videoSubmissions.length} saved`} />
          {videoSubmissions.length === 0 ? (
            <Card><EmptyState title="No video submissions yet" subtitle="Try the health video education tool above." /></Card>
          ) : (
            <View className="gap-2">
              {videoSubmissions.slice(0, 3).map((v) => (
                <Card key={v.id}>
                  <Text className="text-xs text-canopy-700/50 mb-1">{new Date(v.createdAt).toLocaleDateString()} · {v.language.toUpperCase()}</Text>
                  <Text className="text-sm text-canopy-800/80" numberOfLines={2}>{v.summary}</Text>
                </Card>
              ))}
            </View>
          )}
        </View>

        {session?.role === "volunteer" && (
          <View className="px-5 mt-5">
            <SectionHeader title="Your verification history" subtitle={`${extraVerifications.length} submitted this session`} />
            {extraVerifications.length === 0 ? (
              <Card><EmptyState title="No verifications submitted yet" subtitle="Open a tree from the Map to verify it." /></Card>
            ) : (
              <View className="gap-2">
                {extraVerifications.slice(0, 5).map((v) => (
                  <Card key={v.id} className="flex-row items-center justify-between">
                    <Text className="text-sm text-canopy-950 font-body-medium">{v.notes ?? v.condition}</Text>
                    <Badge label={v.approved ? "Approved" : "Pending review"} color={v.approved ? "#2C6E3B" : "#C99A2E"} />
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="px-5 mt-6">
          <Button label="Sign out" variant="outline" fullWidth onPress={async () => { await signOut(); router.replace("/"); }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
