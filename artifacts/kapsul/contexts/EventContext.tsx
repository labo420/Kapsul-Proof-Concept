import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { EventPlan } from "@/contexts/PlanContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateEvent, apiGetEvent, type ApiEvent } from "@/lib/api";

export type DeliveryMode = "party" | "morning_after" | "vault";

export interface KapsulEvent {
  id: string;
  name: string;
  date: string;
  deliveryMode: DeliveryMode;
  vaultHours?: number;
  photoCount: number;
  guestCount: number;
  plan: EventPlan;
  createdAt: number;
  themeGradientStart: string;
  themeGradientEnd: string;
  coverImageUri: string | null;
  hostToken?: string | null;
  isPublic?: boolean;
}

function apiEventToLocal(e: ApiEvent, existingLocal?: KapsulEvent): KapsulEvent {
  return {
    id: e.id,
    name: e.name,
    date: e.date,
    deliveryMode: e.deliveryMode as DeliveryMode,
    vaultHours: e.vaultHours,
    photoCount: e.photoCount,
    guestCount: e.guestCount,
    plan: e.plan as EventPlan,
    createdAt: new Date(e.createdAt).getTime(),
    themeGradientStart: e.themeGradientStart,
    themeGradientEnd: e.themeGradientEnd,
    coverImageUri: existingLocal?.coverImageUri ?? null,
    hostToken: e.hostToken ?? existingLocal?.hostToken ?? null,
    isPublic: (e as ApiEvent & { isPublic?: boolean }).isPublic ?? true,
  };
}

interface EventContextType {
  events: KapsulEvent[];
  createEvent: (
    event: Omit<KapsulEvent, "id" | "photoCount" | "guestCount" | "createdAt">
  ) => Promise<KapsulEvent>;
  getEvent: (id: string) => KapsulEvent | undefined;
  refreshEvent: (id: string) => Promise<KapsulEvent | null>;
  incrementPhotoCount: (id: string) => void;
  incrementGuestCount: (id: string) => void;
  resetEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({
  events: [],
  createEvent: async () => ({
    id: "",
    name: "",
    date: "",
    deliveryMode: "party",
    photoCount: 0,
    guestCount: 0,
    plan: "free",
    createdAt: 0,
    themeGradientStart: "#6366F1",
    themeGradientEnd: "#EC4899",
    coverImageUri: null,
  }),
  getEvent: () => undefined,
  refreshEvent: async () => null,
  incrementPhotoCount: () => {},
  incrementGuestCount: () => {},
  resetEvents: async () => {},
});

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [events, setEvents] = useState<KapsulEvent[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem("kapsul_events");
      if (raw) {
        try {
          const parsed: unknown[] = JSON.parse(raw);
          const migrated: KapsulEvent[] = parsed.map((e: unknown) => {
            const ev = e as Record<string, unknown>;
            return {
              themeGradientStart: "#6366F1",
              themeGradientEnd: "#EC4899",
              coverImageUri: null,
              ...ev,
            } as KapsulEvent;
          });
          setEvents(migrated);
        } catch {}
      }
    }
    load();
  }, []);

  const saveLocal = async (updated: KapsulEvent[]) => {
    await AsyncStorage.setItem("kapsul_events", JSON.stringify(updated));
    setEvents(updated);
  };

  const createEvent = async (
    partial: Omit<KapsulEvent, "id" | "photoCount" | "guestCount" | "createdAt">
  ): Promise<KapsulEvent> => {
    try {
      const apiEvent = await apiCreateEvent({
        id: undefined as unknown as string,
        name: partial.name,
        date: partial.date,
        deliveryMode: partial.deliveryMode,
        vaultHours: partial.vaultHours ?? 0,
        plan: partial.plan,
        themeGradientStart: partial.themeGradientStart,
        themeGradientEnd: partial.themeGradientEnd,
      }, token);
      const local = apiEventToLocal(apiEvent);
      const updated = [local, ...events];
      await saveLocal(updated);
      return local;
    } catch {
      const local: KapsulEvent = {
        ...partial,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
        photoCount: 0,
        guestCount: 0,
        createdAt: Date.now(),
      };
      const updated = [local, ...events];
      await saveLocal(updated);
      return local;
    }
  };

  const getEvent = (id: string) => events.find((e) => e.id === id);

  const refreshEvent = async (id: string): Promise<KapsulEvent | null> => {
    try {
      const apiEvent = await apiGetEvent(id);
      const existingLocal = events.find((e) => e.id === id);
      const local = apiEventToLocal(apiEvent, existingLocal);
      const updated = events.map((e) => (e.id === id ? local : e));
      if (!events.find((e) => e.id === id)) updated.unshift(local);
      await saveLocal(updated);
      return local;
    } catch {
      return getEvent(id) ?? null;
    }
  };

  const incrementPhotoCount = (id: string) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, photoCount: e.photoCount + 1 } : e
    );
    saveLocal(updated);
  };

  const incrementGuestCount = (id: string) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, guestCount: e.guestCount + 1 } : e
    );
    saveLocal(updated);
  };

  const resetEvents = async () => {
    await AsyncStorage.removeItem("kapsul_events");
    setEvents([]);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        getEvent,
        refreshEvent,
        incrementPhotoCount,
        incrementGuestCount,
        resetEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
