import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SettingsScreenProps = {
  route: RouteProp<
    { params: { courses?: { [key: string]: number } } },
    "params"
  >;
  navigation: StackNavigationProp<any>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const courses = route.params?.courses;

  useEffect(() => {
    if (courses) {
      setLoading(false);
    }
  }, [courses]);

  if (loading) {
    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        )}
      </View>
    );
  }

  if (!courses || Object.keys(courses).length === 0) {
    return (
      <View style={styles.container}>
        <Text>No course data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      {Object.entries(courses).map(([courseName, courseId]) => (
        <Text key={courseId}>
          {courseName}: {courseId}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fae3d9",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    zIndex: 2,
  },
});

export default SettingsScreen;
