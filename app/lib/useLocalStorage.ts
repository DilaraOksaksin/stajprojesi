"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. State'i başlatırken LocalStorage'dan oku (Böylece useEffect'e gerek kalmaz)
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const lastSerializedRef = useRef<string>("")

  // 2. LocalStorage'ı güncelleme işlemini bir fonksiyona alalım
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const nextValue = typeof newValue === "function" 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue
      
      try {
        const serialized = JSON.stringify(nextValue)
        if (lastSerializedRef.current !== serialized) {
          lastSerializedRef.current = serialized
          localStorage.setItem(key, serialized)
          window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }))
        }
      } catch (e) {
        console.error("LocalStorage save error", e)
      }
      return nextValue
    })
  }, [key])

  // 3. Diğer sekmelerden veya pencerelerden gelen değişiklikleri dinle
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorage = (event: StorageEvent | CustomEvent<{ key: string }>) => {
      const eventKey = "key" in event ? event.key : (event as CustomEvent).detail?.key
      if (eventKey && eventKey !== key) return
      
      try {
        const raw = localStorage.getItem(key)
        const serialized = raw ?? JSON.stringify(initialValue)
        
        if (lastSerializedRef.current === serialized) return
        
        lastSerializedRef.current = serialized
        setValue(raw ? JSON.parse(raw) : initialValue)
      } catch {
        setValue(initialValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("local-storage", handleStorage as EventListener)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("local-storage", handleStorage as EventListener)
    }
  }, [key, initialValue])

  return [value, updateValue] as const
}