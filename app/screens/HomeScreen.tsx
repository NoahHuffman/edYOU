import React, { useState, useEffect, memo } from "react";
import { View, Text } from "react-native";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { CANVAS_KEY } from "@/api/constants";
import { Assignment } from "@/api/interfaces";

interface Items {
  [date: string]: Assignment[];
}

const HomeScreen: React.FC = () => {
  const [items, setItems] = useState<Items>({});

  const customTheme = {
    agendaDayTextColor: "yellow",
    agendaDayNumColor: "green",
    agendaTodayColor: "red",
    agendaKnobColor: "blue",
  };

  const accessToken = CANVAS_KEY;
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjQtMTItMDkgMDQ6NTk6NTkuMDAwMDAwIiw4NjY3NjFdXQ&per_page=10';
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=first&per_page=10';
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjQtMTItMDkgMDQ6NTk6NTkuMDAwMDAwIiw4NjY3NjFdXQ&per_page=10';
  const assignmentsUrl =
    "https://utchattanooga.instructure.com/api/v1/courses/36686/assignments";

  const fetchAssignments = async () => {
    try {
      const response = await fetch(assignmentsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching assignments");
      }

      const data: Assignment[] = await response.json();
      const newItems: Items = {};

      data.forEach((course: Assignment) => {
        const dueDate = new Date(course.due_at);
        const formattedDate = dueDate.toISOString().split("T")[0];
        console.log(course);

        if (!newItems[formattedDate]) {
          newItems[formattedDate] = [];
        }

        newItems[formattedDate].push({
          course_id: course.course_id,
          id: course.id,
          name: course.name,
          time: dueDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          due_at: course.due_at,
        });
      });

      setItems(newItems);
    } catch (error: any) {
      console.error("Error fetching courses:", error.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const RenderItem: React.FC<{ item: Assignment }> = memo(({ item }) => (
    <View
      style={{
        marginVertical: 10,
        marginTop: 30,
        backgroundColor: "white",
        marginHorizontal: 10,
        padding: 10,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>Course ID: {item.course_id}</Text>
      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
      <Text>{item.time}</Text>
    </View>
  ));

  const RenderEmptyData: React.FC = () => (
    <View
      style={{
        marginVertical: 10,
        marginTop: 30,
        backgroundColor: "white",
        marginHorizontal: 10,
        padding: 10,
        alignItems: "center",
      }}
    >
      <Text>No assignments due today!</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        theme={customTheme}
        renderItem={(item: Assignment) => <RenderItem item={item} />}
        renderEmptyData={() => <RenderEmptyData />}
      />
    </View>
  );
};

export default HomeScreen;
