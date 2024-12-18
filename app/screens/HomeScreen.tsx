import React, { useState } from 'react';
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
    ...Calendar,
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'blue',
  };

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
