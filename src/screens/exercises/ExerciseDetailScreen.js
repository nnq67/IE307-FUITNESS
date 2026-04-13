import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const PRIMARY_BLUE = "#1A56DB";

const ExerciseDetailScreen = ({ exerciseId, onBack, onAddExercise }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExerciseDetail() {
      try {
        setLoading(true);
        const db = await SQLite.openDatabaseAsync("fitness_data.db");
        const result = await db.getFirstAsync('SELECT * FROM exercises WHERE id = ?', [exerciseId]);
        
        if (result) {
          const parseData = (data) => {
            if (!data) return [];
            try {
              const parsed = JSON.parse(data);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
              return data.split('\n').map(s => s.trim()).filter(s => s !== "");
            }
          };

          setDetail({
            ...result,
            instructions: parseData(result.howtodo_steps), 
            tips: parseData(result.tips),
            benefits: parseData(result.benefits),
            kcal: result.kcal || "150",
            time: result.time || "30 Mins"
          });
        }
      } catch (error) {
        console.error("Lỗi truy vấn chi tiết:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExerciseDetail();
  }, [exerciseId]);

  const handleFabAdd = () => {
    if (detail && onAddExercise) {
      const itemToAdd = {
        id: detail.id.toString(),
        name: detail.title,
        category: detail.type ? JSON.parse(detail.type)[0] : "Exercise",
        image: detail.image_thumbnail || detail.image,
        kcal: detail.kcal,
        time: detail.time
      };
      onAddExercise(itemToAdd);
    }
  };

  const BulletPoint = ({ text, isNumbered, index }) => (
    <View style={styles.bulletContainer}>
      <Text style={styles.bulletText}>
        <Text style={styles.bulletPrefix}>
          {isNumbered ? `${index + 1}. ` : "• "}
        </Text>
        {text}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{detail?.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>OVERVIEW</Text>
        <Text style={styles.description}>{detail?.overview || "No specific overview."}</Text>
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>DEMONSTRATION</Text>
        <View style={styles.imagePlaceholder}>
          <Image source={{ uri: detail?.image_thumbnail || detail?.image }} style={styles.exerciseImage} resizeMode="contain" />
        </View>
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>HOW TO DO</Text>
        {detail?.instructions.map((step, i) => (
          <BulletPoint key={i} text={step} isNumbered={true} index={i} />
        ))}
        <View style={styles.divider} />

        {detail?.tips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PRO TIPS</Text>
            {detail.tips.map((tip, i) => <BulletPoint key={i} text={tip} />)}
            <View style={styles.divider} />
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleFabAdd}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: {
    height: 100,
    backgroundColor: PRIMARY_BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontFamily: "AlfaSlabOne", flex: 1, marginLeft: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 10 },
  sectionTitle: { fontSize: 16, color: PRIMARY_BLUE, marginTop: 20, marginBottom: 10, fontFamily: "AlfaSlabOne" },
  description: { fontSize: 14, lineHeight: 22, color: "#444", textAlign: "justify", fontFamily: "MontserratSemiBold", fontStyle: "italic" },
  divider: { height: 1, backgroundColor: "#EEEEEE", marginTop: 20, marginBottom: 5 },
  bulletContainer: { flexDirection: "row", marginBottom: 10, paddingRight: 10 },
  bulletPrefix: { fontFamily: "MontserratBold", color: PRIMARY_BLUE },
  bulletText: { fontSize: 13, lineHeight: 20, fontFamily: "Montserrat", color: "#333", textAlign: "justify" },
  imagePlaceholder: { alignItems: "center", marginVertical: 15, backgroundColor: "#F0F5FF", borderRadius: 20, padding: 20 },
  exerciseImage: { width: '100%', height: 220 },
  
  // Nút lơ lửng FAB
  fab: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 100, // Nằm trên thanh tab thật của bạn một chút
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  }
});

export default ExerciseDetailScreen;