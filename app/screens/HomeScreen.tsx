import React, { useState, useEffect, memo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { Assignment, CourseAssignment, Items } from "@/api/interfaces";
import { UTC_COURSE_CODE_LENGTH, getClassName } from "@/api/constants";
import { fetchCourses, fetchAssignments } from "@/api/canvasApis";
import DateTimePicker from "@react-native-community/datetimepicker";

const HomeScreen: React.FC = () => {
  const [items, setItems] = useState<Items>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [classNameInput, onChangeClassName] = React.useState("");
  const [assignmentNameInput, onChangeAssignmentName] = React.useState("");
  const [loading, setLoading] = useState(true);
  const courseColorMap = useRef<{ [key: string]: string }>({});
  const assignedColors = new Set<string>();
  const currentDate = new Date();
  const newItems: Items = {};

  const customTheme = {
    agendaDayTextColor: "#B0B0B0",
    agendaDayNumColor: "#B0B0B0",
    agendaTodayColor: "#B0B0B0",
    agendaKnobColor: "#B0B0B0",
  };

  const courses: { [key: string]: number } = {};
  let courseAssignments: CourseAssignment = {};

  const colorList = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#E67E22",
    "#E74C3C",
    "#8E44AD",
    "#3498DB",
    "#2ECC71",
    "#1ABC9C",
    "#9B59B6",
    "#34495E",
    "#16A085",
    "#27AE60",
    "#2980B9",
    "#8E44AD",
    "#F39C12",
    "#D35400",
    "#C0392B",
    "#7F8C8D",
  ];

  const getColorForCourseId = (courseId: string): string => {
    const hash = Array.from(courseId).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const index = hash % colorList.length;
    const color = colorList[index];

    if (assignedColors.has(color)) {
      for (let i = 0; i < colorList.length; i++) {
        const nextColor = colorList[(index + i) % colorList.length];
        if (!assignedColors.has(nextColor)) {
          assignedColors.add(nextColor);
          return nextColor;
        }
      }
    } else {
      assignedColors.add(color);
      return color;
    }
    return "white";
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || dueTime;
    setShowTimePicker(false);
    setDueTime(currentTime);
  };

  const addNewAssignment = (
    courseName: string,
    assignmentName: string,
    dueDate: Date
  ) => {
    if (!courseName || !assignmentName) {
      alert("Please complete all required fields.");
      return;
    }

    setModalVisible(false);
    const formattedDate = dueDate.toISOString().split("T")[0];
    const updatedItems = { ...items };

    if (!updatedItems[formattedDate]) {
      updatedItems[formattedDate] = [];
    }

    updatedItems[formattedDate].push({
      course_id: courseName,
      name: assignmentName,
      time: dueDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      due_at: dueDate.toString(),
    });

    setItems(updatedItems);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const coursesData = await fetchCourses();

        for (let i = 0; i < coursesData.length; i++) {
          const courseId = coursesData[i].course_id;
          const fullCourseName = coursesData[i].context_name;
          if (
            courseId &&
            fullCourseName &&
            courseId.toString().length == UTC_COURSE_CODE_LENGTH &&
            !Object.values(courses).includes(courseId)
          ) {
            const courseName = getClassName(coursesData[i].context_name);
            courses[courseName] = courseId;

            courseColorMap.current[courseName] =
              getColorForCourseId(courseName);
          }
        }

        const assignmentsData = await fetchAssignments(courses);

        for (let i = 0; i < assignmentsData.length; i++) {
          if (assignmentsData[i].assignments.length > 0) {
            for (let j = 0; j < assignmentsData[i].assignments.length; j++) {
              const courseName = assignmentsData[i].courseName;
              const assignment: Assignment = assignmentsData[i].assignments[j];

              if (!assignment.name) assignment.name = "Unnamed Assignment";
              if (!assignment.due_at) {
                assignment.due_at = currentDate.toISOString();
                assignment.name += " (No due date)";
              }

              const assignmentEntry = {
                name: assignment.name,
                dueDate: assignment.due_at,
              };

              if (!courseAssignments[courseName]) {
                courseAssignments[courseName] = [];
              }
              courseAssignments[courseName].push(assignmentEntry);
            }
          }
        }

        for (const courseName in courseAssignments) {
          const assignments = courseAssignments[courseName];

          assignments.forEach((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const formattedDate = dueDate.toISOString().split("T")[0];

            if (!newItems[formattedDate]) {
              newItems[formattedDate] = [];
            }

            newItems[formattedDate].push({
              course_id: courseName,
              name: assignment.name,
              time: dueDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              due_at: assignment.dueDate,
            });
          });
        }

        // console.log(courseAssignments);
        // console.log(newItems);

        setItems(newItems);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const RenderItem: React.FC<{ item: Assignment & { className: string } }> =
    memo(({ item }) => {
      const backgroundColor = courseColorMap.current[item.course_id] || "white";

      return (
        <View
          style={{
            marginVertical: 6,
            backgroundColor: backgroundColor,
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.course_id}</Text>
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>{item.time}</Text>
        </View>
      );
    });

  const RenderEmptyData: React.FC = () => (
    <View style={styles.emptyAgenda}>
      <Text>No assignments due today!</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Create an assignment</Text>
          <TextInput
            style={styles.input}
            placeholder="Course name"
            placeholderTextColor="grey"
            onChangeText={onChangeClassName}
            value={classNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Assignment name"
            placeholderTextColor="grey"
            onChangeText={onChangeAssignmentName}
            value={assignmentNameInput}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Due date"
              value={dueDate.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={dueTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              editable={false}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => closeModal()}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addAssignmentButton}
              onPress={() =>
                addNewAssignment(classNameInput, assignmentNameInput, dueTime)
              }
            >
              <Text style={styles.addAssignmentButtonText}>Add Assignment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        theme={customTheme}
        renderItem={(item: Assignment & { className: string }) => (
          <RenderItem item={item} />
        )}
        renderEmptyData={() => <RenderEmptyData />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addAssignmentButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  addAssignmentButtonText: {
    color: "white",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loadingContainer: {
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
  emptyAgenda: {
    marginVertical: 10,
    marginTop: 30,
    backgroundColor: "white",
    marginHorizontal: 10,
    padding: 10,
    alignItems: "center",
  },
});

export default HomeScreen;
