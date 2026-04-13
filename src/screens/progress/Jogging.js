import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { useNavigation } from "@react-navigation/native";

export default function Jogging() {
  const navigation = useNavigation();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef(null);

  const toggleTracking = async () => {
    if (isTracking) {
      // --- 1. DỪNG TRACKING TRƯỚC ---
      setIsTracking(false);

      // --- 2. TÍNH TOÁN---
      const durationMs = startTime ? new Date() - startTime : 0;
      const durationMins = Math.round(durationMs / 60000);

      // Tính quãng đường thực tế
      const finalDistanceKm = distance / 1000;
      const userWeight = 65;

      // Tính Kcal (Dùng Math.max để đảm bảo không bị số âm hoặc NaN)
      const estimatedKcal =
        Math.round(finalDistanceKm * userWeight * 1.036) || 0.001;

      console.log("Kết quả tập luyện:", {
        finalDistanceKm,
        estimatedKcal,
        durationMins,
      });

      // --- 3. GỬI DỮ LIỆU ---
      navigation.navigate("Main", {
        screen: "Progress",
        params: {
          newJoggingActivity: {
            id: Math.random().toString(),
            name: `Run (${finalDistanceKm.toFixed(2)} km)`,
            kcal: estimatedKcal,
            time: `${durationMins} Mins`,
            type: "run",
            isCompleted: true,
            dateString: new Date().toISOString().split("T")[0],
          },
        },
      });

      // Dừng cập nhật vị trí ngầm
      try {
        await Location.stopLocationUpdatesAsync("LOCATION_TRACKING_TASK");
      } catch (e) {
        console.log("Task chưa chạy hoặc đã dừng");
      }
    } else {
      // --- PHẦN START ---
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Lỗi", "Bạn cần cho phép truy cập vị trí");
        return;
      }

      setIsTracking(true);
      setStartTime(new Date());
      setRouteCoordinates([]);
      setDistance(0);

      // Bắt đầu theo dõi
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newPoint = { latitude, longitude };

          setRouteCoordinates((prev) => {
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const d = getDistance(lastPoint, newPoint);
              setDistance((oldDist) => oldDist + d);
            }
            return [...prev, newPoint];
          });
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: 10.8231, // Tọa độ mặc định
          longitude: 106.6297,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={5}
          strokeColor="#093FB4"
        />
      </MapView>

      {/* Bảng thông số */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>
            {(distance / 1000).toFixed(2)} km
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isTracking ? styles.stopBtn : styles.startBtn]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>{isTracking ? "STOP" : "START"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  statsContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 5,
  },
  statLabel: { fontSize: 12, color: "#666", fontFamily: "Montserrat" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#093FB4" },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  startBtn: { backgroundColor: "#4F7AD6" },
  stopBtn: { backgroundColor: "#FF4D4D" },
  buttonText: { color: "white", fontWeight: "bold" },
});
