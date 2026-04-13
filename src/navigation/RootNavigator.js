import { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";

// Import Screens
import Login from "../screens/auth/Login";
import CreateAccount from "../screens/auth/CreateAccount";
import TabNavigator from "./TabNavigator";
import TermsAndConditions from "../screens/auth/TermsAndConditions";
import Jogging from "../screens/progress/Jogging";

const Stack = createStackNavigator();

export default function RootNavigator({ trackedExercises, onAddExercise }) {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Nếu đã đăng nhập -> Vào Main (TabNavigator)
        <>
          <Stack.Screen name="Main">
            {(props) => (
              <TabNavigator 
                {...props} 
                trackedExercises={trackedExercises} 
                onAddExercise={onAddExercise} 
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Jogging"
            component={Jogging}
            options={{
              headerShown: true,
              title: "Jogging Tracking",
              headerStyle: {
                backgroundColor: "#1A56DB",
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: "#FFF",
              headerTitleStyle: {
                fontFamily: "AlfaSlabOne",
                fontSize: 18,
                letterSpacing: 1,
              },
            }}
          />
        </>
      ) : (
        // Nếu chưa đăng nhập -> Cụm màn hình Auth
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={CreateAccount} />
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
          />
        </>
      )}
    </Stack.Navigator>
  );
}