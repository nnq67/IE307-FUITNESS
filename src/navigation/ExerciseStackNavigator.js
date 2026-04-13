import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListExercises from '../screens/exercises/ListExercises';
import ExerciseDetailScreen from '../screens/exercises/ExerciseDetailScreen';

const Stack = createStackNavigator();

export default function ExerciseStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ListExercises"
      screenOptions={{
        headerShown: false, 
      }}
    >
      {/* Màn hình danh sách bài tập */}
      <Stack.Screen 
        name="ListExercises" 
        component={ListExercises} 
      />
      
      {/* Màn hình chi tiết bài tập */}
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen} 
      />
    </Stack.Navigator>
  );
}