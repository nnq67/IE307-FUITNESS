import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { UserProvider } from "./src/context/UserContext";
import SplashScreen from "./src/screens/SplashScreen";
import { ActivityProvider } from "./src/context/ActivityContext";
import { init } from "./src/util/database";

import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING_TASK = "LOCATION_TRACKING_TASK";

TaskManager.defineTask(LOCATION_TRACKING_TASK, ({ data, error }) => {
  if (error) return;
  if (data) {
    const { locations } = data;
    console.log("Background location:", locations);
  }
});

// Import Font
import {
  useFonts,
  AlfaSlabOne_400Regular,
} from "@expo-google-fonts/alfa-slab-one";
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

export default function App() {
  // 2. KHỞI TẠO DATABASE KHI APP CHẠY
  useEffect(() => {
    init();
  }, []);

  // Quản lý danh sách bài tập đang theo dõi
  const [trackedExercises, setTrackedExercises] = useState([]);

  // Hàm thêm bài tập mới vào danh sách theo dõi
  const handleAddExercise = (newExercise) => {
    setTrackedExercises((prevList) => [newExercise, ...prevList]);
  };

  // Load font
  const [fontsLoaded] = useFonts({
    AlfaSlabOne: AlfaSlabOne_400Regular,
    Montserrat: Montserrat_400Regular,
    "Montserrat-SemiBold": Montserrat_600SemiBold,
    "Montserrat-Bold": Montserrat_700Bold,
  });

  const [isSplashDone, setIsSplashDone] = useState(false);

  // Loading Screen khi font chưa xong
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E6F7FF",
        }}
      >
        <ActivityIndicator size="large" color="#537FE7" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ActivityProvider>
          <NavigationContainer>
            {isSplashDone ? (
              <RootNavigator
                trackedExercises={trackedExercises}
                onAddExercise={handleAddExercise}
              />
            ) : (
              <SplashScreen onFinish={() => setIsSplashDone(true)} />
            )}
          </NavigationContainer>
        </ActivityProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
