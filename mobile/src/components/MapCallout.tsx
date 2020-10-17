import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Callout } from "react-native-maps";

interface MapCalloutProps {
    text: string,
    onPress?: () => void
}

const MapCallout: React.FC<MapCalloutProps> = ({text, onPress}) => {
    return (
        <Callout tooltip onPress={onPress}>
            <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{text}</Text>
            </View>
        </Callout>
    );
};

const styles = StyleSheet.create({
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
  },
  calloutText: {
    color: "#0089a5",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
  },
});

export default MapCallout