import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import Button from "@/components/Button";
import { Card } from "@/components/Primitives";
import AlertCard from "@/components/AlertCard";
import AppImage from "@/components/AppImage";
import { useAuth, type UserRole } from "@/context/AuthContext";

const ROLES: { key: UserRole; label: string; desc: string }[] = [
  { key: "visitor", label: "Visitor / Home Gardener", desc: "Browse plant library, use AI assistant & safety checker" },
  { key: "volunteer", label: "Volunteer", desc: "Verify assigned trees, submit community knowledge" },
  { key: "admin", label: "Org Admin / Reviewer", desc: "Approve verifications, manage projects & submissions" },
];

export default function Login() {
  const { signInWithPassword, signInGuest, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("visitor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) return setError("Enter an email and password.");
    setLoading(true);
    const { error } = await signInWithPassword(email, password);
    setLoading(false);
    if (error) return setError(error);
    router.replace("/(app)/dashboard");
  };

  const handleGuest = async () => {
    setLoading(true);
    await signInGuest(name || "Guest", role);
    setLoading(false);
    router.replace("/(app)/dashboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 40 }}>
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, overflow: "hidden" }}>
            <AppImage imageKey="logo-vanaushadhi" label="Logo" icon="tree" />
          </View>
          <Text className="font-display text-3xl text-canopy-950 mt-2">Welcome to GreenRoots</Text>
          <Text className="font-body text-canopy-800/70 mt-1">Sign in to verify trees, explore plant knowledge, or manage a project.</Text>
        </MotiView>

        {!isSupabaseConfigured && (
          <View className="mt-4">
            <AlertCard tone="info" title="Demo mode">
              No Supabase project is connected yet, so this runs as an instant local demo session — pick a name and a
              role below. Real email/password auth activates automatically once EXPO_PUBLIC_SUPABASE_URL / ANON_KEY
              are set.
            </AlertCard>
          </View>
        )}

        <Card className="mt-5">
          <Text className="font-body-semibold text-canopy-950 mb-3">
            {isSupabaseConfigured ? "Sign in" : "Quick demo access"}
          </Text>

          {isSupabaseConfigured ? (
            <>
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
              <Button label="Log in" onPress={handleEmailLogin} loading={loading} fullWidth />
              <View className="mt-3 items-center">
                <Link href="/auth/signup" className="text-canopy-700 font-body-medium text-sm">
                  Don't have an account? Sign up
                </Link>
              </View>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                className="border border-canopy-100 rounded-xl px-4 py-3 mb-4 font-body text-canopy-950"
              />
              <Text className="font-body-medium text-sm text-canopy-800 mb-2">I'm using GreenRoots as a...</Text>
              <View className="gap-2 mb-2">
                {ROLES.map((r) => {
                  const active = role === r.key;
                  return (
                    <Pressable key={r.key} onPress={() => setRole(r.key)} style={{ outlineStyle: "none" } as any}>
                      <View
                        className={`rounded-2xl p-3.5 border flex-row items-center gap-3 ${
                          active ? "border-canopy-600 bg-canopy-50" : "border-canopy-100 bg-white"
                        }`}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: active ? "#2C6E3B" : "#DFCFAE",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {active ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#2C6E3B" }} /> : null}
                        </View>
                        <View className="flex-1">
                          <Text className="font-body-semibold text-canopy-950">{r.label}</Text>
                          <Text className="text-xs text-canopy-700/70 mt-0.5">{r.desc}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <Button label="Continue" onPress={handleGuest} loading={loading} fullWidth />
            </>
          )}
        </Card>

        <Pressable onPress={() => router.replace("/")} className="mt-6 items-center">
          <Text className="text-canopy-700/60 text-sm font-body">← Back to home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
