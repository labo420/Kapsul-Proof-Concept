import {
  Bell, Calendar, Edit3, Link, Lock, Plus, Settings, X,
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
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
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
import { useEvents, type PicloEvent } from "@/contexts/EventContext";
import { API_BASE, photoUrl } from "@/lib/api";
import GradientButton from "@/components/GradientButton";

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

interface AppNotification {
  id: string;
  type: string;
  entityId: string | null;
  read: boolean;
  createdAt: string;
  actor: { id: string; username: string; displayName: string; avatarUrl: string | null };
}

function DefaultAvatar({ size = 44, initials }: { size?: number; initials: string }) {
  const colors = useColors();
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size, height: size, borderRadius: 12,
        alignItems: "center", justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: size * 0.35, fontWeight: "900", fontFamily: "Inter_700Bold" }}>
        {initials}
      </Text>
    </LinearGradient>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
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

function UserListModal({ visible, onClose, title, endpoint, token }: {
  visible: boolean; onClose: () => void; title: string; endpoint: string; token: string;
}) {
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
                  <DefaultAvatar size={44} initials={getInitials(item.displayName)} />
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
    if (n.type === "comment") return `${n.actor.displayName} ha commentato la tua foto`;
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
                  <DefaultAvatar size={44} initials={getInitials(item.actor.displayName)} />
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
    <View style={[styles.suggestedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {user.avatarUrl ? (
        <Image source={{ uri: photoUrl(user.avatarUrl) }} style={styles.suggestedAvatar} />
      ) : (
        <DefaultAvatar size={48} initials={getInitials(user.displayName)} />
      )}
      <Text style={[styles.suggestedName, { color: colors.foreground }]} numberOfLines={1}>{user.displayName}</Text>
      <Text style={[styles.suggestedUsername, { color: colors.mutedForeground }]} numberOfLines={1}>@{user.username}</Text>
      <TouchableOpacity
        style={[styles.suggestedFollowBtn, {
          backgroundColor: following ? colors.card : colors.gradientStart + "22",
          borderColor: following ? colors.border : colors.gradientStart,
        }]}
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

function EventCard({ event, onPress }: { event: PicloEvent; onPress: () => void }) {
  const colors = useColors();

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <LinearGradient
        colors={[event.themeGradientStart, event.themeGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.eventCardThumb}
      >
        <Calendar size={28} color="rgba(255,255,255,0.5)" />
      </LinearGradient>
      <View style={styles.eventCardBody}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eventCardName, { color: colors.foreground }]} numberOfLines={1}>{event.name}</Text>
          <Text style={[styles.eventCardDate, { color: colors.mutedForeground }]}>
            {event.createdAt ? formatDate(event.createdAt) : ""}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.eventCardCount, { color: colors.gradientStart }]}>
            {event.photoCount ?? 0}
          </Text>
          <Text style={[styles.eventCardCountLabel, { color: colors.mutedForeground }]}>foto</Text>
        </View>
      </View>
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
          style={{ width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 20 }}
        >
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>P</Text>
        </LinearGradient>
        <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 10, fontFamily: "Inter_700Bold" }}>
          Il tuo profilo ti aspetta
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 32, fontFamily: "Inter_400Regular" }}>
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
  const { user, token, refreshUser } = useAuth();
  const { events } = useEvents();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [counts, setCounts] = useState<SocialCounts>({ followers: 0, following: 0, posts: 0 });
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const anim0 = useFadeIn(0);
  const anim1 = useFadeIn(80);
  const anim2 = useFadeIn(160);

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

  useEffect(() => {
    fetchCounts();
    fetchSuggestions();
    fetchUnreadCount();
  }, [fetchCounts, fetchSuggestions, fetchUnreadCount]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshUser(),
      fetchCounts(),
      fetchSuggestions(),
      fetchUnreadCount(),
    ]);
    setRefreshing(false);
  }, [refreshUser, fetchCounts, fetchSuggestions, fetchUnreadCount]);

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

  if (!user) return <NotLoggedIn />;

  const initials = getInitials(user.displayName || user.username);

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
      <NotificationsModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        token={token!}
        onRead={() => setUnreadCount(0)}
      />

      <ScrollView
        contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 100 }}
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
        {/* ── Top bar ── */}
        <Animated.View style={[anim0, { paddingHorizontal: 24, flexDirection: "row", alignItems: "center", marginBottom: 20 }]}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleAvatarPress} disabled={avatarUploading}>
              {user.avatarUrl ? (
                <View>
                  <Image
                    source={{ uri: photoUrl(user.avatarUrl) }}
                    style={{ width: 44, height: 44, borderRadius: 12 }}
                  />
                  {avatarUploading && (
                    <View style={{ ...StyleSheet.absoluteFillObject, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" }}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </View>
              ) : (
                <DefaultAvatar size={44} initials={initials} />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.displayName, { color: colors.foreground }]} numberOfLines={1}>
                {user.displayName || user.username}
              </Text>
              <Text style={{ color: colors.gradientStart, fontSize: 13, fontFamily: "Inter_600SemiBold" }}>
                @{user.username}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); setNotifModalVisible(true); }}
              style={{ position: "relative" }}
              activeOpacity={0.7}
            >
              <Bell size={22} color={colors.foreground} />
              {unreadCount > 0 && (
                <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: colors.gradientEnd, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); router.push("/settings"); }}
              style={[styles.gearBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Settings size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Stats pills ── */}
        <Animated.View style={[anim0, { paddingHorizontal: 24, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }]}>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); }}
            style={[styles.statPill, { backgroundColor: colors.gradientStart + "22", borderColor: colors.gradientStart + "44" }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.gradientStart, fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              {events.length} eventi
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.border, fontSize: 14 }}>·</Text>
          <TouchableOpacity
            style={[styles.statPill, { backgroundColor: colors.gradientMid + "22", borderColor: colors.gradientMid + "44" }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.gradientMid, fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              {counts.posts} foto
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.border, fontSize: 14 }}>·</Text>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setFollowersModalVisible(true); }}
            style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              {counts.followers} follower
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Bio + link ── */}
        {(user.bio || user.link) && (
          <Animated.View style={[anim0, { paddingHorizontal: 24, marginBottom: 18 }]}>
            {user.bio ? (
              <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular", marginBottom: 6 }}>
                {user.bio}
              </Text>
            ) : null}
            {user.link ? (
              <TouchableOpacity onPress={() => Linking.openURL(user.link!)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Link size={12} color={colors.gradientMid} />
                <Text style={{ color: colors.gradientMid, fontSize: 13, fontFamily: "Inter_500Medium" }} numberOfLines={1}>
                  {user.link}
                </Text>
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        )}

        {/* ── Action buttons ── */}
        <Animated.View style={[anim0, { paddingHorizontal: 24, flexDirection: "row", gap: 8, marginBottom: 28 }]}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
            style={[styles.actionBtn, { backgroundColor: colors.gradientStart + "22", borderColor: colors.gradientStart + "60" }]}
          >
            <Edit3 size={14} color={colors.foreground} />
            <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Modifica profilo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/create-event")}
            activeOpacity={0.7}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Plus size={14} color={colors.mutedForeground} />
            <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>Nuovo evento</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Events feed ── */}
        <Animated.View style={[anim1, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20 }]}>
          <Text style={[styles.sectionHeader, { color: colors.mutedForeground, paddingHorizontal: 24, marginBottom: 14 }]}>
            I TUOI EVENTI
          </Text>
          {events.length === 0 ? (
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, alignItems: "center" }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 14, textAlign: "center", fontFamily: "Inter_400Regular" }}>
                Nessun evento ancora.{"\n"}Crea il tuo primo evento!
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 24, gap: 14 }}>
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onPress={() => router.push(`/event/${ev.id}`)}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* ── Scopri (suggestions) ── */}
        {suggestions.length > 0 && (
          <Animated.View style={[anim2, { marginTop: 28 }]}>
            <Text style={[styles.sectionHeader, { color: colors.mutedForeground, paddingHorizontal: 24, marginBottom: 10 }]}>
              SCOPRI
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
              {suggestions.map((s) => (
                <SuggestedCard key={s.id} user={s} token={token!} />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  displayName: {
    fontSize: 24, fontWeight: "900", letterSpacing: -0.5,
    fontFamily: "Inter_700Bold", lineHeight: 28,
  },
  gearBtn: {
    width: 38, height: 38, borderRadius: 12,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  statPill: {
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1,
  },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 14, borderWidth: 1,
  },
  actionBtnText: { fontSize: 13, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sectionHeader: {
    fontSize: 11, fontWeight: "700", letterSpacing: 2,
    textTransform: "uppercase", fontFamily: "Inter_700Bold",
  },
  eventCard: {
    borderRadius: 18, borderWidth: 1, overflow: "hidden",
  },
  eventCardThumb: {
    height: 110, alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  planBadge: {
    position: "absolute", top: 10, right: 10,
    borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3,
  },
  eventCardBody: {
    padding: 12, flexDirection: "row", alignItems: "center",
  },
  eventCardName: {
    fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold", marginBottom: 2,
  },
  eventCardDate: {
    fontSize: 12, fontFamily: "Inter_400Regular",
  },
  eventCardCount: {
    fontSize: 20, fontWeight: "800", fontFamily: "Inter_700Bold", textAlign: "right",
  },
  eventCardCountLabel: {
    fontSize: 11, textAlign: "right", fontFamily: "Inter_400Regular",
  },
  suggestedCard: {
    width: 130, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 4,
  },
  suggestedAvatar: { width: 48, height: 48, borderRadius: 24, marginBottom: 4 },
  suggestedName: { fontSize: 13, fontWeight: "700", fontFamily: "Inter_700Bold", textAlign: "center" },
  suggestedUsername: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  suggestedFollowBtn: { marginTop: 6, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  modalInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 15, fontFamily: "Inter_400Regular" },
});
