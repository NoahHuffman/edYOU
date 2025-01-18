import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const AgendaItem = ({
  assignmentName,
  courseName,
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
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
          {assignmentName}
        </Text>
        <Text style={{ fontSize: 12 }}>{courseName}</Text>
        <Text style={{ fontSize: 12 }}>{dueTime}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View>
          <View
            style={{ height: 1, backgroundColor: "gray", marginVertical: 5 }}
          />
          <Text>{description}</Text>
        </View>
      )}
    </View>
  );
};
