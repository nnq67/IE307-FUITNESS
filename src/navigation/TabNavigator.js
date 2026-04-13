import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- CÁC MÀN HÌNH CHÍNH ---
import ExercisesScreen from "../screens/exercises/ListExercises";
import ProgressScreen from "../screens/progress/ProgressTracking";
import CommunityScreen from "../screens/blog/Community";
import ProfileStackNavigator from "./ProfileStackNavigator";
import Dashboard from "../screens/home/Dashboard";

const Tab = createBottomTabNavigator();

// NHẬN PROPS TỪ ROOTNAVIGATOR
export default function TabNavigator({ trackedExercises, onAddExercise }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Exercises") iconName = "fitness";
          else if (route.name === "Progress") iconName = "stats-chart";
          else if (route.name === "Community") iconName = "people";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          position: "absolute",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          backgroundColor: "#FFF",
          elevation: 5,
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#1A56DB",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{ title: "Home", headerShown: false }}
      />

      <Tab.Screen
        name="Exercises"
        options={{ title: "Exercises", headerShown: false }}
      >
        {(props) => (
          <ExercisesScreen 
            {...props} 
            onAddExercise={onAddExercise} 
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Progress"
        options={{ title: "Progress", headerShown: false }}
      >
        {(props) => (
          <ProgressScreen 
            {...props} 
            key={trackedExercises.length > 0 ? 'active' : 'empty'}
            trackedExercises={trackedExercises} 
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: "Blog", headerShown: false }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
