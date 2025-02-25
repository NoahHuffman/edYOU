import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import Login from './components/Login';
import { useState } from 'react';

const homeName = "Home";
const loginName = "Login";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function MainContainer() {
  const [currentCourses, setCurrentCourses] = useState<{ [key: string]: string }>({});

  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === loginName) {
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
      
      <Tab.Screen 
        name={homeName} 
        children={() => <HomeScreen currentCourses={currentCourses} setCurrentCourses={setCurrentCourses} />} 
        options={{ tabBarLabel: '' }} 
      />
      <Tab.Screen 
        name={loginName} 
        component={Login} 
        options={{ tabBarLabel: '' }} 
      />
      <Tab.Screen 
        name={settingsName} 
        children={() => <SettingsScreen currentCourses={currentCourses} setCurrentCourses={setCurrentCourses} />} 
        options={{ tabBarLabel: '' }} 
      />

    </Tab.Navigator>
  );
}

export default MainContainer;
