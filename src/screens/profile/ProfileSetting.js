import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileSetting() {
  const { user, updateUser } = useContext(UserContext);
  const navigation = useNavigation();

  const [avatar, setAvatar] = useState(
    user.avatar || "https://via.placeholder.com/150"
  );
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.details.phone);
  const [dob, setDob] = useState(user.details.dob);
  const [weight, setWeight] = useState(
    user.stats.weight ? String(user.stats.weight).replace(/[^0-9.]/g, "") : ""
  );
  const [height, setHeight] = useState(
    user.stats.height ? String(user.stats.height).replace(/[^0-9.]/g, "") : ""
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    updateUser({
      avatar,
      name,
      email,
      stats: {
        weight: weight,
        height: height,
        age: user.stats.age,
      },
      details: { phone, dob },
    });

    Alert.alert("Success", "Profile updated successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const handleNumberInput = (text, setter) => {
    const numericValue = text.replace(/[^0-9.]/g, "");
    setter(numericValue);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.cameraIconBadge}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </View>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of birth</Text>
      <TextInput style={styles.input} value={dob} onChangeText={setDob} />

      {/* WEIGHT INPUT GROUP */}
      <Text style={styles.label}>Weight</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          value={weight}
          onChangeText={(text) => handleNumberInput(text, setWeight)}
          keyboardType="numeric"
          placeholder="e.g. 70"
        />
        <Text style={styles.unitText}>Kg</Text>
      </View>

      {/* HEIGHT INPUT GROUP */}
      <Text style={styles.label}>Height</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          value={height}
          onChangeText={(text) => handleNumberInput(text, setHeight)}
          keyboardType="numeric"
          placeholder="e.g. 180"
        />
        <Text style={styles.unitText}>CM</Text>
      </View>

      <TouchableOpacity style={styles.btnUpdate} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  avatarSection: { alignItems: "center", marginBottom: 25 },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1A56DB",
  },
  cameraIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1A56DB",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changePhotoText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#1A56DB",
    marginTop: 10,
    fontSize: 14,
  },

  label: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1A56DB",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#333",
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A56DB",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#333",
  },
  unitText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#1A56DB",
    marginLeft: 10,
  },

  btnUpdate: {
    backgroundColor: "#Eaf4ff",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { fontFamily: "Montserrat_700Bold", color: "#1A56DB", fontSize: 16 },
});
