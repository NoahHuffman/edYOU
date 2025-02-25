import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsScreenProps = {
  route: RouteProp<{ params: { courses: { [key: string]: number } } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route }) => {
  const { courses } = route.params;

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      {Object.entries(courses).map(([courseName, courseId]) => (
        <Text key={courseId}>{courseName}: {courseId}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fae3d9',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
