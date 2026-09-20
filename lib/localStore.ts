import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "greenroots:";

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // best-effort persistence for a hackathon prototype
  }
}

export const STORAGE_KEYS = {
  session: "session",
  communitySubmissions: "community_submissions",
  extraVerifications: "extra_verifications",
  treeStatusOverrides: "tree_status_overrides",
  savedPlantIds: "saved_plant_ids",
  chatHistory: "chat_history",
  safetyHistory: "safety_history",
  videoSubmissions: "video_submissions",
  language: "language",
} as const;
