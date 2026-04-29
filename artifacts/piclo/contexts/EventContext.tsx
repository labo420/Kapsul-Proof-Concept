import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { EventPlan } from "@/contexts/PlanContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateEvent, apiGetEvent, type ApiEvent } from "@/lib/api";

export type DeliveryMode = "party" | "morning_after" | "vault";

export interface PicloEvent {
  id: string;
  name: string;
  date: string;
  startTime?: string | null;
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

function apiEventToLocal(e: ApiEvent, existingLocal?: PicloEvent): PicloEvent {
  return {
    id: e.id,
    name: e.name,
    date: e.date,
    startTime: e.startTime ?? null,
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
  events: PicloEvent[];
  createEvent: (
    event: Omit<PicloEvent, "id" | "photoCount" | "guestCount" | "createdAt">
  ) => Promise<PicloEvent>;
  getEvent: (id: string) => PicloEvent | undefined;
  refreshEvent: (id: string, guestToken?: string) => Promise<PicloEvent | null>;
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
  const [events, setEvents] = useState<PicloEvent[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem("piclo_events");
      if (raw) {
        try {
          const parsed: unknown[] = JSON.parse(raw);
          const migrated: PicloEvent[] = parsed.map((e: unknown) => {
            const ev = e as Record<string, unknown>;
            return {
              themeGradientStart: "#6366F1",
              themeGradientEnd: "#EC4899",
              coverImageUri: null,
              ...ev,
            } as PicloEvent;
          });
          setEvents(migrated);
        } catch {}
      }
    }
    load();
  }, []);

  const saveLocal = async (updated: PicloEvent[]) => {
    await AsyncStorage.setItem("piclo_events", JSON.stringify(updated));
    setEvents(updated);
  };

  const createEvent = async (
    partial: Omit<PicloEvent, "id" | "photoCount" | "guestCount" | "createdAt">
  ): Promise<PicloEvent> => {
    try {
      const apiEvent = await apiCreateEvent({
        name: partial.name,
        date: partial.date,
        startTime: partial.startTime ?? undefined,
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
      const local: PicloEvent = {
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

  const refreshEvent = async (id: string, guestToken?: string): Promise<PicloEvent | null> => {
    try {
      const apiEvent = await apiGetEvent(id, guestToken, token);
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
    await AsyncStorage.removeItem("piclo_events");
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
