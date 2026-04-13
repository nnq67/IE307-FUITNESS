import React, { useState } from "react";
import { View, StyleSheet, Text, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import ForYouTab from "./tabs/ForYouTab";
import FollowingTab from "./tabs/FollowingTab";
import MyPageTab from "./tabs/MyPageTab";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Community = () => {
  const insets = useSafeAreaInsets();

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "foryou", title: "For you" },
    { key: "following", title: "Following" },
    { key: "mypage", title: "My page" },
  ]);

  const renderScene = SceneMap({
    foryou: ForYouTab,
    following: FollowingTab,
    mypage: MyPageTab,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        marginTop: -10,
        marginBottom: 10,
      }}
      indicatorStyle={{
        backgroundColor: "black",
        height: 2,
        width: 40,
        marginLeft: (layout.width / 3 - 40) / 2,
      }}
      activeColor={"black"}
      inactiveColor={"#D1D1D1"}
      renderLabel={({ route, focused }) => (
        <Text
          style={{
            fontSize: 22,
            fontFamily: focused ? "Montserrat-Bold" : "Montserrat",
            color: focused ? "#000000" : "#C4C4C4",
            margin: 8,
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.headerLogo}>Blog</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerLogo: {
    fontSize: 28,
    fontFamily: "AlfaSlabOne",
    color: "#1A56DB",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 20,
  },
});

export default Community;
