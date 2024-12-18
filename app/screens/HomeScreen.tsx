import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { CalendarList } from "react-native-calendars";

const HomeScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const todaysDate = new Date().toISOString().split('T')[0];

  const onDayPress = (day: { dateString: any; }) => {
    const markedDates = {
      [day.dateString]: {
        selected: true,
        marked: true,
        selectedColor: "blue",
      },
    };

    setMarkedDates(markedDates);
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
});

export default HomeScreen;
