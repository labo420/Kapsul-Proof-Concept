import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GuestContextType {
  guestId: string | null;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
}

const GuestContext = createContext<GuestContextType>({
  guestId: null,
  acceptedTerms: false,
  setAcceptedTerms: () => {},
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
    }
    init();
  }, []);

  const setAcceptedTerms = async (v: boolean) => {
    setAcceptedTermsState(v);
    await AsyncStorage.setItem("kapsul_terms", v ? "true" : "false");
  };

  return (
    <GuestContext.Provider value={{ guestId, acceptedTerms, setAcceptedTerms }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
