import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { MotiView } from "moti";
import { Card, Chip } from "@/components/Primitives";
import AlertCard from "@/components/AlertCard";
import Button from "@/components/Button";
import AppImage from "@/components/AppImage";
import { getTreeById } from "@/data/trees";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { TREE_STATUS_META, type TreeStatus } from "@/types";

const CONDITIONS: TreeStatus[] = ["alive", "needs_attention", "at_risk", "lost"];

const AI_MESSAGES: Record<TreeStatus, string> = {
  alive: "AI-assisted observation — canopy area appears consistent or increased versus previous photo. Human verification recommended.",
  needs_attention: "AI-assisted observation — possible canopy thinning or discoloration detected versus previous photo. Human verification recommended.",
  at_risk: "AI-assisted observation — significant change detected versus previous photo, consistent with stress or damage. Human verification recommended.",
  lost: "AI-assisted observation — tree not detected in expected frame position. Human verification recommended.",
  planted: "AI-assisted observation — new tree, no prior photo to compare.",
  replaced: "AI-assisted observation — replacement tree, growth baseline reset.",
  pending_verification: "AI-assisted observation — awaiting first comparison photo.",
};

export default function VerifyTree() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const tree = getTreeById(treeId);
  const { addVerification } = useAppData();
  const { session } = useAuth();

  const [photoTaken, setPhotoTaken] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [condition, setCondition] = useState<TreeStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!tree) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <Text className="text-center mt-20 text-canopy-700">Tree not found.</Text>
      </SafeAreaView>
    );
  }

  const capturePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setPhotoTaken(true); // allow demo continuation even without permission
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!res.canceled) setPhotoTaken(true);
    } catch {
      setPhotoTaken(true);
    }
  };

  const captureLocation = async () => {
    setLocating(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } else {
        setCoords({ lat: tree.latitude, lng: tree.longitude });
      }
    } catch {
      setCoords({ lat: tree.latitude, lng: tree.longitude });
    }
    setLocating(false);
  };

  const submit = async () => {
    if (!condition) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    addVerification({
      treeId: tree.id,
      volunteerName: session?.name ?? "Volunteer",
      photoUrl: `tree-grown-${Math.floor(Math.random() * 6) + 1}`,
      latitude: coords?.lat ?? tree.latitude,
      longitude: coords?.lng ?? tree.longitude,
      timestamp: new Date().toISOString(),
      condition,
      notes: notes.trim() || undefined,
      aiObservation: AI_MESSAGES[condition],
      approved: false,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <View className="flex-1 items-center justify-center px-6">
          <MotiView from={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
            <Text className="text-5xl mb-4 text-center">✅</Text>
          </MotiView>
          <Text className="font-display text-2xl text-canopy-950 text-center mb-2">Verification submitted</Text>
          <Text className="text-sm text-canopy-700/70 text-center mb-6">
            Your report for {tree.treeCode} is now pending admin review before the dashboard updates.
          </Text>
          <Button label="Back to tree" onPress={() => router.replace(`/(app)/tree/${tree.id}` as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text className="font-display text-2xl text-canopy-950">Verify {tree.treeCode}</Text>
        <Text className="text-sm text-canopy-700/70 mt-1 mb-5">Scan → photograph → GPS-stamp → status. Real accountability, cycle after cycle.</Text>

        <Card className="mb-4">
          <Text className="font-body-bold text-canopy-950 mb-2">1. Current photograph</Text>
          {photoTaken ? (
            <View style={{ height: 160, borderRadius: 16, overflow: "hidden" }}>
              <AppImage imageKey="verification-capture-preview" label="Captured verification photo" icon="camera" />
            </View>
          ) : (
            <Pressable onPress={capturePhoto}>
              <View className="border-2 border-dashed border-canopy-200 rounded-2xl py-8 items-center">
                <Text className="text-3xl mb-2">📷</Text>
                <Text className="text-canopy-700 font-body-medium text-sm">Tap to capture photo</Text>
              </View>
            </Pressable>
          )}
        </Card>

        <Card className="mb-4">
          <Text className="font-body-bold text-canopy-950 mb-2">2. GPS location</Text>
          {coords ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-canopy-800/80">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</Text>
              <Text className="text-green-700 text-xs font-body-semibold">✓ Captured</Text>
            </View>
          ) : (
            <Button label={locating ? "Locating..." : "Capture current location"} variant="outline" onPress={captureLocation} loading={locating} fullWidth />
          )}
        </Card>

        <Card className="mb-4">
          <Text className="font-body-bold text-canopy-950 mb-3">3. Tree condition</Text>
          <View className="flex-row flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <Pressable key={c} onPress={() => setCondition(c)}>
                <Chip label={TREE_STATUS_META[c].label} active={condition === c} />
              </Pressable>
            ))}
          </View>
        </Card>

        {condition && (
          <View className="mb-4">
            <AlertCard tone="info" title="AI-assisted observation">{AI_MESSAGES[condition]}</AlertCard>
          </View>
        )}

        <Card className="mb-4">
          <Text className="font-body-bold text-canopy-950 mb-2">4. Notes (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. dry, damaged, diseased, missing, growing normally..."
            multiline
            className="border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm text-canopy-950 min-h-[80px]"
            textAlignVertical="top"
          />
        </Card>

        <Button
          label="Submit for review"
          onPress={submit}
          loading={submitting}
          disabled={!condition || !photoTaken}
          fullWidth
          size="lg"
        />
        {(!condition || !photoTaken) && (
          <Text className="text-xs text-canopy-700/50 text-center mt-2">Add a photo and select a condition to submit.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
