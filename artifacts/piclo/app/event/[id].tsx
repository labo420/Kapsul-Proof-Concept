import { ChevronLeft, Download, Eye, EyeOff, Images, Pencil, QrCode, Users, UserX } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/contexts/EventContext";
import { apiGetGuests, apiRemoveGuest, apiUpdateEvent, type ApiGuest } from "@/lib/api";
import EventDatePicker, { formatDateIT } from "@/components/EventDatePicker";
import EventTimePicker, { formatTimeHHMM } from "@/components/EventTimePicker";

const DELIVERY_LABELS: Record<string, string> = {
  now: "Mostra subito",
  morning_after: "Rivela la mattina dopo",
};

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function parseItalianDate(s: string): Date | null {
  const parts = s.trim().split(" ");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0]!, 10);
  const monthIdx = MONTHS_IT.findIndex(
    (m) => m.toLowerCase() === parts[1]!.toLowerCase()
  );
  const year = parseInt(parts[2]!, 10);
  if (isNaN(day) || monthIdx === -1 || isNaN(year)) return null;
  const d = new Date(year, monthIdx, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseHHMM(s: string): Date | null {
  const parts = s.split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0]!, 10);
  const m = parseInt(parts[1]!, 10);
  if (isNaN(h) || isNaN(m)) return null;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getEvent, refreshEvent } = useEvents();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const event = getEvent(id ?? "");

  const [guests, setGuests] = useState<ApiGuest[]>([]);
  const [removingGuest, setRemovingGuest] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTime, setEditTime] = useState<Date | null>(null);
  const [editGuestsCanView, setEditGuestsCanView] = useState(true);
  const [editGuestsCanDownload, setEditGuestsCanDownload] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGuests = useCallback(async () => {
    if (!id || !event?.hostToken) return;
    try {
      const list = await apiGetGuests(id, event.hostToken);
      setGuests(list);
    } catch {
      setGuests([]);
    }
  }, [id, event?.hostToken]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const handleRefresh = useCallback(async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      await Promise.all([refreshEvent(id), loadGuests()]);
    } finally {
      setRefreshing(false);
    }
  }, [id, refreshEvent, loadGuests]);

  function openEdit() {
    if (!event) return;
    setEditName(event.name);
    setEditDate(parseItalianDate(event.date));
    setEditTime(event.startTime ? parseHHMM(event.startTime) : null);
    setEditGuestsCanView(event.guestsCanView ?? true);
    setEditGuestsCanDownload(event.guestsCanDownload ?? true);
    setEditVisible(true);
  }

  async function handleSave() {
    if (!event || !id || !event.hostToken) return;
    if (!editName.trim()) {
      Alert.alert("Errore", "Il nome dell'evento non può essere vuoto.");
      return;
    }
    setSaving(true);
    try {
      await apiUpdateEvent(id, event.hostToken, {
        name: editName.trim(),
        date: editDate ? formatDateIT(editDate) : event.date,
        startTime: editTime ? formatTimeHHMM(editTime) : null,
        guestsCanView: editGuestsCanView,
        guestsCanDownload: editGuestsCanDownload,
      });
      await refreshEvent(id);
      setEditVisible(false);
    } catch {
      Alert.alert("Errore", "Impossibile salvare le modifiche. Riprova.");
    } finally {
      setSaving(false);
    }
  }

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

  const isHost = !!event.hostToken;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.gradientStart + "18", "transparent"]}
        style={[styles.headerGradient, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.topActions}>
            {isHost && (
              <TouchableOpacity
                onPress={openEdit}
                style={styles.iconBtn}
                accessibilityLabel="Modifica evento"
                accessibilityRole="button"
              >
                <Pencil size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push(`/qr/${event.id}`)} style={styles.iconBtn}>
              <QrCode size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <LinearGradient
          colors={[colors.gradientStart + "14", colors.gradientEnd + "14"]}
          style={[styles.statsCard, { borderRadius: colors.radius, borderWidth: 1, borderColor: colors.gradientStart + "40" }]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>DATA</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{event.date}</Text>
              {event.startTime && (
                <Text style={[styles.statSubValue, { color: colors.mutedForeground }]}>
                  ore {event.startTime}
                </Text>
              )}
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
            <Images size={20} color="#fff" />
            <Text style={styles.wallBtnText}>Vedi Guest Wall</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/qr/${event.id}`)}
          style={[styles.qrBtn, { borderColor: colors.border, borderRadius: 999 }]}
          activeOpacity={0.7}
        >
          <QrCode size={20} color={colors.foreground} />
          <Text style={[styles.qrBtnText, { color: colors.foreground }]}>Mostra QR Code</Text>
        </TouchableOpacity>

        <View style={styles.guestSection}>
          <View style={styles.guestHeader}>
            <Text style={[styles.guestSectionTitle, { color: colors.foreground }]}>Ospiti</Text>
            <Text style={[styles.guestCount, { color: colors.mutedForeground }]}>{guests.length}</Text>
          </View>

          {guests.length === 0 ? (
            <View style={[styles.emptyGuests, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <Users size={32} color={colors.mutedForeground} />
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
                        <UserX size={18} color="#FF4466" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOuter}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setEditVisible(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Modifica evento</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.cancelBtn}>
                <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Annulla</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.sheetBody}
              contentContainerStyle={styles.sheetBodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>NOME EVENTO</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  style={[
                    styles.nameInput,
                    {
                      backgroundColor: colors.input,
                      borderColor: editName.trim() ? colors.primary + "70" : colors.border,
                      borderRadius: colors.radius,
                      color: colors.foreground,
                    },
                  ]}
                  placeholderTextColor={colors.mutedForeground}
                  placeholder="Nome dell'evento"
                  maxLength={80}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>DATA</Text>
                <EventDatePicker value={editDate} onChange={setEditDate} />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>ORARIO</Text>
                <EventTimePicker value={editTime} onChange={setEditTime} />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>PERMESSI OSPITI</Text>
                <View style={[styles.permissionsCard, { backgroundColor: colors.input, borderColor: colors.border, borderRadius: colors.radius }]}>
                  <TouchableOpacity
                    onPress={() => setEditGuestsCanView(v => !v)}
                    activeOpacity={0.7}
                    style={styles.permissionRow}
                  >
                    <View style={[styles.permissionIcon, { backgroundColor: editGuestsCanView ? colors.gradientStart + "22" : colors.muted }]}>
                      {editGuestsCanView ? (
                        <Eye size={16} color={colors.gradientStart} />
                      ) : (
                        <EyeOff size={16} color={colors.mutedForeground} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.permissionTitle, { color: colors.foreground }]}>
                        Vedono tutte le foto
                      </Text>
                      <Text style={[styles.permissionSub, { color: colors.mutedForeground }]}>
                        {editGuestsCanView ? "Galleria completa" : "Solo le proprie foto"}
                      </Text>
                    </View>
                    <Switch
                      value={editGuestsCanView}
                      onValueChange={setEditGuestsCanView}
                      trackColor={{ false: colors.border, true: colors.gradientStart + "88" }}
                      thumbColor={editGuestsCanView ? colors.gradientStart : colors.mutedForeground}
                    />
                  </TouchableOpacity>
                  <View style={[styles.permissionDivider, { backgroundColor: colors.border }]} />
                  <TouchableOpacity
                    onPress={() => setEditGuestsCanDownload(v => !v)}
                    activeOpacity={0.7}
                    style={styles.permissionRow}
                  >
                    <View style={[styles.permissionIcon, { backgroundColor: editGuestsCanDownload ? colors.gradientStart + "22" : colors.muted }]}>
                      <Download size={16} color={editGuestsCanDownload ? colors.gradientStart : colors.mutedForeground} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.permissionTitle, { color: colors.foreground }]}>
                        Possono scaricare
                      </Text>
                      <Text style={[styles.permissionSub, { color: colors.mutedForeground }]}>
                        {editGuestsCanDownload ? "Download abilitato" : "Download disabilitato"}
                      </Text>
                    </View>
                    <Switch
                      value={editGuestsCanDownload}
                      onValueChange={setEditGuestsCanDownload}
                      trackColor={{ false: colors.border, true: colors.gradientStart + "88" }}
                      thumbColor={editGuestsCanDownload ? colors.gradientStart : colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving || !editName.trim()}
                style={{ borderRadius: 999, overflow: "hidden", opacity: saving || !editName.trim() ? 0.5 : 1 }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtn}
                >
                  <Text style={styles.saveBtnText}>{saving ? "Salvataggio…" : "Salva modifiche"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  topActions: { flexDirection: "row", gap: 4, alignItems: "center" },
  iconBtn: { width: 36, alignItems: "center" },
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
  statSubValue: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
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
  modalOuter: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    maxHeight: "85%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cancelBtn: {
    padding: 4,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
  sheetBody: {
    flexShrink: 1,
  },
  sheetBodyContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  nameInput: {
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  permissionsCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  permissionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  permissionSub: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 1,
  },
  permissionDivider: {
    height: 1,
    marginHorizontal: 14,
  },
});
