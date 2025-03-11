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
import { Assignment, Items } from "@/api/interfaces";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AgendaItem } from "./AgendaItem";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import { PrimaryColors } from "../constants/Colors";
import { loadAssignments, loadCourses } from "../services/app.service";
import { useFocusEffect } from "expo-router";
import { Layout, MenuItem, OverflowMenu } from "@ui-kitten/components";

const HomeScreen: React.FC<{
  currentCourses: { [key: string]: string };
  setCurrentCourses: (courses: { [key: string]: string }) => void;
  colorChanged: boolean;
  setColorChanged: (changed: boolean) => void;
}> = ({ currentCourses, setCurrentCourses, colorChanged, setColorChanged }) => {
  const [items, setItems] = useState<Items>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [classNameInput, onChangeClassName] = React.useState("");
  const [assignmentNameInput, onChangeAssignmentName] = React.useState("");
  const [loading, setLoading] = useState(true);
  const [courseColorMap, setCourseColorMap] = useState<{
    [key: string]: string;
  }>({});
  const [courses, setCourses] = useState<{
    [key: string]: string;
  }>({});
  const currentDate = new Date();
  const agendaRef = useRef<any>(null);
  const [selectedDay, setSelectedDay] = useState(
    currentDate.toISOString().split("T")[0]
  );
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const onItemSelect = (index: any): void => {
    setTimeout(() => {
      setSelectedIndex(index);
      setMenuVisible(false);

      switch (index.row) {
        case 0:
          const today = new Date().toISOString();
          setSelectedDay(today);
          agendaRef.current.current?.scrollToDay(today);
          break;
        case 1:
          setModalVisible(true);
          break;
        default:
          break;
      }
    }, 0);
  };

  const renderToggleButton = (): React.ReactElement => (
    <TouchableOpacity
      style={styles.moreButton}
      onPress={() => setMenuVisible(true)}
    >
      <FeatherIcon name="more-vertical" size={24} color="white" />
    </TouchableOpacity>
  );

  const customTheme = {
    agendaDayTextColor: "#B0B0B0",
    agendaDayNumColor: "#B0B0B0",
    agendaTodayColor: "#B0B0B0",
    agendaKnobColor: "#B0B0B0",
    selectedDayBackgroundColor: PrimaryColors.lightBlue.background,
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
    description: string,
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
      description: description,
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
        const { courses, courseColorMap: loadedCourseColorMap } =
          await loadCourses();
        const newItems = await loadAssignments(
          courses,
          currentDate.toISOString()
        );

        setItems(newItems);
        setCourseColorMap(loadedCourseColorMap);
        setCurrentCourses(loadedCourseColorMap);
        setCourses(courses);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (colorChanged) {
        setCourseColorMap(currentCourses);
        setCourses(courses);
        setItems({});
        const loadData = async () => {
          setLoading(true);
          try {
            const newItems = await loadAssignments(
              courses,
              currentDate.toISOString()
            );
            setItems(newItems);
          } catch (error: any) {
            console.error(error.message);
          } finally {
            setLoading(false);
          }
        };
        loadData();
        setColorChanged(false);
      } else {
        setCourseColorMap(currentCourses);
      }
    }, [currentCourses, colorChanged])
  );

  const RenderEmptyData: React.FC = () => (
    <View style={styles.emptyAgenda}>
      <Text>No assignments due today!</Text>
    </View>
  );

  const RenderAgendaItem: React.FC<{
    item: Assignment & { className: string; html_url?: string };
  }> = memo(({ item }) => {
    if (!item) {
      console.warn("Item is undefined");
      return null;
    }

    const backgroundColor = courseColorMap[item.course_id] || "white";
    return (
      <AgendaItem
        assignmentName={item.name}
        courseName={item.course_id}
        dueTime={item.time}
        description={item.description}
        html_url={item.html_url}
        backgroundColor={backgroundColor}
      />
    );
  });

  return (
    <View style={{ flex: 1, marginHorizontal: 10, position: "relative" }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}

      <Layout level="1">
        <OverflowMenu
          appearance="noDivider"
          anchor={renderToggleButton}
          visible={menuVisible}
          selectedIndex={selectedIndex!}
          onSelect={onItemSelect}
          placement={"top"}
          onBackdropPress={() => setMenuVisible(false)}
        >
          <MenuItem title="Today" />
          <MenuItem title="Add assignment" />
        </OverflowMenu>
      </Layout>

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
                addNewAssignment(
                  classNameInput,
                  assignmentNameInput,
                  "Assignment Description",
                  dueTime
                )
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
        ref={agendaRef}
        items={items}
        showOnlySelectedDayItems={true}
        theme={customTheme}
        current={selectedDay}
        key={selectedDay}
        renderItem={(item: Assignment & { className: string }) => (
          <RenderAgendaItem item={item} />
        )}
        renderEmptyData={() => <RenderEmptyData />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  moreButton: {
    position: "absolute",
    // bottom: 0,
    top: 745,
    right: 0,
    backgroundColor: PrimaryColors.lightBlue.background,
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 200,
    backgroundColor: PrimaryColors.lightBlue.background,
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
  todayButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: PrimaryColors.lightBlue.background,
    borderRadius: 25,
    padding: 10,
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
