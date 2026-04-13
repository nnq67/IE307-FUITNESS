import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default function CreateAccount({ navigation }) {
  const [agree, setAgree] = useState(false);

  // Function to handle the press
  const handleSignUp = () => {
    if (agree) {
      alert("Sign up successfully!");
      navigation.navigate("Login");
    }
  };
  // Trạng thái ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dobLabel, setDobLabel] = useState("dd/mm/yyyy");
  const [actualDate, setActualDate] = useState(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    // Format date to string: DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    setDobLabel(`${day}/${month}/${year}`);
    setActualDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brandTitle}>FUITNESS</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Create an account</Text>

            <View style={styles.row}>
              <Text style={styles.subText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Log in</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#ccc"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
            />

            {/* Password Field */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.flexInput}
                placeholder="Password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.flexInput}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <View style={{ width: "48%" }}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile"
                  keyboardType="phone-pad"
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                  <Text
                    style={{
                      fontFamily: "Montserrat",
                      color: dobLabel === "dd/mm/yyyy" ? "#ccc" : "#333",
                      marginTop: 12,
                    }}
                  >
                    {dobLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={{ width: "48%" }}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Kg"
                  keyboardType="numeric"
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text style={styles.label}>Height</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cm"
                  keyboardType="numeric"
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, !agree && styles.btnDisabled]}
              onPress={handleSignUp}
              disabled={!agree}
            >
              <Text style={styles.btnText}>Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgree(!agree)}
            >
              <Ionicons
                name={agree ? "checkbox" : "square-outline"}
                size={22}
                color="#093FB4"
              />
              <Text style={styles.agreeText}>
                {" "}
                I agree to the{" "}
                <Text
                  style={styles.linkTextUnderline}
                  onPress={() => navigation.navigate("TermsAndConditions")}
                >
                  Term & Condition
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E6F7FF" },
  scrollContainer: { padding: 20, alignItems: "center" },
  brandTitle: {
    fontFamily: "AlfaSlabOne",
    fontSize: 42,
    marginBottom: 18,
    color: "#2F2C59",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontFamily: "AlfaSlabOne",
    fontSize: 28,
    color: "#093FB4",
    marginBottom: 5,
  },
  row: { flexDirection: "row", marginBottom: 15 },
  subText: { fontFamily: "Montserrat", fontSize: 13, color: "#333" },
  linkText: {
    fontFamily: "Montserrat-Bold",
    color: "#093FB4",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  label: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    color: "#333",
  },
  btnDisabled: {
    backgroundColor: "grey",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: "Montserrat",
    backgroundColor: "#FFF",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },
  flexInput: { flex: 1, fontFamily: "Montserrat" },
  gridRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    backgroundColor: "#4F7AD6",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  btnText: { color: "#FFF", fontFamily: "Montserrat", fontSize: 16 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-start",
  },
  agreeText: {
    fontFamily: "Montserrat",
    fontSize: 12,
    marginLeft: 8,
    color: "#333",
  },
  linkTextUnderline: {
    color: "#093FB4",
    textDecorationLine: "underline",
    fontFamily: "Montserrat-Bold",
  },
});
