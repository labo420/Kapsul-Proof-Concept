import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/contexts/EventContext";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const DELIVERY_LABELS: Record<string, string> = {
  party: "Party Mode",
  morning_after: "Morning After",
  vault: "Vault Mode",
};

const DELIVERY_ICONS: Record<string, IoniconsName> = {
  party: "flash",
  morning_after: "sunny",
  vault: "lock-closed",
};

export default function HostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events } = useEvents();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topPad + 16,
          paddingBottom: bottomPad + 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.logo, { color: colors.foreground }]}>
              Kapsul
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              I tuoi eventi
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/create-event");
            }}
            style={[
              styles.createBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={20} color={colors.primaryForeground} />
            <Text style={[styles.createBtnText, { color: colors.primaryForeground }]}>
              Nuovo
            </Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: colors.muted,
                  borderRadius: colors.radius * 2,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="camera-outline" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nessun evento ancora
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Crea il tuo primo evento e genera un QR code per raccogliere le foto dei tuoi ospiti
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/create-event");
              }}
              style={[
                styles.emptyBtn,
                {
                  borderColor: colors.primary,
                  borderRadius: colors.radius,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.emptyBtnText, { color: colors.primary }]}>
                Crea evento
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventList}>
            {events.map(event => (
              <TouchableOpacity
                key={event.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/event/${event.id}`);
                }}
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.eventCardTop}>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={1}>
                      {event.name}
                    </Text>
                    <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
                      {event.date}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modeBadge,
                      {
                        backgroundColor: colors.primary + "20",
                        borderRadius: 999,
                      },
                    ]}
                  >
                    <Ionicons
                      name={DELIVERY_ICONS[event.deliveryMode] ?? "help-circle"}
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={[styles.modeBadgeText, { color: colors.primary }]}>
                      {DELIVERY_LABELS[event.deliveryMode]}
                    </Text>
                  </View>
                </View>
                <View style={[styles.eventCardBottom, { borderTopColor: colors.border }]}>
                  <View style={styles.statItem}>
                    <Ionicons name="images-outline" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                      {event.photoCount} foto
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/qr/${event.id}`);
                    }}
                    style={[styles.qrBtn, { borderColor: colors.border, borderRadius: colors.radius / 2 }]}
                  >
                    <Ionicons name="qr-code-outline" size={14} color={colors.foreground} />
                    <Text style={[styles.qrBtnText, { color: colors.foreground }]}>QR</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  logo: {
    fontSize: 26,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
  },
  emptyBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  eventList: {
    gap: 12,
  },
  eventCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  eventCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventDate: {
    fontSize: 12,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  eventCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
