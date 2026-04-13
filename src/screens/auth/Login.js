import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(UserContext);

  const handleLogin = () => {
    const success = login(email, password);
    if (!success) {
      Alert.alert("Login Failed", "Incorrect email or password.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.brandTitle}>FUITNESS</Text>

        <View style={styles.card}>
          <Text style={styles.loginTitle}>Log in</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <View style={styles.helperRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={20}
                color="#093FB4"
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6F7FF",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
  brandTitle: {
    fontSize: 42,
    color: "#2F2C59",
    marginBottom: 18,
    fontFamily: "AlfaSlabOne",
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loginTitle: {
    fontSize: 32,
    color: "#093FB4",
    marginBottom: 5,
    fontFamily: "AlfaSlabOne",
  },
  registerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
    alignItems: "center",
  },
  noAccountText: {
    fontSize: 13,
    fontFamily: "Montserrat",
  },
  linkText: {
    fontSize: 13,
    color: "#0047AB",
    fontFamily: "Montserrat-Bold",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Montserrat-SemiBold",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: "Montserrat",
    backgroundColor: "#FAFAFA",
  },
  loginButton: {
    backgroundColor: "#4F7AD6",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Montserrat",
    letterSpacing: 0.5,
  },
  helperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 0,
  },
  rememberMeContainer: { flexDirection: "row", alignItems: "center" },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#333",
    fontFamily: "Montserrat",
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#093FB4",
    fontFamily: "Montserrat-SemiBold",
  },
});
