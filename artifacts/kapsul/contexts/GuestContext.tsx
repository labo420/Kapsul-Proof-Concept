import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GuestContextType {
  guestId: string | null;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  currentEventId: string | null;
  setCurrentEventId: (id: string | null) => void;
  resetGuest: () => Promise<void>;
}

const GuestContext = createContext<GuestContextType>({
  guestId: null,
  acceptedTerms: false,
  setAcceptedTerms: () => {},
  currentEventId: null,
  setCurrentEventId: () => {},
  resetGuest: async () => {},
});

function generateGuestId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "Guest_";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTermsState] = useState(false);
  const [currentEventId, setCurrentEventIdState] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      let id = await AsyncStorage.getItem("kapsul_guest_id");
      if (!id) {
        id = generateGuestId();
        await AsyncStorage.setItem("kapsul_guest_id", id);
      }
      setGuestId(id);

      const terms = await AsyncStorage.getItem("kapsul_terms");
      if (terms === "true") setAcceptedTermsState(true);

      const eventId = await AsyncStorage.getItem("kapsul_current_event_id");
      if (eventId) setCurrentEventIdState(eventId);
    }
    init();
  }, []);

  const setAcceptedTerms = async (v: boolean) => {
    setAcceptedTermsState(v);
    await AsyncStorage.setItem("kapsul_terms", v ? "true" : "false");
  };

  const setCurrentEventId = async (id: string | null) => {
    setCurrentEventIdState(id);
    if (id) {
      await AsyncStorage.setItem("kapsul_current_event_id", id);
    } else {
      await AsyncStorage.removeItem("kapsul_current_event_id");
    }
  };

  const resetGuest = async () => {
    const newId = generateGuestId();
    await AsyncStorage.multiRemove(["kapsul_terms", "kapsul_current_event_id"]);
    await AsyncStorage.setItem("kapsul_guest_id", newId);
    setGuestId(newId);
    setAcceptedTermsState(false);
    setCurrentEventIdState(null);
  };

  return (
    <GuestContext.Provider value={{ guestId, acceptedTerms, setAcceptedTerms, currentEventId, setCurrentEventId, resetGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
