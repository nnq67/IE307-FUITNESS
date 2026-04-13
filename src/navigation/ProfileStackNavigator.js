import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import UserProfile from '../screens/profile/UserProfile';
import PrivacyPolicy from '../screens/profile/PrivacyPolicy';
import Settings from '../screens/profile/Settings';
import ProfileSetting from '../screens/profile/ProfileSetting';
import Help from '../screens/profile/Help';

const Stack = createStackNavigator();

export default function ProfileStackNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'AlfaSlabOne_400Regular',
          color: '#1A56DB',
          fontSize: 22,
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#1A56DB',
        
        headerTitleAlign: 'left', 
        
        headerBackTitleVisible: false,

        headerLeft: ({ onPress }) => (
          <TouchableOpacity onPress={onPress}>
            <Ionicons name="caret-back" size={24} color="#FF5722" />
          </TouchableOpacity>
        ),

        headerLeftContainerStyle: { 
          paddingLeft: 20,
        },
        headerTitleContainerStyle: {
          marginLeft: -10,
        }
      }}
    >
      {/* Main Profile Screen */}
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{ headerShown: false }} 
      />
      
      {/* Sub Screens */}
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={{ title: 'Profile Setting' }} />
      <Stack.Screen name="Help" component={Help} options={{ title: 'Help' }} />
    </Stack.Navigator>
  );
}