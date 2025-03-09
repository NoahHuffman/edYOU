import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { useState } from "react";
import { StatusBar } from "react-native";

const homeName = "Home";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function MainContainer() {
  const [currentCourses, setCurrentCourses] = useState<{
    [key: string]: string;
  }>({});
  const [colorChanged, setColorChanged] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else {
              iconName = focused ? "settings" : "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 70 },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name={homeName}
          children={() => (
            <HomeScreen
              currentCourses={currentCourses}
              setCurrentCourses={setCurrentCourses}
              colorChanged={colorChanged}
              setColorChanged={setColorChanged}
            />
          )}
          options={{ tabBarLabel: "" }}
        />
        <Tab.Screen
          name={settingsName}
          children={() => (
            <SettingsScreen
              currentCourses={currentCourses}
              setCurrentCourses={setCurrentCourses}
              setColorChanged={setColorChanged}
            />
          )}
          options={{ tabBarLabel: "" }}
        />
      </Tab.Navigator>
    </>
  );
}

export default MainContainer;
