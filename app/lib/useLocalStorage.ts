"use client"

import { useEffect, useRef, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = () => {
    if (typeof window === "undefined") return initialValue
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  }

  const [value, setValue] = useState<T>(readValue)
  const lastSerializedRef = useRef<string>("")

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const serialized = JSON.stringify(value)
      if (lastSerializedRef.current === serialized) return
      lastSerializedRef.current = serialized
      localStorage.setItem(key, serialized)
      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }))
    } catch {
      // Ignore write errors
    }
  }, [key, value])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorage = (event: StorageEvent | CustomEvent<{ key: string }>) => {
      const eventKey = "key" in event ? event.key : event.detail?.key
      if (eventKey && eventKey !== key) return
      try {
        const raw = localStorage.getItem(key)
        const serialized = raw ?? ""
        if (lastSerializedRef.current === serialized) return
        lastSerializedRef.current = serialized
        setValue(raw ? JSON.parse(raw) : initialValue)
      } catch {
        setValue(initialValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("local-storage", handleStorage as EventListener)
    window.addEventListener("favoritesChanged", handleStorage as EventListener)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("local-storage", handleStorage as EventListener)
      window.removeEventListener("favoritesChanged", handleStorage as EventListener)
    }
  }, [key, initialValue])

  return [value, setValue] as const
}
