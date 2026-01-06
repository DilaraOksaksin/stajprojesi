"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/app/lib/useLocalStorage";
import { ACTIVITY_LOG_KEY, type ActivityLogEntry } from "@/app/lib/activity-log";

const MAX_LOGS = 50;

export function useActivityLog() {
  const [entries, setEntries] = useLocalStorage<ActivityLogEntry[]>(
    ACTIVITY_LOG_KEY,
    []
  );

  const addActivity = useCallback(
    (entry: ActivityLogEntry) => {
      setEntries((prev) => [entry, ...prev].slice(0, MAX_LOGS));
    },
    [setEntries]
  );

  return { entries, addActivity };
}
