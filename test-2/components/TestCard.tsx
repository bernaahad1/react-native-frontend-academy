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
import { Answers, Question } from "../model/question-answer-model";
import { Additions, Views } from "../model/shared-types";
import Checkbox from "expo-checkbox";
import MyCheckbox from "./CustomComponents/MyCheckbox";

interface TestCardProps {
  question: Question;
  selectedQuestions: Additions;
  appState: Views;
  appStatusChange: (state: Views) => void;
  handleSelectedAnswers: (questionId: number, answers: Additions) => void;
  handleDeleteAnswer: (questionId: number, answersKey: string) => void;
  id: number;
}
interface TestCardState {
  isChecked: { [key: string]: boolean };
  selectedAnswers: Additions;
}

export default class TestCard extends Component<TestCardProps, TestCardState> {
  state: Readonly<TestCardState> = {
    isChecked: {},
    selectedAnswers: {},
  };

  componentDidMount(): void {
    Object.keys(this.props.question.answers).forEach((key) => {
      this.setState(({ isChecked }) => ({
        isChecked: { ...isChecked, [key]: this.props.selectedQuestions ? Object.keys(this.props.selectedQuestions).includes(key):false },
      }));
    });
  }

  handleChecked = (key: string, answer: Answers) => {
    if (this.props.question.type === "MultipleChoice") {
      if (this.state.isChecked[parseInt(key)]) {
        this.setState({ selectedAnswers: {}, isChecked: {} });
        this.props.handleSelectedAnswers(this.props.question.id as number, {});
      } else {
        this.setState({
          selectedAnswers: { [key]: answer },
          isChecked: { [key]: true },
        });
        this.props.handleSelectedAnswers(this.props.question.id as number, {
          [key]: answer,
        });
      }
    } else if (this.props.question.type === "MultipleResponse") {
      if (this.state.isChecked[key] === false) {
        this.setState({
          selectedAnswers: { ...this.state.selectedAnswers, [key]: answer },
        });
        this.setState({
          isChecked: {
            ...this.state.isChecked,
            [key]: true,
          },
        });
        this.props.handleSelectedAnswers(this.props.question.id as number, {
          ...this.state.selectedAnswers,
          [key]: answer,
        });
      } else {
        const newAnsw = this.handleDeleteAnswer(key);
        this.props.handleSelectedAnswers(this.props.question.id as number, {
          ...newAnsw,
        });

        this.setState({
          isChecked: {
            ...this.state.isChecked,
            [key]: false,
          },
        });
      }
    }
  };

  handleDeleteAnswer = (key: string) => {
    const { selectedAnswers } = this.state;
    const blob = Object.keys(selectedAnswers)
      .filter((k) => k !== key)
      .map((k) => {
        return { [k.toString()]: selectedAnswers[k] };
      });

    let newAnswer: Additions = {};
    blob.forEach((elem) => {
      newAnswer = { ...newAnswer, ...elem };
    });
    return newAnswer;
    //this.setState({ selectedAnswers: { ...newAnswer } });
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
                  <MyCheckbox
                    checked={this.state.isChecked[parseInt(key)]}
                    onCheckmarkPress={() => this.handleChecked(key, value)}
                  ></MyCheckbox>

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
