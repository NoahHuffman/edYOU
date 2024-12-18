import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import ZipCodePopup from "../components/ZipComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

const HomeScreen = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <Calendar
      style={styles.calendar}
      // Specify the current date
      current={"2012-03-01"}
      // Callback that gets called when the user selects a day
      onDayPress={(day: any) => {
        console.log("selected day", day);
      }}
      // Mark specific dates as marked
      markedDates={{
        "2012-03-01": { selected: true, marked: true, selectedColor: "blue" },
        "2012-03-02": { marked: true },
        "2012-03-03": { selected: true, marked: true, selectedColor: "blue" },
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fae3d9",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: 100,
  },
});

export default HomeScreen;
