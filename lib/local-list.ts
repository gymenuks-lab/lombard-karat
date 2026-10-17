"use client"

import { useSyncExternalStore } from "react"

/**
 * Невеликі списки id у localStorage (обране, нещодавно переглянуті).
 * Працює без бекенду; якщо сховище недоступне (приватний режим), список просто порожній.
 */
const EVENT = "5karat:list-change"
const EMPTY: string[] = []
const cache = new Map<string, { raw: string | null; list: string[] }>()

function read(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key)
    const cached = cache.get(key)
    if (cached && cached.raw === raw) return cached.list
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : EMPTY
    cache.set(key, { raw, list })
    return list
  } catch {
    return EMPTY
  }
}

function write(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // сховище недоступне — нічого не робимо
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

export function useLocalList(key: string): string[] {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  )
}

export function toggleInList(key: string, id: string) {
  const list = read(key)
  write(key, list.includes(id) ? list.filter((item) => item !== id) : [id, ...list])
}

export function pushToList(key: string, id: string, max: number) {
  const list = read(key)
  if (list[0] === id) return
  write(key, [id, ...list.filter((item) => item !== id)].slice(0, max))
}

export const FAVORITES_KEY = "5karat:favorites"
export const RECENT_KEY = "5karat:recent"
