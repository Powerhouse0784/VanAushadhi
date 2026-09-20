import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/localStore";
import type {
  CommunitySubmission,
  HealthVideoSubmission,
  SafetyCheckInput,
  SafetyCheckResult,
  TreeStatus,
  TreeVerification,
} from "@/types";

interface SafetyHistoryEntry {
  id: string;
  plantId: string;
  input: SafetyCheckInput;
  result: SafetyCheckResult;
  createdAt: string;
}

interface AppDataContextValue {
  ready: boolean;
  savedPlantIds: string[];
  toggleSavedPlant: (plantId: string) => void;
  communitySubmissions: CommunitySubmission[];
  addCommunitySubmission: (s: Omit<CommunitySubmission, "id" | "createdAt" | "status">) => void;
  setCommunitySubmissionStatus: (id: string, status: CommunitySubmission["status"]) => void;
  extraVerifications: TreeVerification[];
  addVerification: (v: Omit<TreeVerification, "id">) => void;
  approveVerification: (id: string) => void;
  treeStatusOverrides: Record<string, TreeStatus>;
  safetyHistory: SafetyHistoryEntry[];
  addSafetyHistory: (entry: Omit<SafetyHistoryEntry, "id" | "createdAt">) => void;
  videoSubmissions: HealthVideoSubmission[];
  addVideoSubmission: (v: Omit<HealthVideoSubmission, "id" | "createdAt">) => void;
  deleteVideoSubmission: (id: string) => void;
  clearVideoSubmissions: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function uid() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [savedPlantIds, setSavedPlantIds] = useState<string[]>([]);
  const [communitySubmissions, setCommunitySubmissions] = useState<CommunitySubmission[]>([]);
  const [extraVerifications, setExtraVerifications] = useState<TreeVerification[]>([]);
  const [treeStatusOverrides, setTreeStatusOverrides] = useState<Record<string, TreeStatus>>({});
  const [safetyHistory, setSafetyHistory] = useState<SafetyHistoryEntry[]>([]);
  const [videoSubmissions, setVideoSubmissions] = useState<HealthVideoSubmission[]>([]);

  useEffect(() => {
    (async () => {
      setSavedPlantIds(await readJSON(STORAGE_KEYS.savedPlantIds, [] as string[]));
      setCommunitySubmissions(await readJSON(STORAGE_KEYS.communitySubmissions, [] as CommunitySubmission[]));
      setExtraVerifications(await readJSON(STORAGE_KEYS.extraVerifications, [] as TreeVerification[]));
      setTreeStatusOverrides(await readJSON(STORAGE_KEYS.treeStatusOverrides, {} as Record<string, TreeStatus>));
      setSafetyHistory(await readJSON(STORAGE_KEYS.safetyHistory, [] as SafetyHistoryEntry[]));
      setVideoSubmissions(await readJSON(STORAGE_KEYS.videoSubmissions, [] as HealthVideoSubmission[]));
      setReady(true);
    })();
  }, []);

  const toggleSavedPlant = useCallback((plantId: string) => {
    setSavedPlantIds((prev) => {
      const next = prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId];
      writeJSON(STORAGE_KEYS.savedPlantIds, next);
      return next;
    });
  }, []);

  const addCommunitySubmission = useCallback((s: Omit<CommunitySubmission, "id" | "createdAt" | "status">) => {
    setCommunitySubmissions((prev) => {
      const entry: CommunitySubmission = {
        ...s,
        id: uid(),
        status: "pending_review",
        createdAt: new Date().toISOString(),
      };
      const next = [entry, ...prev];
      writeJSON(STORAGE_KEYS.communitySubmissions, next);
      return next;
    });
  }, []);

  const setCommunitySubmissionStatus = useCallback((id: string, status: CommunitySubmission["status"]) => {
    setCommunitySubmissions((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, status } : c));
      writeJSON(STORAGE_KEYS.communitySubmissions, next);
      return next;
    });
  }, []);

  const addVerification = useCallback((v: Omit<TreeVerification, "id">) => {
    setExtraVerifications((prev) => {
      const entry: TreeVerification = { ...v, id: uid() };
      const next = [entry, ...prev];
      writeJSON(STORAGE_KEYS.extraVerifications, next);
      return next;
    });
  }, []);

  const approveVerification = useCallback((id: string) => {
    setExtraVerifications((prev) => {
      const target = prev.find((v) => v.id === id);
      const next = prev.map((v) => (v.id === id ? { ...v, approved: true } : v));
      writeJSON(STORAGE_KEYS.extraVerifications, next);
      if (target) {
        setTreeStatusOverrides((prevOverrides) => {
          const nextOverrides = { ...prevOverrides, [target.treeId]: target.condition };
          writeJSON(STORAGE_KEYS.treeStatusOverrides, nextOverrides);
          return nextOverrides;
        });
      }
      return next;
    });
  }, []);

  const addSafetyHistory = useCallback((entry: Omit<SafetyHistoryEntry, "id" | "createdAt">) => {
    setSafetyHistory((prev) => {
      const item: SafetyHistoryEntry = { ...entry, id: uid(), createdAt: new Date().toISOString() };
      const next = [item, ...prev].slice(0, 30);
      writeJSON(STORAGE_KEYS.safetyHistory, next);
      return next;
    });
  }, []);

  const addVideoSubmission = useCallback((v: Omit<HealthVideoSubmission, "id" | "createdAt">) => {
    setVideoSubmissions((prev) => {
      const item: HealthVideoSubmission = { ...v, id: uid(), createdAt: new Date().toISOString() };
      const next = [item, ...prev];
      writeJSON(STORAGE_KEYS.videoSubmissions, next);
      return next;
    });
  }, []);

  const deleteVideoSubmission = useCallback((id: string) => {
    setVideoSubmissions((prev) => {
      const next = prev.filter((v) => v.id !== id);
      writeJSON(STORAGE_KEYS.videoSubmissions, next);
      return next;
    });
  }, []);

  const clearVideoSubmissions = useCallback(() => {
    setVideoSubmissions([]);
    writeJSON(STORAGE_KEYS.videoSubmissions, []);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      savedPlantIds,
      toggleSavedPlant,
      communitySubmissions,
      addCommunitySubmission,
      setCommunitySubmissionStatus,
      extraVerifications,
      addVerification,
      approveVerification,
      treeStatusOverrides,
      safetyHistory,
      addSafetyHistory,
      videoSubmissions,
      addVideoSubmission,
      deleteVideoSubmission,
      clearVideoSubmissions,
    }),
    [
      ready,
      savedPlantIds,
      communitySubmissions,
      extraVerifications,
      treeStatusOverrides,
      safetyHistory,
      videoSubmissions,
      toggleSavedPlant,
      addCommunitySubmission,
      setCommunitySubmissionStatus,
      addVerification,
      approveVerification,
      addSafetyHistory,
      addVideoSubmission,
      deleteVideoSubmission,
      clearVideoSubmissions,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
