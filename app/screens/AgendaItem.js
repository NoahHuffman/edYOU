import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  StyleSheet,
} from "react-native";
import RenderHTML from "react-native-render-html";
import Icon from "react-native-vector-icons/FontAwesome";

export const AgendaItem = ({
  assignmentName,
  courseName,
  dueTime,
  description,
  backgroundColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { width } = Dimensions.get("window");

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
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL("http://google.com")} // @TODO: assignment.html_url
            >
              <Text style={styles.buttonText}>Go to assignment</Text>
              <Icon name="external-link" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <RenderHTML
            contentWidth={width}
            source={{ html: description }}
            ignoredDomTags={["link"]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },
});
