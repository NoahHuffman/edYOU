import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SettingsScreenProps = {
  route: RouteProp<
    { params: { courses?: { [key: string]: { id: number; color: string } } } },
    "params"
  >;
  navigation: StackNavigationProp<any>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: number; color: string } | null>(null);
  const [newColor, setNewColor] = useState("");
  const courses = route.params?.courses;

  useEffect(() => {
    if (courses) {
      setLoading(false);
    }
  }, [courses]);

  const handleEditCourse = (course: { id: number; color: string }) => {
    setSelectedCourse(course);
    setNewColor(course.color);
    setModalVisible(true);
  };

  const handleSaveColor = () => {
    if (selectedCourse) {
      courses![selectedCourse.id].color = newColor;
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
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
      <Text style={styles.title}>Courses:</Text>
      {Object.entries(courses).map(([courseName, { id, color }]) => (
        <TouchableOpacity key={id} style={[styles.courseBox, { backgroundColor: color }]} onPress={() => handleEditCourse({ id, color })}>
          <Text style={styles.courseText}>{courseName}</Text>
        </TouchableOpacity>
      ))}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Course Color</Text>
            <TextInput
              style={styles.input}
              value={newColor}
              onChangeText={setNewColor}
              placeholder="Enter new color"
            />
            <Button title="Save" onPress={handleSaveColor} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  courseBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  courseText: {
    fontSize: 18,
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;
