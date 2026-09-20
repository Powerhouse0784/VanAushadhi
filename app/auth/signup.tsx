import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { Card } from "@/components/Primitives";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const { signUpWithPassword } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password) return setError("Fill in all fields.");
    if (password.length < 6) return setError("Password should be at least 6 characters.");
    setLoading(true);
    const { error } = await signUpWithPassword(name, email, password);
    setLoading(false);
    if (error) return setError(error);
    router.replace("/(app)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 40 }}>
        <Text className="font-display text-3xl text-canopy-950">Create your account</Text>
        <Text className="font-body text-canopy-800/70 mt-1">Join as a home gardener, volunteer, or organization.</Text>

        <Card className="mt-5">
          <TextInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            className="border border-canopy-100 rounded-xl px-4 py-3 mb-3 font-body text-canopy-950"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-canopy-100 rounded-xl px-4 py-3 mb-3 font-body text-canopy-950"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border border-canopy-100 rounded-xl px-4 py-3 mb-3 font-body text-canopy-950"
          />
          {error ? <Text className="text-red-600 text-sm mb-2">{error}</Text> : null}
          <Button label="Create account" onPress={handleSignup} loading={loading} fullWidth />
        </Card>

        <Pressable onPress={() => router.back()} className="mt-6 items-center">
          <Text className="text-canopy-700/60 text-sm font-body">← Back to login</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
