import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

export default function TermsAndConditions({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="caret-back" size={24} color="#FF5722" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.paragraph}>
            Your privacy is important to us. It is FUITNESS's policy to respect
            your privacy regarding any information we may collect from you
            across our website, and other sites we own and operate.
          </Text>

          <Text style={styles.paragraph}>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we’re
            collecting it and how it will be used.
          </Text>

          <Text style={styles.paragraph}>
            We only retain collected information for as long as necessary to
            provide you with your requested service. What data we store, we’ll
            protect within commercially acceptable means to prevent loss and
            theft, as well as unauthorized access, disclosure, copying, use or
            modification.
          </Text>

          <Text style={styles.paragraph}>
            We don’t share any personally identifying information publicly or
            with third-parties, except when required by law.
          </Text>

          <Text style={styles.paragraph}>
            Your continued use of our app will be regarded as acceptance of our
            practices around privacy and personal information. If you have any
            questions about how we handle user data and personal information,
            feel free to contact us.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1, paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "AlfaSlabOne",
    fontSize: 26,
    color: "#093FB4",
    marginLeft: 5,
  },
  scrollContent: { paddingTop: 10 },
  paragraph: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    marginBottom: 25,
    textAlign: "justify",
  },
});
