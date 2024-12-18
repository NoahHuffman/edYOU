import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import ListsScreen from './screens/ListsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import MapScreen from './screens/MapScreen';

const homeName = "Home";
const searchName = "Search";
const listsName = "Lists";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === searchName) {
            iconName = focused ? 'search' : 'search-outline';
          } else if (rn === listsName) {
            iconName = focused ? 'list' : 'list-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 70 },
        headerShown: false,
      })}>
      
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={searchName} component={SearchScreen} />
      <Tab.Screen name={listsName} component={ListsScreen} />
      <Tab.Screen name={"Map"} component={MapScreen} />
      {/* <Tab.Screen name={settingsName} component={SettingsScreen} /> */}

    </Tab.Navigator>
  );
}

export default MainContainer;
