import React, { Component } from "react";
import { Pressable, StyleSheet, View, Text, Animated } from "react-native";
import { Views } from "../model/shared-types";
import CustomButton from "./CustomComponents/CustomButton";

interface NavigationBarProps {
  appStatus: Views;
  appStatusChange: (state: Views) => void;
}

class NavigationBar extends Component<NavigationBarProps, {}> {
  render() {
    return (
      <Animated.View style={styles.btnContainer}>
        
          <View style={{ ...styles.innerContainer}}>
            <CustomButton
              text={"Questions"}
              onPress={() => this.props.appStatusChange(Views.EditingQuestions)}
              buttonStyles={{ ...styles.button, backgroundColor: "#6E85B7" }}
              textStyles={styles.text}
          ></CustomButton>
          <CustomButton
              text={"Add Question"}
              onPress={() => this.props.appStatusChange(Views.AddQuestion)}
              buttonStyles={{ ...styles.button, backgroundColor: "#6E85B7" }}
              textStyles={styles.text}
            ></CustomButton>
            {/* <CustomButton
              text={"Favorites"}
              onPress={() => this.props.appStatusChange(Views.FavoritesView)}
              buttonStyles={{ ...styles.button, backgroundColor: "#6E85B7" }}
              textStyles={styles.text}
            ></CustomButton> */}
          </View>
        
      </Animated.View>
    );
  }
}
export default NavigationBar;
const styles = StyleSheet.create({
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F7ECDE",
    alignItems: "flex-end",
    // alignContent: "flex-end",
    paddingTop: 5,
  },
  leftContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "baseline",
    justifyContent: "space-between",
    // flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    //paddingVertical: 12,
    //paddingHorizontal: 32,
    borderRadius: 4,
    width: 130,
    padding: 10,
    color: "#FCF8E8",
    fontWeight: "bold",
    marginRight: 5,
  },
  text: {
    color: "#FCF8E8",
    fontSize: 20,
  },
});
