import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 500);
    });
  }, []);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#BDBDBD", "#2F2C59"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/logo_body.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.brandText, { color: textColor }]}>
          FUITNESS
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logoWrapper: {
    marginTop: height * 0.26,
    alignItems: "center",
  },
  logoIcon: {
    width: width * 0.6,
    height: width * 0.6,
  },
  brandText: {
    fontFamily: "AlfaSlabOne",
    fontSize: 40,
    marginTop: 10,
    letterSpacing: 2,
  },
});
