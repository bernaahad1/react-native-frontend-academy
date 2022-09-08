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

interface Props {
  question: Question;
  appState: Views;
  appStatusChange: (state: Views) => void;
  id: number;
  selectedQuestionAnswers: Additions;
  addToFinalResults: (nim: number) => void;
}

interface State {
  maxReachedPoints: number;
}

export default class ResultCard extends Component<Props, State> {
  state: Readonly<State> = {
    maxReachedPoints: 0,
  };
  componentDidMount(): void {
    let points = 0;

    if (this.props.selectedQuestionAnswers !== undefined) {
      points =
        (parseInt(this.props.question.points) *
          Object.values(this.props.selectedQuestionAnswers).reduce(
            (prevValue, value) =>
              prevValue + (value !== undefined ? parseInt(value.scorePerc) : 0),
            0
          )) /
        100;
    }
    this.props.addToFinalResults(points);
    this.setState({ maxReachedPoints: points });
  }
  findAnswerPoints = (maxP: number, prc: number) => {
    return maxP * (prc / 100);
  };

  findAllPoints = () => {
    let points = 0;
    Object.values(this.props.selectedQuestionAnswers).forEach((value) => {
      points += this.findAnswerPoints(
        parseInt(this.props.question.points),
        parseInt(value.scorePerc)
      );
    });
    this.setState({ maxReachedPoints: points });
  };

  getColor = (key: string, value: Answers) => {
    if (this.props.selectedQuestionAnswers !== undefined) {
      const res1 = Object.keys(this.props.selectedQuestionAnswers).find(
        (k) => k === key
      );
      if (res1 === undefined) {
        return "transparent";
      } else if (
        parseInt(this.props.selectedQuestionAnswers[res1].scorePerc) > 0
      ) {
        return "lightgreen";
      } else {
        return "tomato";
      }
    }
    return "transparent";
  };
  render() {
    const { answers } = { ...this.props.question };
    const { selectedQuestionAnswers, ...rest } = { ...this.props };
    return (
      <View style={{ ...styles.outerCard }}>
        <View
          style={{
            ...styles.card,
          }}
          key={this.props.question.id!.toString()}
        >
          {this.props.question.picture !== "" && (
            <Image
              style={{ ...styles.image, width: 300, height: 200 }}
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
          <Text>
            {this.state.maxReachedPoints}/{this.props.question.points}
          </Text>

          <View style={{ width: "100%" }}>
            {answers &&
              Object.entries(answers).map(([key, value]) => (
                <View
                  key={key}
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "flex-start",
                    borderColor: "gray",
                    borderBottomWidth: 1,
                    backgroundColor: this.getColor(key, value),
                  }}
                >
                  <Text style={{ textAlign: "left", fontSize: 20 }}>
                    {"->"} {value.text}
                  </Text>
                  {value.picture !== "" && (
                    <Image
                      style={styles.image}
                      source={{ uri: value.picture }}
                    ></Image>
                  )}
                  <Text style={{ textAlign: "right", alignSelf: "flex-end" }}>
                    Answer Score: {value.scorePerc}%
                  </Text>
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
  name: {
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 10,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    color: "#F7ECDE",
    fontWeight: "bold",
  },
});
