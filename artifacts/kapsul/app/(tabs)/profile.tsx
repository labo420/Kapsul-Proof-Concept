import {
  Bell, Calendar, ChevronRight, Edit3, Eye, EyeOff,
  FileText, Globe, Info, Link, Lock, LogIn, Plus, Save,
  Settings, ShieldCheck, Trash2, User, UserPlus, X,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import { useEvents, type KapsulEvent } from "@/contexts/EventContext";
import { usePlan } from "@/contexts/PlanContext";
import { API_BASE, photoUrl } from "@/lib/api";
import GradientButton from "@/components/GradientButton";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_ITEM = (SCREEN_WIDTH - 40 - 8) / 3;
const SPRING = { damping: 20, stiffness: 200, mass: 0.9 } as const;

function useFadeIn(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 320 }));
    translateY.value = withDelay(delay, withSpring(0, SPRING));
  }, []);
  return useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
}

function DefaultAvatar({ size = 90 }: { size?: number }) {
  const colors = useColors();
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      <User size={size * 0.45} color="rgba(255,255,255,0.9)" />
    </LinearGradient>
  );
}

interface SocialCounts {
  followers: number;
  following: number;
  posts: number;
}

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
}

interface ApiPhoto {
  id: string;
  objectPath: string;
  eventId: string;
  isPublic: boolean;
  createdAt: string;
}

function SuggestedCard({ user, token }: { user: SuggestedUser; token: string }) {
  const colors = useColors();
  const [following, setFollowing] = useState(false);

  const handleFollow = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (following) {
        await fetch(`${API_BASE}/social/follow/${user.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setFollowing(false);
      } else {
        await fetch(`${API_BASE}/social/follow/${user.id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        setFollowing(true);
      }
    } catch {}
  };

  return (
    <View style={[styles.suggestedCard, { backgroundColor: "#1a1825", borderColor: "#2a2535" }]}>
      {user.avatarUrl ? (
        <Image source={{ uri: photoUrl(user.avatarUrl) }} style={styles.suggestedAvatar} />
      ) : (
        <DefaultAvatar size={48} />
      )}
      <Text style={[styles.suggestedName, { color: "#fff" }]} numberOfLines={1}>{user.displayName}</Text>
      <Text style={[styles.suggestedUsername, { color: colors.mutedForeground }]} numberOfLines={1}>@{user.username}</Text>
      <TouchableOpacity
        style={[styles.suggestedFollowBtn, { backgroundColor: following ? "#2a2535" : colors.gradientStart + "22", borderColor: following ? "#3a3545" : colors.gradientStart }]}
        onPress={handleFollow}
        activeOpacity={0.7}
      >
        <Text style={{ color: following ? colors.mutedForeground : colors.gradientStart, fontSize: 12, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>
          {following ? "Seguendo" : "Segui"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [link, setLink] = useState(user?.link ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setDisplayName(user?.displayName ?? "");
      setBio(user?.bio ?? "");
      setLink(user?.link ?? "");
    }
  }, [visible, user]);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim(), bio: bio.trim(), link: link.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch {
      Alert.alert("Errore", "Salvataggio fallito");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: colors.mutedForeground, fontSize: 16, fontFamily: "Inter_400Regular" }}>Annulla</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Modifica profilo</Text>
          <TouchableOpacity onPress={save} disabled={saving}>
            <Text style={{ color: saving ? colors.mutedForeground : colors.gradientStart, fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              {saving ? "..." : "Salva"}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          {[
            { label: "NOME VISUALIZZATO", value: displayName, set: setDisplayName, maxLength: 50 },
            { label: "BIO", value: bio, set: setBio, maxLength: 150, multiline: true },
            { label: "LINK", value: link, set: setLink, maxLength: 200, placeholder: "https://..." },
          ].map((f) => (
            <View key={f.label} style={{ gap: 6 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: "600", letterSpacing: 1.2, fontFamily: "Inter_600SemiBold" }}>{f.label}</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, minHeight: f.multiline ? 80 : 50 }]}
                value={f.value}
                onChangeText={f.set}
                maxLength={f.maxLength}
                multiline={f.multiline}
                placeholder={f.placeholder ?? ""}
                placeholderTextColor={colors.mutedForeground + "80"}
                autoCapitalize={f.label === "LINK" ? "none" : "sentences"}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function UserListModal({ visible, onClose, title, endpoint, token }: { visible: boolean; onClose: () => void; title: string; endpoint: string; token: string }) {
  const colors = useColors();
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json() as Promise<SuggestedUser[]>)
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [visible, endpoint]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{title}</Text>
          <View style={{ width: 30 }} />
        </View>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.gradientStart} />
          </View>
        ) : users.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 15, textAlign: "center" }}>Nessuno da mostrare</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(u) => u.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                {item.avatarUrl ? (
                  <Image source={{ uri: photoUrl(item.avatarUrl) }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                ) : (
                  <DefaultAvatar size={44} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 14, fontFamily: "Inter_700Bold" }}>{item.displayName}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12, fontFamily: "Inter_400Regular" }}>@{item.username}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

function HighlightsPickerModal({ visible, onClose, events, selectedIds, onSave }: {
  visible: boolean; onClose: () => void;
  events: KapsulEvent[];
  selectedIds: string[];
  onSave: (ids: string[]) => Promise<void>;
}) {
  const colors = useColors();
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (visible) setSelected(selectedIds); }, [visible, selectedIds]);

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 10)
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch {
      Alert.alert("Errore", "Salvataggio fallito");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: colors.mutedForeground, fontSize: 16, fontFamily: "Inter_400Regular" }}>Annulla</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Scegli Highlights</Text>
          <TouchableOpacity onPress={save} disabled={saving}>
            <Text style={{ color: saving ? colors.mutedForeground : colors.gradientStart, fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              {saving ? "..." : "Salva"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: colors.mutedForeground, fontSize: 13, padding: 16, fontFamily: "Inter_400Regular" }}>
          Seleziona gli eventi da mostrare in evidenza (max 10)
        </Text>
        <FlatList
          data={events}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                onPress={() => toggle(item.id)}
                activeOpacity={0.8}
                style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
              >
                <LinearGradient
                  colors={[item.themeGradientStart, item.themeGradientEnd]}
                  style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" }}
                >
                  <Calendar size={22} color="#fff" />
                </LinearGradient>
                <Text style={{ flex: 1, color: colors.foreground, fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: isSelected ? colors.gradientStart : "transparent",
                  borderWidth: 2, borderColor: isSelected ? colors.gradientStart : colors.border,
                  alignItems: "center", justifyContent: "center",
                }}>
                  {isSelected && <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

interface AppNotification {
  id: string;
  type: string;
  entityId: string | null;
  read: boolean;
  createdAt: string;
  actor: { id: string; username: string; displayName: string; avatarUrl: string | null };
}

function NotificationsModal({ visible, onClose, token, onRead }: {
  visible: boolean; onClose: () => void; token: string; onRead: () => void;
}) {
  const colors = useColors();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetch(`${API_BASE}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json() as Promise<AppNotification[]>)
      .then((data) => { setItems(data); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [visible, token]);

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      onRead();
    } catch {}
  };

  const notifLabel = (n: AppNotification) => {
    if (n.type === "follow") return `${n.actor.displayName} ha iniziato a seguirti`;
    if (n.type === "photo") return `${n.actor.displayName} ha caricato una foto`;
    if (n.type === "like") return `${n.actor.displayName} ha messo like alla tua foto`;
    return `Nuova notifica da ${n.actor.displayName}`;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "adesso";
    if (m < 60) return `${m}m fa`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h fa`;
    return `${Math.floor(h / 24)}g fa`;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Notifiche</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ color: colors.gradientStart, fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Segna lette</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.gradientStart} />
          </View>
        ) : items.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 30 }}>
            <Bell size={44} color={colors.mutedForeground + "60"} style={{ marginBottom: 14 }} />
            <Text style={{ color: colors.mutedForeground, fontSize: 15, textAlign: "center" }}>
              Nessuna notifica ancora.{"\n"}Inizia a seguire altri utenti per ricevere aggiornamenti.
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(n) => n.id}
            contentContainerStyle={{ padding: 16, gap: 2 }}
            renderItem={({ item }) => (
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12,
                paddingHorizontal: 14, borderRadius: 12,
                backgroundColor: item.read ? "transparent" : colors.gradientStart + "11",
              }}>
                {item.actor.avatarUrl ? (
                  <Image source={{ uri: photoUrl(item.actor.avatarUrl) }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                ) : (
                  <DefaultAvatar size={44} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 14, fontFamily: "Inter_400Regular" }}>
                    {notifLabel(item)}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>{timeAgo(item.createdAt)}</Text>
                </View>
                {!item.read && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gradientStart }} />
                )}
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

function SectionHeader({ label }: { label: string }) {
  const colors = useColors();
  return <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{label}</Text>;
}

function SettingRow({ icon, label, right, onPress, isLast }: { icon: React.ReactNode; label: string; right?: React.ReactNode; onPress?: () => void; isLast?: boolean }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingRow, { backgroundColor: colors.card, borderBottomColor: isLast ? "transparent" : colors.border }]}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: colors.gradientStart + "22" }]}>{icon}</View>
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.settingRight}>{right ?? <ChevronRight size={16} color={colors.mutedForeground} />}</View>
    </TouchableOpacity>
  );
}

function NotLoggedIn() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40, paddingTop: topPad }}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 20 }}
        >
          <User size={38} color="#fff" />
        </LinearGradient>
        <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 10 }}>
          Il tuo profilo ti aspetta
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 32 }}>
          Accedi o crea un account per vedere il tuo profilo, seguire altri utenti e condividere i tuoi momenti.
        </Text>
        <GradientButton label="Accedi" onPress={() => router.push("/login")} size="lg" />
        <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 14, fontFamily: "Inter_400Regular" }}>
            Non hai un account?{" "}
            <Text style={{ color: colors.foreground, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>Registrati</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, token, logout, updateProfile, refreshUser } = useAuth();
  const { resetGuest } = useGuest();
  const { events, resetEvents } = useEvents();
  const { resetPlan } = usePlan();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"photos" | "events">("photos");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [highlightPickerVisible, setHighlightPickerVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [counts, setCounts] = useState<SocialCounts>({ followers: 0, following: 0, posts: 0 });
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [myPhotos, setMyPhotos] = useState<ApiPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const anim0 = useFadeIn(0);
  const anim1 = useFadeIn(80);
  const anim2 = useFadeIn(160);
  const anim3 = useFadeIn(240);

  const highlightIds: string[] = user?.highlights ?? [];
  const highlightEvents = events.filter((e) => highlightIds.includes(e.id));
  const displayHighlights = highlightEvents.length > 0 ? highlightEvents : events.slice(0, 6);

  const fetchCounts = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE}/social/counts/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCounts(await res.json() as SocialCounts);
    } catch {}
  }, [user, token]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json() as { unreadCount: number };
        setUnreadCount(data.unreadCount);
      }
    } catch {}
  }, [user, token]);

  const fetchSuggestions = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`${API_BASE}/social/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSuggestions((await res.json() as SuggestedUser[]).slice(0, 6));
    } catch {}
  }, [user, token]);

  const fetchMyPhotos = useCallback(async () => {
    if (!user || !token) return;
    setPhotosLoading(true);
    try {
      const res = await fetch(`${API_BASE}/social/myphotos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMyPhotos(await res.json() as ApiPhoto[]);
    } catch {}
    setPhotosLoading(false);
  }, [user, token]);

  useEffect(() => {
    fetchCounts();
    fetchSuggestions();
    fetchMyPhotos();
    fetchUnreadCount();
  }, [fetchCounts, fetchSuggestions, fetchMyPhotos, fetchUnreadCount]);

  const handleAvatarPress = async () => {
    if (!token) return;
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setAvatarUploading(true);
    try {
      const form = new FormData();
      if (Platform.OS === "web") {
        const r = await fetch(asset.uri);
        const blob = await r.blob();
        form.append("avatar", blob, "avatar.jpg");
      } else {
        form.append("avatar", { uri: asset.uri, name: "avatar.jpg", type: "image/jpeg" } as unknown as Blob);
      }
      const res = await fetch(`${API_BASE}/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        await refreshUser();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert("Errore", "Caricamento avatar fallito");
      }
    } catch {
      Alert.alert("Errore", "Impossibile caricare la foto");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleTogglePrivacy = async () => {
    if (!user || !token) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateProfile({ isPublic: !user.isPublic });
    } catch {
      Alert.alert("Errore", "Impossibile aggiornare la privacy");
    }
  };

  const handleToggleEventPrivacy = async (eventId: string, currentlyPublic: boolean) => {
    if (!token) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await fetch(`${API_BASE}/social/events/${eventId}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublic: !currentlyPublic }),
      });
    } catch {}
  };

  const handleTogglePhotoPrivacy = async (photo: ApiPhoto) => {
    if (!token) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const res = await fetch(`${API_BASE}/social/photos/${photo.id}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublic: !photo.isPublic }),
      });
      if (res.ok) {
        setMyPhotos((prev) => prev.map((p) => p.id === photo.id ? { ...p, isPublic: !p.isPublic } : p));
      }
    } catch {}
  };

  const handleSaveHighlights = async (ids: string[]) => {
    await updateProfile({ highlights: ids });
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Esci dall'account", "Vuoi davvero uscire?", [
      { text: "Annulla", style: "cancel" },
      { text: "Esci", style: "destructive", onPress: async () => { await logout(); router.replace("/login"); } },
    ]);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Reset dati demo", "Tutti gli eventi locali e le impostazioni verranno cancellati.", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Reset", style: "destructive",
        onPress: async () => {
          try {
            await Promise.all([resetEvents(), resetGuest(), resetPlan()]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(tabs)");
          } catch {
            Alert.alert("Errore", "Il reset non è riuscito.");
          }
        },
      },
    ]);
  };

  if (!user) return <NotLoggedIn />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <EditProfileModal visible={editModalVisible} onClose={() => { setEditModalVisible(false); fetchCounts(); }} />
      <UserListModal
        visible={followersModalVisible}
        onClose={() => setFollowersModalVisible(false)}
        title={`Follower (${counts.followers})`}
        endpoint={`${API_BASE}/social/followers/${user.id}`}
        token={token!}
      />
      <UserListModal
        visible={followingModalVisible}
        onClose={() => setFollowingModalVisible(false)}
        title={`Seguiti (${counts.following})`}
        endpoint={`${API_BASE}/social/following/${user.id}`}
        token={token!}
      />
      <HighlightsPickerModal
        visible={highlightPickerVisible}
        onClose={() => setHighlightPickerVisible(false)}
        events={events}
        selectedIds={highlightIds}
        onSave={handleSaveHighlights}
      />
      <NotificationsModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        token={token!}
        onRead={() => setUnreadCount(0)}
      />

      <ScrollView
        contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar with notifications ── */}
        <Animated.View style={[anim0, { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }]}>
          <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", fontFamily: "Inter_700Bold", letterSpacing: -0.3 }}>Profilo</Text>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setNotifModalVisible(true); }}
            style={{ position: "relative" }}
            activeOpacity={0.7}
          >
            <Bell size={24} color={colors.foreground} />
            {unreadCount > 0 && (
              <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: colors.gradientEnd, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Instagram-style header ── */}
        <Animated.View style={[anim0, { paddingHorizontal: 20 }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleAvatarPress} disabled={avatarUploading}>
              {user.avatarUrl ? (
                <Image source={{ uri: photoUrl(user.avatarUrl) }} style={styles.avatar} />
              ) : (
                <DefaultAvatar size={90} />
              )}
              <View style={[styles.avatarEditBadge, { backgroundColor: avatarUploading ? colors.mutedForeground : colors.gradientStart }]}>
                {avatarUploading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Plus size={10} color="#fff" />}
              </View>
            </TouchableOpacity>

            <View style={styles.countersRow}>
              <TouchableOpacity style={styles.counterItem} activeOpacity={0.7}>
                <Text style={[styles.counterValue, { color: colors.foreground }]}>{counts.posts}</Text>
                <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.counterItem}
                activeOpacity={0.7}
                onPress={() => { Haptics.selectionAsync(); setFollowersModalVisible(true); }}
              >
                <Text style={[styles.counterValue, { color: colors.foreground }]}>{counts.followers}</Text>
                <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>Follower</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.counterItem}
                activeOpacity={0.7}
                onPress={() => { Haptics.selectionAsync(); setFollowingModalVisible(true); }}
              >
                <Text style={[styles.counterValue, { color: colors.foreground }]}>{counts.following}</Text>
                <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>Seguiti</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.displayName, { color: colors.foreground }]}>{user.displayName}</Text>
          <Text style={[styles.usernameText, { color: colors.gradientStart }]}>@{user.username}</Text>
          {user.bio ? <Text style={[styles.bioText, { color: colors.foreground }]}>{user.bio}</Text> : null}
          {user.link ? (
            <TouchableOpacity onPress={() => Linking.openURL(user.link)} style={styles.linkRow}>
              <Link size={12} color={colors.gradientMid} />
              <Text style={[styles.linkText, { color: colors.gradientMid }]} numberOfLines={1}>{user.link}</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <Edit3 size={14} color={colors.foreground} />
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Modifica profilo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.privacyBtn, { backgroundColor: user.isPublic ? colors.card : colors.gradientStart + "22", borderColor: user.isPublic ? colors.border : colors.gradientStart }]}
              onPress={handleTogglePrivacy}
              activeOpacity={0.7}
            >
              {user.isPublic
                ? <Globe size={14} color={colors.mutedForeground} />
                : <Lock size={14} color={colors.gradientStart} />}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Highlights row ── */}
        <Animated.View style={[anim1, { marginTop: 20 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 10 }}>
            <Text style={[styles.sectionHeader, { color: colors.mutedForeground, flex: 1 }]}>HIGHLIGHTS</Text>
            <TouchableOpacity onPress={() => setHighlightPickerVisible(true)} activeOpacity={0.7}>
              <Plus size={16} color={colors.gradientStart} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {displayHighlights.map((e) => (
              <TouchableOpacity
                key={e.id}
                style={styles.highlightItem}
                onPress={() => router.push(`/event/${e.id}`)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[e.themeGradientStart, e.themeGradientEnd]}
                  style={styles.highlightCircle}
                >
                  <Calendar size={22} color="#fff" />
                </LinearGradient>
                <Text style={[styles.highlightLabel, { color: colors.foreground }]} numberOfLines={1}>{e.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.highlightItem}
              onPress={() => setHighlightPickerVisible(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.highlightCircle, { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border, borderStyle: "dashed" }]}>
                <Plus size={22} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.highlightLabel, { color: colors.mutedForeground }]}>Aggiungi</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* ── Content grid tabs ── */}
        <Animated.View style={[anim2, { marginTop: 24 }]}>
          <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
            {([["photos", "Foto", "camera"], ["events", "Eventi", "calendar"]] as const).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.tabItem, activeTab === key && { borderBottomColor: colors.gradientStart, borderBottomWidth: 2 }]}
                onPress={() => { setActiveTab(key); Haptics.selectionAsync(); }}
                activeOpacity={0.7}
              >
                <Text style={{ color: activeTab === key ? colors.gradientStart : colors.mutedForeground, fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "photos" ? (
            photosLoading ? (
              <View style={styles.gridEmpty}>
                <ActivityIndicator color={colors.gradientStart} />
              </View>
            ) : myPhotos.length === 0 ? (
              <View style={styles.gridEmpty}>
                <Text style={{ color: colors.mutedForeground, fontSize: 14, textAlign: "center" }}>
                  Nessuna foto ancora.{"\n"}Carica foto negli eventi per vederle qui.
                </Text>
              </View>
            ) : (
              <View style={[styles.grid, { paddingHorizontal: 20, marginTop: 4 }]}>
                {myPhotos.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onLongPress={() => handleTogglePhotoPrivacy(p)}
                    activeOpacity={0.85}
                    style={{ width: GRID_ITEM, aspectRatio: 1, marginBottom: 4 }}
                  >
                    <Image
                      source={{ uri: photoUrl(p.objectPath) }}
                      style={{ width: "100%", height: "100%", borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    {!p.isPublic && (
                      <View style={[styles.lockBadge, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
                        <Lock size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : (
            <View style={[styles.grid, { paddingHorizontal: 20, marginTop: 4 }]}>
              {events.length === 0 ? (
                <View style={styles.gridEmpty}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 14, textAlign: "center" }}>Nessun evento ancora</Text>
                </View>
              ) : (
                events.map((e) => (
                  <TouchableOpacity
                    key={e.id}
                    onPress={() => router.push(`/event/${e.id}`)}
                    onLongPress={() => handleToggleEventPrivacy(e.id, e.isPublic ?? true)}
                    delayLongPress={500}
                    activeOpacity={0.8}
                    style={{ width: GRID_ITEM, aspectRatio: 1, marginBottom: 4 }}
                  >
                    <LinearGradient
                      colors={[e.themeGradientStart, e.themeGradientEnd]}
                      style={[styles.gridEventCard, { borderRadius: colors.radius }]}
                    >
                      <Calendar size={24} color="#fff" />
                      <Text style={styles.gridEventName} numberOfLines={2}>{e.name}</Text>
                      {e.isPublic === false && (
                        <View style={[styles.lockBadge, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                          <Lock size={10} color="#fff" />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </Animated.View>

        {/* ── Profili suggeriti ── */}
        {suggestions.length > 0 && (
          <Animated.View style={[anim3, { marginTop: 28, paddingHorizontal: 20 }]}>
            <SectionHeader label="SCOPRI" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4, marginTop: 10 }}>
              {suggestions.map((s) => (
                <SuggestedCard key={s.id} user={s} token={token!} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Impostazioni ── */}
        <Animated.View style={[anim3, { marginTop: 28, paddingHorizontal: 20 }]}>
          <SectionHeader label="IMPOSTAZIONI" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingRow
              icon={<Bell size={16} color={colors.gradientStart} />}
              label="Notifiche"
              right={
                <Switch value={notifEnabled} onValueChange={(v) => { setNotifEnabled(v); Haptics.selectionAsync(); }}
                  trackColor={{ false: colors.border, true: colors.gradientStart }} thumbColor="#fff" />
              }
            />
            <SettingRow
              icon={<Save size={16} color={colors.gradientStart} />}
              label="Salvataggio automatico foto"
              isLast
              right={
                <Switch value={autoSaveEnabled} onValueChange={(v) => { setAutoSaveEnabled(v); Haptics.selectionAsync(); }}
                  trackColor={{ false: colors.border, true: colors.gradientStart }} thumbColor="#fff" />
              }
            />
          </View>
        </Animated.View>

        {/* ── Legale ── */}
        <Animated.View style={[anim3, { marginTop: 20, paddingHorizontal: 20 }]}>
          <SectionHeader label="LEGALE" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingRow
              icon={<FileText size={16} color={colors.gradientStart} />}
              label="Termini di Servizio"
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL("https://kapsul.app/terms"); }}
            />
            <SettingRow
              icon={<ShieldCheck size={16} color={colors.gradientStart} />}
              label="Privacy Policy"
              isLast
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL("https://kapsul.app/privacy"); }}
            />
          </View>
        </Animated.View>

        {/* ── App ── */}
        <Animated.View style={[anim3, { marginTop: 20, paddingHorizontal: 20 }]}>
          <SectionHeader label="APP" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <SettingRow
              icon={<Info size={16} color={colors.gradientStart} />}
              label="Versione"
              right={<Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: "Inter_400Regular" }}>1.0.0-beta</Text>}
            />
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              style={[styles.settingRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: colors.destructive + "22" }]}>
                <LogIn size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>Esci dall'account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReset}
              activeOpacity={0.7}
              style={[styles.settingRow, { backgroundColor: colors.card, borderBottomColor: "transparent" }]}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: colors.destructive + "22" }]}>
                <Trash2 size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>Reset dati locali</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarEditBadge: {
    position: "absolute", bottom: 2, right: 2, width: 22, height: 22,
    borderRadius: 11, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#08060F",
  },
  countersRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  counterItem: { alignItems: "center", gap: 2 },
  counterValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  counterLabel: { fontSize: 12, fontWeight: "500", fontFamily: "Inter_500Medium" },
  displayName: { fontSize: 17, fontWeight: "800", letterSpacing: -0.2, marginBottom: 2 },
  usernameText: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  bioText: { fontSize: 14, lineHeight: 20, marginBottom: 6, fontFamily: "Inter_400Regular" },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 14 },
  linkText: { fontSize: 13, fontWeight: "500", fontFamily: "Inter_500Medium" },
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9, borderRadius: 10, borderWidth: 1,
  },
  actionBtnText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  privacyBtn: {
    width: 42, alignItems: "center", justifyContent: "center",
    borderRadius: 10, borderWidth: 1,
  },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, marginHorizontal: 20 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  gridEmpty: { alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: 20 },
  gridEventCard: { flex: 1, alignItems: "center", justifyContent: "center", padding: 10, gap: 6 },
  gridEventName: { color: "#fff", fontSize: 11, fontWeight: "600", textAlign: "center", fontFamily: "Inter_600SemiBold" },
  lockBadge: {
    position: "absolute", top: 6, right: 6,
    borderRadius: 6, padding: 3,
  },
  highlightItem: { alignItems: "center", gap: 6, width: 70 },
  highlightCircle: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  highlightLabel: { fontSize: 11, fontWeight: "500", textAlign: "center", fontFamily: "Inter_500Medium" },
  suggestedCard: { width: 130, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 4 },
  suggestedAvatar: { width: 48, height: 48, borderRadius: 24, marginBottom: 4 },
  suggestedName: { fontSize: 13, fontWeight: "700", fontFamily: "Inter_700Bold", textAlign: "center" },
  suggestedUsername: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  suggestedFollowBtn: { marginTop: 6, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  sectionHeader: { fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
  settingsGroup: { borderWidth: 1, overflow: "hidden" },
  settingRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  settingIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: "500", fontFamily: "Inter_500Medium" },
  settingRight: { alignItems: "flex-end" },
  modalRoot: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  modalInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 15, fontFamily: "Inter_400Regular" },
});
