import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const AgendaItem = ({
  courseName,
  assignmentName,
  dueTime,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsExpanded((old) => !old)}>
        <Text style={{ fontWeight: "bold" }}>{courseName}</Text>
        <Text>{assignmentName}</Text>
        <Text>{dueTime}</Text>
      </TouchableOpacity>
      {isExpanded && <Text>{description}</Text>}
    </View>
  );
};
