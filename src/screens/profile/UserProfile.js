import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";

const PRIMARY_BLUE = "#1A56DB";

export default function UserProfile() {
  const navigation = useNavigation();
  const { user, logout } = useContext(UserContext);
  if (!user) return null;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const renderMenuItem = (icon, label, onPress, color = PRIMARY_BLUE) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.menuText} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.header}>
          <Text
            style={styles.headerTitle}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            Profile
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName} adjustsFontSizeToFit numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.userEmail} adjustsFontSizeToFit numberOfLines={1}>
            {user.email}
          </Text>
          <Text
            style={styles.userBirthday}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            Birthday: {user.details?.dob || user.birthday}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {user.stats.weight ? `${user.stats.weight} Kg` : "--"}
            </Text>
            <Text
              style={styles.statLabel}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              Weight
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {user.stats.age}
            </Text>
            <Text
              style={styles.statLabel}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              Years Old
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {user.stats.height ? `${user.stats.height} CM` : "--"}
            </Text>
            <Text
              style={styles.statLabel}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              Height
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {renderMenuItem(
            <MaterialIcons name="lock" size={24} color="#fff" />,
            "Privacy Policy",
            () => navigation.navigate("PrivacyPolicy")
          )}
          {renderMenuItem(
            <Ionicons name="settings" size={24} color="#fff" />,
            "Settings",
            () => navigation.navigate("Settings")
          )}
          {renderMenuItem(
            <FontAwesome5 name="headset" size={20} color="#fff" />,
            "Help",
            () => navigation.navigate("Help")
          )}
          {renderMenuItem(
            <MaterialIcons name="logout" size={24} color="#fff" />,
            "Logout",
            handleLogout,
            "#ff0000ff"
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FAFF" },
  header: { paddingLeft: 20, paddingRight: 20, marginTop: 20 },
  headerTitle: {
    fontFamily: "AlfaSlabOne_400Regular",
    fontSize: 28,
    color: PRIMARY_BLUE,
  },

  userInfoContainer: {
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF4081",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  userName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  userEmail: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#888",
    marginTop: 2,
    textAlign: "center",
    width: "100%",
  },
  userBirthday: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#888",
    marginTop: 2,
    textAlign: "center",
    width: "100%",
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 18,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  statItem: { alignItems: "center", flex: 1 },
  statValue: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#000",
    width: "100%",
    textAlign: "center",
  },
  statLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    width: "100%",
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    alignSelf: "center",
  },

  menuContainer: { paddingHorizontal: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#000",
  },
});
