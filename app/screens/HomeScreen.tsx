import React, { useState, useEffect, memo } from "react";
import { View, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { Assignment } from "@/api/interfaces";
import { UTC_COURSE_CODE_LENGTH, getClassName } from "@/api/constants";
import { fetchCourses, fetchAssignments } from "@/api/canvasApis";

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

  const courses: { [key: string]: number } = {};

  useEffect(() => {
    const loadData = async () => {
      try {
        const coursesData = await fetchCourses();
        const newItems: Items = {};

        console.log("~~~~~~~~~~~~~~~~~ Courses ~~~~~~~~~~~~~~~~~");
        for (let i = 0; i < coursesData.length; i++) {
          const courseId = coursesData[i].course_id;
          const fullCourseName = coursesData[i].context_name;
          if (courseId && fullCourseName && courseId.toString().length == UTC_COURSE_CODE_LENGTH && !Object.values(courses).includes(courseId)) {
            const courseName = getClassName(coursesData[i].context_name);
            courses[courseName] = courseId;
          }
        }
        
        console.log(courses);

        const assignmentsData = await fetchAssignments(courses);

        console.log("~~~~~~~~~~~~~~~ Assignments ~~~~~~~~~~~~~~~");
        for (let i = 0; i < assignmentsData.length; i++) {
          if (assignmentsData[i].assignments.length > 0) {
            for (let j = 0; j < assignmentsData[i].assignments.length; j++) {
              console.log(assignmentsData[i].courseName + ': ' + assignmentsData[i].assignments[j].name);
            }
          }
        }

        assignmentsData.forEach((assignment: any) => {
          const dueDate = new Date(assignment.due_at);
          const formattedDate = dueDate.toISOString().split("T")[0];

          if (!newItems[formattedDate]) {
            newItems[formattedDate] = [];
          }

          newItems[formattedDate].push({
            course_id: assignment.course_id,
            id: assignment.id,
            name: assignment.name,
            time: dueDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            due_at: assignment.due_at,
          });
        });

        setItems(newItems);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
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
