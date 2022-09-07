import React, { Component } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { Question } from "../model/question-answer-model";
import { Views } from "../model/shared-types";
import Checkbox from "expo-checkbox";

interface TestCardProps {
  question: Question;
  appState: Views;
  appStatusChange: (state: Views) => void;
  id: number;
}
interface TestCardState {
  isChecked: boolean[];
}
export default class TestCard extends Component<TestCardProps, TestCardState> {
  state: Readonly<TestCardState> = {
    isChecked: [],
  };

  render() {
    const { answers } = { ...this.props.question };
    return (
      <View style={{ ...styles.outerCard }}>
        <View style={styles.card} key={this.props.question.id!.toString()}>
          {this.props.question.picture !== "" && (
            <Image
              style={{ ...styles.image, width: 400, height: 300 }}
              source={{ uri: this.props.question.picture }}
            ></Image>
          )}

          <Text
            selectable={false}
            style={{
              fontSize: 26,
              alignSelf: "flex-start",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {this.props.question.text}
          </Text>

          <View style={{ width: "100%" }}>
            {answers &&
              Object.entries(answers).map(([key, value]) => (
                <View style={styles.section} key={parseInt(key)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={this.state.isChecked[parseInt(key)]}
                    onValueChange={() => {
                      this.setState({
                        isChecked: {
                          ...this.state.isChecked,
                          [key]: !this.state.isChecked[parseInt(key)],
                        },
                      });
                    }}
                    color={
                      this.state.isChecked[parseInt(key)] ? "#4630EB" : "white"
                    }
                  />
                  <Image
                    style={styles.image}
                    source={{ uri: value.picture }}
                  ></Image>
                  <Text style={styles.paragraph}>{value.text}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerCard: {
    padding: 20,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    zIndex: 40,
    elevation: 40,
    backgroundColor: "#C4D7E0",
    overflow: "hidden",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    // textTransform: "capitalize",
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    borderRadius: 10,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  checkbox: {
    margin: 8,
  },
  paragraph: {
    fontSize: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    // width: "100%",
    color: "#F7ECDE",
    fontWeight: "bold",
  },
});
