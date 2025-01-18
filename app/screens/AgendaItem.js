import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const AgendaItem = ({
  courseName,
  assignmentName,
  dueTime,
  description,
  backgroundColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: backgroundColor,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 8,
      }}
    >
      <TouchableOpacity onPress={() => setIsExpanded((old) => !old)}>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>{courseName}</Text>
        <Text style={{ fontSize: 12 }}>{assignmentName}</Text>
        <Text style={{ fontSize: 12 }}>{dueTime}</Text>
      </TouchableOpacity>
      {isExpanded && <Text>{description}</Text>}
    </View>
  );
};
