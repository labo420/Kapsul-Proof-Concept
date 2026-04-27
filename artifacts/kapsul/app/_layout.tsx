import {
  SpaceMono_400Regular,
  useFonts as useSpaceFonts,
} from "@expo-google-fonts/space-mono";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GuestProvider } from "@/contexts/GuestContext";
import { EventProvider } from "@/contexts/EventContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 280,
        contentStyle: { backgroundColor: "#0E0E0F" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
      <Stack.Screen name="create-event" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="qr/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="event/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="wall" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="scan" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [monoLoaded, monoError] = useSpaceFonts({
    SpaceMono_400Regular,
  });

  const allLoaded = (fontsLoaded || fontError) && (monoLoaded || monoError);

  useEffect(() => {
    if (allLoaded) {
      SplashScreen.hideAsync();
    }
  }, [allLoaded]);

  if (!allLoaded) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <EventProvider>
                <GuestProvider>
                  <RootLayoutNav />
                </GuestProvider>
              </EventProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
