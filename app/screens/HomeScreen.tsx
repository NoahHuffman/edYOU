import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';

const HomeScreen = () => {
  const [items, setItems] = useState({
    '2024-12-12': [{ name: 'Assignment1', time: '8:00 AM' }, { name: 'Assignment2', time: '11:59 PM' }],
    '2024-12-15': [{ name: 'Assignment1', time: '8:00 AM' }, { name: 'Assignment2', time: '11:59 PM' }],
    '2024-12-21': [{ name: 'Assignment1', time: '8:00 AM' }, { name: 'Assignment2', time: '11:59 PM' }],
    '2024-05-29': [{ name: 'Assignment1', time: '8:00 AM' }, { name: 'Assignment2', time: '11:59 PM' }],
  });

  const customTheme = {
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'blue',
  };

  const accessToken = 'key';
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjQtMTItMDkgMDQ6NTk6NTkuMDAwMDAwIiw4NjY3NjFdXQ&per_page=10';
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=first&per_page=10';
  // const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/planner/items?order=asc&start_date=2024-12-04T05%3A00%3A00.000Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjQtMTItMDkgMDQ6NTk6NTkuMDAwMDAwIiw4NjY3NjFdXQ&per_page=10';
  const canvasUrl = 'https://utchattanooga.instructure.com/api/v1/courses/36686/assignments';

  const fetchCourses = async () => {
    try {
      const response = await fetch(canvasUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].name);
        console.log(data[i].due_at);
      }
      // console.log(data);
    } catch (error: any) {
      console.error('Error fetching courses:', error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        theme={customTheme}
        renderItem={(item: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; time: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
          <View style={{ marginVertical: 10, marginTop: 30, backgroundColor: 'white', marginHorizontal: 10, padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default HomeScreen;
