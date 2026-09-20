import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import ScreenHeader from "@/components/ScreenHeader";
import { Card, Chip } from "@/components/Primitives";
import AlertCard from "@/components/AlertCard";
import { getAssistantReply, ASSISTANT_DISCLAIMER, SUGGESTED_QUESTIONS } from "@/lib/aiAssistant";
import type { ChatMessage } from "@/types";

function uid() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm the GreenRoots Plant & Health Assistant. Ask me about traditional plant uses, care, or general safety — I'll always separate tradition from evidence.\n\n${ASSISTANT_DISCLAIMER}`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const historyText = messages.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n");
    const reply = await getAssistantReply(content, historyText);
    setMessages((m) => [...m, { id: uid(), role: "assistant", content: reply, timestamp: new Date().toISOString() }]);
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }} edges={["top"]}>
      <ScreenHeader title="Plant & Health Assistant" subtitle="Educational only — never a diagnosis" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 16 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => (
            <MotiView
              key={m.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              className={`mb-3 ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                  m.role === "user" ? "bg-canopy-600 rounded-br-sm" : "bg-canopy-50 border border-canopy-100 rounded-bl-sm"
                }`}
              >
                <Text className={`font-body text-sm leading-5 ${m.role === "user" ? "text-white" : "text-canopy-950"}`}>
                  {m.content}
                </Text>
              </View>
            </MotiView>
          ))}
          {loading && (
            <View className="flex-row items-center gap-2 mb-3">
              <ActivityIndicator size="small" color="#2C6E3B" />
              <Text className="text-xs text-canopy-700/60">Thinking cautiously...</Text>
            </View>
          )}

          {messages.length === 1 && (
            <View className="mt-2">
              <Text className="text-xs text-canopy-700/60 font-body-medium mb-2">Try asking:</Text>
              <View className="flex-row flex-wrap">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Pressable key={q} onPress={() => send(q)} className="mb-2">
                    <Chip label={q} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-5 pb-2">
          <AlertCard tone="info">{ASSISTANT_DISCLAIMER}</AlertCard>
        </View>

        <View className="flex-row items-center gap-2 px-5 pb-4 pt-1">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about a plant, remedy, or safety..."
            placeholderTextColor="#5FAE70"
            className="flex-1 bg-canopy-50 border border-canopy-100 rounded-2xl px-4 py-3 font-body text-canopy-950"
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <Pressable onPress={() => send()} className="w-12 h-12 rounded-2xl bg-canopy-600 items-center justify-center">
            <Text className="text-white text-lg">➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
