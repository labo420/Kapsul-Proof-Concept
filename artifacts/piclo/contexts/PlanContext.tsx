import AsyncStorage from "@react-native-async-storage/async-storage";
import { Gift, Zap, Star, type LucideIcon } from "lucide-react-native";
import React, { createContext, useContext, useEffect, useState } from "react";

export type EventPlan = "free" | "party" | "pro";

export interface PlanLimits {
  maxPhotos: number;
  maxGuests: number;
  hasWatermark: boolean;
  hasAiRecap: boolean;
  hasHdDownload: boolean;
  label: string;
  price: string;
  icon: LucideIcon;
}

export const PLAN_LIMITS: Record<EventPlan, PlanLimits> = {
  free: {
    maxPhotos: 100,
    maxGuests: 15,
    hasWatermark: true,
    hasAiRecap: false,
    hasHdDownload: false,
    label: "Free Trial",
    price: "Gratis",
    icon: Gift,
  },
  party: {
    maxPhotos: 500,
    maxGuests: 50,
    hasWatermark: false,
    hasAiRecap: false,
    hasHdDownload: false,
    label: "Party",
    price: "1,99 €",
    icon: Zap,
  },
  pro: {
    maxPhotos: 5000,
    maxGuests: 9999,
    hasWatermark: false,
    hasAiRecap: true,
    hasHdDownload: true,
    label: "Piclo Pro",
    price: "9,99 €",
    icon: Star,
  },
};

type PlanContextType = {
  hasUsedFreeTrial: boolean;
  markFreeTrialUsed: () => Promise<void>;
  resetPlan: () => Promise<void>;
};

const PlanContext = createContext<PlanContextType>({
  hasUsedFreeTrial: false,
  markFreeTrialUsed: async () => {},
  resetPlan: async () => {},
});

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("piclo_free_trial_used").then((val) => {
      if (val === "true") setHasUsedFreeTrial(true);
    });
  }, []);

  const markFreeTrialUsed = async () => {
    await AsyncStorage.setItem("piclo_free_trial_used", "true");
    setHasUsedFreeTrial(true);
  };

  const resetPlan = async () => {
    await AsyncStorage.removeItem("piclo_free_trial_used");
    setHasUsedFreeTrial(false);
  };

  return (
    <PlanContext.Provider value={{ hasUsedFreeTrial, markFreeTrialUsed, resetPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
