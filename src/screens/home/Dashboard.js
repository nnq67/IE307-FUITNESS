import { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { ActivityContext } from "../../context/ActivityContext";
import { UserContext } from "../../context/UserContext";

export default function Dashboard({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const { allActivities } = useContext(ActivityContext);

  if (!user) {
    return null;
  }

  const calculatedStats = useMemo(() => {
    const today = new Date();
    
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayStr = `${y}-${m}-${d}`;

    const filteredList = allActivities.filter(
      (item) => item.dateString === todayStr
    );

    const totalKcal = filteredList.reduce(
      (acc, cur) => (cur.isCompleted ? acc + (cur.kcal || 0) : acc),
      0
    );
    const totalMins = filteredList.reduce(
      (acc, cur) => (cur.isCompleted ? acc + (parseInt(cur.time) || 0) : acc),
      0
    );
    const completedCount = filteredList.filter((i) => i.isCompleted).length;

    return {
      cal: totalKcal.toLocaleString("vi-VN"),
      time:
        totalMins > 60
          ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
          : `${totalMins}m`,
      count: `${completedCount}/${filteredList.length}`,
    };
  }, [allActivities]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello, {user.name} 👋</Text>
            <Text style={styles.subWelcome}>What's your goal for today?</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bannerContainer}
          onPress={() => navigation.navigate("Exercises")}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
            }}
            style={styles.bannerImage}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTag}>NEW PROGRAM</Text>
              <Text style={styles.bannerTitle}>SUMMER SHRED</Text>
              <Text style={styles.bannerSub}>
                Burn fat 2x faster with our new HIIT series
              </Text>
              <View style={styles.exploreBtn}>
                <Text style={styles.exploreBtnText}>Explore Now</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFE5D9" }]}>
              <FontAwesome5 name="fire" size={16} color="#FF5722" />
            </View>
            <Text style={styles.statValue} adjustsFontSizeToFit>
              {calculatedStats.cal}
            </Text>
            <Text
              style={styles.statLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Kcal Burnt
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF4E5" }]}>
              <Ionicons name="time" size={18} color="#FF9800" />
            </View>
            <Text style={styles.statValue} adjustsFontSizeToFit>
              {calculatedStats.time}
            </Text>
            <Text
              style={styles.statLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Total Time
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}>
              <FontAwesome5 name="dumbbell" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.statValue} adjustsFontSizeToFit>
              {calculatedStats.count}
            </Text>
            <Text
              style={styles.statLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Exercises
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Discovery</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("Exercises")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#E0E7FF" }]}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={28}
                color="#4338CA"
              />
            </View>
            <Text style={styles.gridTitle}>Workouts</Text>
            <Text style={styles.gridSub}>50+ Drills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("Community")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FFEDD5" }]}>
              <MaterialCommunityIcons
                name="newspaper-variant-outline"
                size={28}
                color="#D97706"
              />
            </View>
            <Text style={styles.gridTitle}>Articles</Text>
            <Text style={styles.gridSub}>Healthy Tips</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  welcomeText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    color: "#111827",
  },
  subWelcome: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  bannerContainer: { width: "100%", height: 200, marginBottom: 0 },
  bannerImage: { flex: 1 },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 24,
    padding: 20,
    justifyContent: "center",
  },
  bannerTag: {
    color: "#FFBD2E",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontFamily: "AlfaSlabOne",
    marginTop: 5,
  },
  bannerSub: {
    color: "#E5E7EB",
    fontSize: 13,
    fontFamily: "Montserrat",
    marginTop: 5,
    marginBottom: 15,
    width: "70%",
  },
  exploreBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  exploreBtnText: {
    color: "#111827",
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
  },

  sectionTitle: {
    fontFamily: "AlfaSlabOne",
    fontSize: 20,
    color: "#1A56DB",
    marginTop: 20,
    marginBottom: 20,
  },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 3,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
    width: "100%",
  },
  statLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    color: "#888",
  },

  grid: { flexDirection: "row", justifyContent: "space-between" },
  gridCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  gridTitle: { fontFamily: "Montserrat-Bold", fontSize: 16, color: "#111827" },
  gridSub: {
    fontFamily: "Montserrat",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});