import React, { useState, useEffect } from "react";
import {
  View, FlatList, StyleSheet, Text, Image, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import PostCard from "../components/PostCard";
import { insertBlog, fetchBlogs } from "../../../util/database"; 

const MyPageTab = () => {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const data = fetchBlogs();
    setPosts(data);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (inputText.trim() === "" && !selectedImage) return;
    insertBlog("PongTon", inputText, selectedImage);
    loadPosts();
    setInputText("");
    setSelectedImage(null);
    setModalVisible(false);
  };

  const renderHeader = () => (
    <View style={styles.headerPostSection}>
      <TouchableOpacity style={styles.inputSection} onPress={() => setModalVisible(true)}>
        <Image source={{ uri: "https://i.pravatar.cc/300?img=11" }} style={styles.avatarPlaceholder} />
        <View style={styles.fakeInput}>
          <Text style={styles.inputText}>What's on your mind?</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {setModalVisible(false); setSelectedImage(null);}}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>CREATE POST</Text>
            <TouchableOpacity onPress={handlePost} style={styles.postBtn}>
              <Text style={styles.postBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView style={styles.modalBody}>
              <View style={styles.userRow}>
                <Image source={{ uri: "https://i.pravatar.cc/300?img=11" }} style={styles.avatarSmall} />
                <View>
                  <Text style={styles.nameBold}>PongTon</Text>
                </View>
              </View>

              <TextInput
                placeholder="What's on your mind?"
                style={styles.input}
                multiline
                autoFocus
                value={inputText}
                onChangeText={setInputText}
              />

              {!selectedImage ? (
                <TouchableOpacity style={styles.addPhotoBox} onPress={pickImage}>
                  <Ionicons name="images" size={32} color="#45BD62" />
                  <Text style={styles.addPhotoText}>Add your image now!</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.previewContainer}>
                   <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                   <TouchableOpacity style={styles.removeImageBtn} onPress={() => setSelectedImage(null)}>
                     <Ionicons name="close-circle" size={28} color="white" />
                   </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  headerPostSection: { backgroundColor: "#fff", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  inputSection: { flexDirection: "row", paddingHorizontal: 15, alignItems: "center" },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20 },
  fakeInput: { flex: 1, backgroundColor: "#F3F4F6", marginLeft: 10, padding: 10, borderRadius: 25 },
  inputText: { color: "#666", fontFamily: "Montserrat" },
  
  modalWrapper: { flex: 1, backgroundColor: "#fff" },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 15, 
    height: 56, 
    borderBottomWidth: 0.5, 
    borderBottomColor: "#ddd" 
  },
  modalTitle: { 
    fontSize: 16, 
    fontFamily: "AlfaSlabOne", 
    color: "#1A4DAB",
    textTransform: 'uppercase' 
  },
  cancelText: { fontFamily: "Montserrat", fontSize: 16, color: "#666" },
  postBtn: { backgroundColor: "#1A4DAB", paddingHorizontal: 15, paddingVertical: 7, borderRadius: 6 },
  postBtnText: { color: "#fff", fontFamily: "MontserratBold", fontSize: 14 },
  
  modalBody: { padding: 15, flex: 1 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatarSmall: { width: 45, height: 45, borderRadius: 22.5, marginRight: 10 },
  nameBold: { fontFamily: "MontserratBold", fontSize: 16 },
  
  input: { 
    fontSize: 18, 
    fontFamily: "Montserrat",
    minHeight: 100, 
    textAlignVertical: 'top',
    color: '#1c1e21'
  },

  addPhotoBox: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#E4E6EB',
    borderRadius: 10,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderStyle: 'dashed'
  },
  addPhotoText: { fontFamily: 'MontserratSemiBold', color: '#65676B', marginTop: 10 },

  previewContainer: { position: 'relative', marginTop: 15 },
  previewImage: { width: '100%', height: 250, borderRadius: 10 },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
});

export default MyPageTab;