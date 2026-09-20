import React, { useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/Primitives";
import Button from "@/components/Button";
import AlertCard from "@/components/AlertCard";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";

function Field({ label, value, onChangeText, placeholder, multiline }: { label: string; value: string; onChangeText: (t: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <View className="mb-4">
      <Text className="font-body-bold text-canopy-950 mb-2 text-sm">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`border border-canopy-100 rounded-xl px-3 py-3 font-body text-sm text-canopy-950 ${multiline ? "min-h-[80px]" : ""}`}
      />
    </View>
  );
}

export default function NewCommunitySubmission() {
  const { addCommunitySubmission } = useAppData();
  const { session } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [localName, setLocalName] = useState("");
  const [traditionalUse, setTraditionalUse] = useState("");
  const [cultivationTip, setCultivationTip] = useState("");
  const [observation, setObservation] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = plantName.trim().length > 0 && traditionalUse.trim().length > 0;

  const submit = () => {
    addCommunitySubmission({
      plantName: plantName.trim(),
      localName: localName.trim() || undefined,
      traditionalUse: traditionalUse.trim(),
      cultivationTip: cultivationTip.trim() || undefined,
      observation: observation.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
      submittedBy: session?.name ?? "Community member",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">🌱</Text>
          <Text className="font-display text-2xl text-canopy-950 text-center mb-2">Thank you for contributing</Text>
          <Text className="text-sm text-canopy-700/70 text-center mb-6">
            Your submission is marked "Pending review" and will be checked before being labelled as verified or evidence-reviewed.
          </Text>
          <Button label="Back to Community" onPress={() => router.replace("/(app)/community" as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text className="font-display text-2xl text-canopy-950 mb-1">Share plant knowledge</Text>
        <Text className="text-sm text-canopy-700/70 mb-5">Traditional knowledge is valuable — labelling it honestly keeps it trustworthy.</Text>

        <Card>
          <Field label="Plant name *" value={plantName} onChangeText={setPlantName} placeholder="e.g. Bael" />
          <Field label="Local name" value={localName} onChangeText={setLocalName} placeholder="e.g. बेल" />
          <Field label="Photo" value="" onChangeText={() => {}} placeholder="(Photo upload — attach in the app; not required for this prototype form)" />
          <Field label="Traditional use *" value={traditionalUse} onChangeText={setTraditionalUse} multiline placeholder="What is this plant traditionally used for, in your community?" />
          <Field label="Cultivation tip" value={cultivationTip} onChangeText={setCultivationTip} multiline placeholder="Any growing tips you've learned?" />
          <Field label="Personal observation" value={observation} onChangeText={setObservation} multiline placeholder="What have you personally noticed?" />
          <Field label="Source or reference" value={source} onChangeText={setSource} placeholder="e.g. family elder, local text, book title" />
          <Field label="Additional notes" value={notes} onChangeText={setNotes} multiline />
        </Card>

        <View className="mt-4">
          <AlertCard tone="info">
            Your submission will be marked "Pending review." Reviewers may label it Verified, Evidence not reviewed, Requires
            correction, or Rejected — it will never be shown as confirmed medical advice until reviewed.
          </AlertCard>
        </View>

        <View className="mt-5">
          <Button label="Submit for review" onPress={submit} disabled={!canSubmit} fullWidth size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
