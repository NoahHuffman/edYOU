import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import ColorWheel from "react-native-wheel-color-picker";
import Icon from "react-native-vector-icons/AntDesign";
import { loadCourses } from "../services/app.service";

const SettingsScreen: React.FC<{ currentCourses: { [key: string]: string }, setCurrentCourses: (courses: { [key: string]: string }) => void }> = ({ currentCourses, setCurrentCourses }) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [newColor, setNewColor] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const { courseColorMap: courseColorMap } = await loadCourses();
      const filteredCourseColorMap = Object.fromEntries(
        Object.entries(courseColorMap).filter(([key, value]) => key && value)
      );
      setCurrentCourses(filteredCourseColorMap);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleEditCourse = (courseName: { course: string }) => {
    setSelectedCourse(courseName.course);
    setNewColor(currentCourses[courseName.course]);
    setModalVisible(true);
  };

  const handleSaveColor = () => {
    if (selectedCourse) {
      const updatedCourses = {
        ...currentCourses,
        [selectedCourse]: newColor,
      };
      setCurrentCourses(updatedCourses);
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

  if (!currentCourses || Object.keys(currentCourses).length === 0) {
    return (
      <View style={styles.container}>
        <Text>No course data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courses:</Text>
      {Object.entries(currentCourses).map(([course, color]) => (
        <TouchableOpacity
          key={course}
          style={[styles.courseBox, { backgroundColor: color }]}
          onPress={() => handleEditCourse({ course })}
        >
          <Text style={styles.courseText}>{course}</Text>
          <Icon name="edit" size={24} color="black" style={styles.editIcon} />
        </TouchableOpacity>
      ))}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Course Color</Text>
            <View style={styles.colorWheelContainer}>
              <ColorWheel
                color={newColor}
                onColorChange={setNewColor}
                swatches={false}
                sliderHidden={true}
                thumbSize={30}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
              <Button title="Save" onPress={handleSaveColor} />
            </View>
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
    backgroundColor: "lightgrey",
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
  colorWheelContainer: {
    width: 250,
    height: 250,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  editIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});

export default SettingsScreen;
