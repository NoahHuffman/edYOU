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
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);
LogBox.ignoreLogs([
  "MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.",
]);
LogBox.ignoreLogs([
  "TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

export const AgendaItem = ({
  assignmentName,
  courseName,
  dueTime,
  description,
  html_url,
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
          <View style={styles.divider} />
          <View style={styles.buttonContainer}>
            {html_url && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => Linking.openURL(html_url)}
              >
                <Text style={styles.buttonText}>Go to assignment</Text>
                <Icon name="external-link" size={16} color="white" />
              </TouchableOpacity>
            )}
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
  divider: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 15,
    opacity: 0.3,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#8c8c8c",
    borderRadius: 5,
    padding: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    marginRight: 5,
  },
});
