import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import { apiGetGuests, apiRemoveGuest, type ApiGuest } from "@/lib/api";

const DELIVERY_LABELS: Record<string, string> = {
  party: "Party Mode",
  morning_after: "Morning After",
  vault: "Vault Mode",
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getEvent, refreshEvent } = useEvents();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const event = getEvent(id ?? "");

  const [guests, setGuests] = useState<ApiGuest[]>([]);
  const [removingGuest, setRemovingGuest] = useState<string | null>(null);

  const loadGuests = useCallback(async () => {
    if (!id) return;
    try {
      const list = await apiGetGuests(id);
      setGuests(list);
    } catch {
      setGuests([]);
    }
  }, [id]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  function handleRemoveGuest(guest: ApiGuest) {
    if (!id || !event) return;
    const photoLabel =
      guest.photoCount === 0
        ? "Questo ospite non ha caricato foto."
        : `Verranno eliminate anche le ${guest.photoCount} foto caricate da questo ospite. Questa azione è irreversibile.`;

    Alert.alert(
      "Rimuovi ospite",
      `Vuoi rimuovere ${guest.guestId} dall'evento? ${photoLabel}`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Rimuovi",
          style: "destructive",
          onPress: async () => {
            setRemovingGuest(guest.guestId);
            try {
              await apiRemoveGuest(id, guest.guestId, event.hostToken ?? "");
              await refreshEvent(id);
              await loadGuests();
            } catch {
              Alert.alert("Errore", "Impossibile rimuovere l'ospite. Riprova.");
            } finally {
              setRemovingGuest(null);
            }
          },
        },
      ]
    );
  }

  if (!event) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Evento non trovato</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.gradientStart + "18", "transparent"]}
        style={[styles.headerGradient, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
            {event.name}
          </Text>
          <TouchableOpacity onPress={() => router.push(`/qr/${event.id}`)} style={styles.backBtn}>
            <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.gradientStart + "14", colors.gradientEnd + "14"]}
          style={[styles.statsCard, { borderRadius: colors.radius, borderWidth: 1, borderColor: colors.gradientStart + "40" }]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>DATA</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{event.date}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>MODALITÀ</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {DELIVERY_LABELS[event.deliveryMode]}
              </Text>
            </View>
          </View>
          <View style={[styles.photoBanner, { borderTopColor: colors.gradientStart + "30" }]}>
            <Text style={[styles.photoCountLabel, { color: colors.mutedForeground }]}>FOTO CARICATE</Text>
            <Text style={[styles.photoCount, { color: "#fff" }]}>
              {event.photoCount}
            </Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={() => router.push("/wall")}
          style={{ borderRadius: 999, overflow: "hidden" }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wallBtn}
          >
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.wallBtnText}>Vedi Guest Wall</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/qr/${event.id}`)}
          style={[styles.qrBtn, { borderColor: colors.border, borderRadius: 999 }]}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code-outline" size={20} color={colors.foreground} />
          <Text style={[styles.qrBtnText, { color: colors.foreground }]}>Mostra QR Code</Text>
        </TouchableOpacity>

        <View style={styles.guestSection}>
          <View style={styles.guestHeader}>
            <Text style={[styles.guestSectionTitle, { color: colors.foreground }]}>Ospiti</Text>
            <Text style={[styles.guestCount, { color: colors.mutedForeground }]}>{guests.length}</Text>
          </View>

          {guests.length === 0 ? (
            <View style={[styles.emptyGuests, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <Ionicons name="people-outline" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyGuestsText, { color: colors.mutedForeground }]}>
                Nessun ospite ancora
              </Text>
            </View>
          ) : (
            <View style={[styles.guestList, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {guests.map((guest, index) => {
                const initials = guest.guestId.replace("Guest_", "").slice(0, 2).toUpperCase();
                const isRemoving = removingGuest === guest.guestId;
                return (
                  <View key={guest.guestId}>
                    {index > 0 && (
                      <View style={[styles.guestDivider, { backgroundColor: colors.border }]} />
                    )}
                    <View style={styles.guestRow}>
                      <View style={[styles.guestAvatar, { backgroundColor: colors.primary + "22" }]}>
                        <Text style={[styles.guestAvatarText, { color: colors.primary }]}>{initials}</Text>
                      </View>
                      <View style={styles.guestInfo}>
                        <Text style={[styles.guestId, { color: colors.foreground }]} numberOfLines={1}>
                          {guest.guestId}
                        </Text>
                        <Text style={[styles.guestPhotoCount, { color: colors.mutedForeground }]}>
                          {guest.photoCount} foto · {new Date(guest.joinedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveGuest(guest)}
                        disabled={isRemoving}
                        style={[styles.removeBtn, { opacity: isRemoving ? 0.4 : 1 }]}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="person-remove-outline" size={18} color="#FF4466" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGradient: { paddingBottom: 14 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backBtn: { width: 40, alignItems: "center" },
  topTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },
  errorText: { textAlign: "center", marginTop: 100, fontSize: 16 },
  scroll: { flex: 1 },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  statsCard: {
    overflow: "hidden",
  },
  statsRow: {
    flexDirection: "row",
    padding: 20,
    gap: 16,
    alignItems: "flex-start",
  },
  statBlock: {
    flex: 1,
    gap: 5,
  },
  statDivider: {
    width: 1,
    height: "100%",
    alignSelf: "stretch",
    minHeight: 40,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  photoBanner: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  photoCountLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  photoCount: {
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 58,
  },
  wallBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  wallBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderWidth: 1.5,
  },
  qrBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  guestSection: {
    gap: 10,
    marginTop: 4,
  },
  guestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  guestCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyGuests: {
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 10,
  },
  emptyGuestsText: {
    fontSize: 14,
  },
  guestList: {
    borderWidth: 1,
    overflow: "hidden",
  },
  guestDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 56,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  guestAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  guestAvatarText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  guestInfo: {
    flex: 1,
    gap: 2,
  },
  guestId: {
    fontSize: 14,
    fontWeight: "600",
  },
  guestPhotoCount: {
    fontSize: 12,
  },
  removeBtn: {
    padding: 4,
  },
});
