import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Component, useState } from "react";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface Props {
    onCheckmarkPress: () => void;
    checked: boolean;
}


export default class MyCheckbox extends Component<Props, {}> {
  

  handleCheckmarkPress = () => {
    const status = this.props.onCheckmarkPress();
    this.setState({ checked: status });
  };

  render() {
    return (
      <Pressable
        style={[
          styles.checkboxBase,
          this.props.checked && styles.checkboxChecked,
        ]}
        onPress={this.props.onCheckmarkPress}
      >
        {this.props.checked && (
          <FontAwesome name="check" size={24} color="white" />
        )}
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "coral",
    backgroundColor: "transparent",
  },

  checkboxChecked: {
    backgroundColor: "coral",
  },

  appContainer: {
    flex: 1,
    alignItems: "center",
  },

  appTitle: {
    marginVertical: 16,
    fontWeight: "bold",
    fontSize: 24,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxLabel: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 18,
  },
});
