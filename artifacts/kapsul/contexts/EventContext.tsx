import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { EventPlan } from "@/contexts/PlanContext";

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
}

interface EventContextType {
  events: KapsulEvent[];
  createEvent: (event: Omit<KapsulEvent, "id" | "photoCount" | "guestCount" | "createdAt">) => KapsulEvent;
  getEvent: (id: string) => KapsulEvent | undefined;
  incrementPhotoCount: (id: string) => void;
  incrementGuestCount: (id: string) => void;
  resetEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({
  events: [],
  createEvent: () => ({ id: "", name: "", date: "", deliveryMode: "party", photoCount: 0, guestCount: 0, plan: "free", createdAt: 0 }),
  getEvent: () => undefined,
  incrementPhotoCount: () => {},
  incrementGuestCount: () => {},
  resetEvents: async () => {},
});

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<KapsulEvent[]>([]);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem("kapsul_events");
      if (raw) {
        try { setEvents(JSON.parse(raw)); } catch {}
      }
    }
    load();
  }, []);

  const save = async (updated: KapsulEvent[]) => {
    await AsyncStorage.setItem("kapsul_events", JSON.stringify(updated));
    setEvents(updated);
  };

  const createEvent = (partial: Omit<KapsulEvent, "id" | "photoCount" | "guestCount" | "createdAt">): KapsulEvent => {
    const event: KapsulEvent = {
      ...partial,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      photoCount: 0,
      guestCount: 0,
      createdAt: Date.now(),
    };
    const updated = [event, ...events];
    save(updated);
    return event;
  };

  const getEvent = (id: string) => events.find(e => e.id === id);

  const incrementPhotoCount = (id: string) => {
    const updated = events.map(e =>
      e.id === id ? { ...e, photoCount: e.photoCount + 1 } : e
    );
    save(updated);
  };

  const incrementGuestCount = (id: string) => {
    const updated = events.map(e =>
      e.id === id ? { ...e, guestCount: e.guestCount + 1 } : e
    );
    save(updated);
  };

  const resetEvents = async () => {
    await AsyncStorage.removeItem("kapsul_events");
    setEvents([]);
  };

  return (
    <EventContext.Provider value={{ events, createEvent, getEvent, incrementPhotoCount, incrementGuestCount, resetEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
