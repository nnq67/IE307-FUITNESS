import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system/legacy"; 
import { Asset } from "expo-asset";
import { useFonts, AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import { 
  Montserrat_400Regular, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseDetailScreen from "./ExerciseDetailScreen"; 
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_BLUE = "#1A56DB";

const getCategoryIcon = (name) => {
  if (name.toLowerCase() === "all") return "apps";
  return "arm-flex"; 
};

export default function ListExercises({ onAddExercise }) {
  const [viewMode, setViewMode] = useState("list");
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All', icon: 'apps' }]);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    AlfaSlabOne: AlfaSlabOne_400Regular,
    Montserrat: Montserrat_400Regular,
    MontserratSemiBold: Montserrat_600SemiBold,
    MontserratBold: Montserrat_700Bold,
  });

  useEffect(() => {
    async function setup() {
      try {
        const dbName = "fitness_data.db";
        const dbDir = `${FileSystem.documentDirectory}SQLite`;
        const dbPath = `${dbDir}/${dbName}`;

        const dirInfo = await FileSystem.getInfoAsync(dbDir);
        if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });

        const dbFileInfo = await FileSystem.getInfoAsync(dbPath);
        if (!dbFileInfo.exists || dbFileInfo.size === 0) {
          const asset = await Asset.fromModule(require("../../../assets/fitness_data.db")).downloadAsync();
          await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
        }

        const db = await SQLite.openDatabaseAsync(dbName);
        await fetchData(db);
      } catch (error) {
        console.error("DB Setup Error:", error);
        setLoading(false);
      }
    }
    setup();
  }, []);

  const fetchData = async (db) => {
    try {
      const allRows = await db.getAllAsync('SELECT * FROM exercises');
      const formatted = allRows.map(row => {
        let cat = "Other";
        try { cat = row.type ? JSON.parse(row.type)[0] : "Other"; } catch (e) { cat = row.type || "Other"; }
        return {
          id: row.id.toString(),
          name: row.title,
          category: cat,
          image: row.image_thumbnail,
          kcal: row.kcal || "150",
          time: row.time || "30 Mins",
        };
      });
      setExercises(formatted);
      const uniqueCats = [...new Set(formatted.map(ex => ex.category))].sort();
      const dynamicCategories = uniqueCats.map((cat, index) => ({
        id: index.toString(),
        name: cat.charAt(0).toUpperCase() + cat.slice(1), 
        icon: getCategoryIcon(cat)
      }));
      setCategories([{ id: 'all', name: 'All', icon: 'apps' }, ...dynamicCategories]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLocal = async (item) => {
    try {
      const existingData = await AsyncStorage.getItem('progress_tracking');
      let progressList = existingData ? JSON.parse(existingData) : [];
      const newItem = { ...item, addedAt: new Date().toISOString() };
      progressList.push(newItem);
      await AsyncStorage.setItem('progress_tracking', JSON.stringify(progressList));
      Alert.alert("Success", `Added "${item.name}" to your list!`);
      onAddExercise?.(item);
    } catch (error) {
      Alert.alert("Error", "Failed to save exercise locally.");
    }
  };

  // Logic lọc kết hợp Category và Search
  const filteredData = exercises.filter((ex) => {
    const matchesCategory = selectedCategory === "All" || ex.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (viewMode === "detail" && selectedExerciseId) {
    const currentExercise = exercises.find(ex => ex.id === selectedExerciseId);
    return (
      <ExerciseDetailScreen 
        exerciseId={selectedExerciseId} 
        exerciseData={currentExercise}
        onBack={() => { setViewMode("list"); setSelectedExerciseId(null); }} 
        onAddExercise={handleAddToLocal}
      />
    );
  }

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ flex: 1 }} />;
  }

  const renderExerciseItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.contentLeft}>
        <Text style={styles.exerciseName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{item.category}</Text></View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
            <Text style={styles.statText}>{item.time}</Text>
          </View>
          <View style={[styles.statItem, { marginLeft: 12 }]}>
            <MaterialCommunityIcons name="fire" size={14} color="#EF4444" />
            <Text style={styles.statText}>{item.kcal} kcal</Text>
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.btnViewDetail} onPress={() => { setSelectedExerciseId(item.id); setViewMode("detail"); }}>
            <Text style={styles.btnViewDetailText}>VIEW DETAIL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAddOutline} onPress={() => handleAddToLocal(item)}>
            <Text style={styles.btnAddOutlineText}>ADD +</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentRight}><Image source={{ uri: item.image }} style={styles.exerciseImage} /></View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List of exercises</Text>
      </View>

      {/* SEARCH BAR SECTION */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.name)} style={styles.categoryItem}>
              <View style={[styles.iconBox, selectedCategory === cat.name && styles.activeIconBox]}>
                <MaterialCommunityIcons name={cat.icon} size={24} color={selectedCategory === cat.name ? "#FFF" : "#4B5563"} />
              </View>
              <Text style={[styles.categoryLabel, selectedCategory === cat.name && styles.activeCategoryLabel]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="magnify-close" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5, backgroundColor: "#FFF" },
  headerTitle: { fontSize: 28, color: "#2D5BD0", fontFamily: 'AlfaSlabOne' },
  
  searchSection: { backgroundColor: "#FFF", paddingHorizontal: 20, paddingVertical: 10 },
  searchBar: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#F3F4F6", 
    borderRadius: 15, 
    paddingHorizontal: 12, 
    height: 48 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#1F2937", fontFamily: 'Montserrat' },
  
  categoryContainer: { backgroundColor: "#FFF", paddingBottom: 15 },
  categoryScroll: { paddingLeft: 20 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  iconBox: { width: 50, height: 50, backgroundColor: "#F3F4F6", borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  activeIconBox: { backgroundColor: "#2D5BD0" },
  categoryLabel: { fontSize: 11, color: "#4B5563", fontFamily: 'MontserratBold' },
  activeCategoryLabel: { color: "#2D5BD0" },
  
  listPadding: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: "#E6F7FF", borderRadius: 20, padding: 16, flexDirection: "row", marginBottom: 16, elevation: 1 },
  contentLeft: { flex: 1.4 },
  exerciseName: { fontSize: 17, color: "#1F2937", fontFamily: 'MontserratBold', marginBottom: 6 },
  categoryBadge: { backgroundColor: "#FFF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  categoryBadgeText: { color: "#2D5BD0", fontSize: 10, fontFamily: 'MontserratBold', textTransform: 'uppercase' },
  statsRow: { flexDirection: "row", marginBottom: 15 },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { fontSize: 12, color: "#6B7280", marginLeft: 4, fontFamily: 'MontserratSemiBold' },
  buttonGroup: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  btnViewDetail: { backgroundColor: "#6488E5", paddingVertical: 8, paddingHorizontal: 18, borderRadius: 25, marginRight: 10 },
  btnViewDetailText: { color: "#FFF", fontSize: 11, fontFamily: 'MontserratBold' },
  btnAddOutline: { backgroundColor: "#FFF", borderWidth: 1.5, borderColor: "#4F7AD6", paddingVertical: 7, paddingHorizontal: 18, borderRadius: 25 },
  btnAddOutlineText: { color: "#4F7AD6", fontSize: 11, fontFamily: 'MontserratBold' },
  contentRight: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
  exerciseImage: { width: 100, height: 100, borderRadius: 12 },
  
  emptyBox: { alignItems: "center", marginTop: 60 },
  emptyText: { marginTop: 10, color: "#9CA3AF", fontFamily: 'MontserratSemiBold', fontSize: 16 }
});