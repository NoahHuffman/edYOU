import React, { useState } from "react";
import { View, StyleSheet, Alert, TextInput, Button, Modal } from "react-native";
import { CalendarList } from "react-native-calendars";

type Events = {
  [date: string]: string[];
};

const HomeScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState<Events>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const todaysDate = new Date().toISOString().split('T')[0];

  const onDayPress = (day: { dateString: string }) => {
    const date = day.dateString;

    if (events[date]) {
      Alert.alert("Events", events[date].join(", "));
    } else {
      setSelectedDate(date);
      setModalVisible(true);
    }
  };

  const addEvent = () => {
    if (eventName.trim()) {
      const newEvents = { ...events };
      if (!newEvents[selectedDate]) {
        newEvents[selectedDate] = [];
      }
      newEvents[selectedDate].push(eventName);
      setEvents(newEvents);

      setMarkedDates({
        ...markedDates,
        [selectedDate]: {
          marked: true,
        },
      });

      setEventName("");
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Event name cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <CalendarList
        style={styles.calendar}
        current={todaysDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        horizontal={false}
        pagingEnabled={false}
        pastScrollRange={12}
        futureScrollRange={12}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            value={eventName}
            onChangeText={setEventName}
          />
          <Button title="Add Event" onPress={addEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
});

export default HomeScreen;
