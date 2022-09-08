import React, {
  Component,
  ForwardedRef,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Additions, IdType, Views } from "../model/shared-types";

import { useEffect } from "react";
import ImageCard from "./QuestionCard";
import NavigationBar from "./NavigationBar";
import { Answers, Question } from "../model/question-answer-model";
import TestCard from "./TestCard";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";

const ITEM_HEIGHT = 300;
export const DEFAULT_PAGE_SIZE = 3;

interface Props {
  questions: Question[];
  appState: Views;
  onDelete: (question: Question) => void;
  onEdit: (question: Question) => void;
  appStatusChange: (state: Views) => void;
  onMove: (index1: number, index2: number) => void;
}
interface State {
  selectedQuestions: { [questionid: number]: Additions };
  finalResults: number;
}

export default class QuestionCardList extends Component<Props, State> {
  state: Readonly<State> = {
    selectedQuestions: {},
    finalResults: 0,
  };

  getQuestions = (questionId: number, answer: Additions) => {
    this.setState({
      selectedQuestions: {
        ...this.state.selectedQuestions,
        ...{ ...{ [questionId]: answer } },
      },
    });
  };

  maximumResults = () => {
    return Object.values(this.props.questions).reduce(
      (prevValue, value) =>
        prevValue + (value !== undefined ? parseInt(value.points) : 0),
      0
    );
  };

  handleDeleteAnswer = (questionId: number, answerKey: string) => {
    const blob = Object.keys(this.state.selectedQuestions[questionId])
      .filter((k) => k !== answerKey)
      .map((k) => {
        return { [k.toString()]: this.state.selectedQuestions[questionId][k] };
      });

    let newAnswer: Additions = {};
    blob.forEach((elem) => {
      newAnswer = { ...newAnswer, ...elem };
    });
    this.setState({
      selectedQuestions: {
        ...this.state.selectedQuestions,
        ...{ ...{ [questionId]: newAnswer } },
      },
    });
    //this.setState({ selectedAnswers: { ...newAnswer } });
  };
  setResults = (points: number) => {
    this.setState(({ finalResults }) => ({
      finalResults: (finalResults += points),
    }));
  };

  render() {
    const { questions, ...rest } = { ...this.props };
    return (
      <>
        {this.props.appState === Views.StartTest ? (
          <Pressable
            style={{
              position: "absolute",
              top: -40,
              right: 20,
              padding: 5,
              borderRadius: 10,
              backgroundColor: "red",
              borderColor: "darkred",
              borderWidth: 2,
              zIndex: 50,
            }}
            onPress={() => {
              this.props.appStatusChange(Views.ViewResults);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "beige" }}>
              End{Platform.OS === "web" && " the Test"}
            </Text>
          </Pressable>
        ) : this.props.appState === Views.ViewResults ? (
          <Pressable
            style={{
              position: "absolute",
              top: -40,
              right: 20,
              padding: 5,
              borderRadius: 10,
              backgroundColor: "red",
              borderColor: "darkred",
              borderWidth: 2,
              zIndex: 50,
            }}
            onPress={() => {
              this.setState({ finalResults: 0,selectedQuestions:{} });
              this.props.appStatusChange(Views.EditingQuestions);
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "beige" }}>
              Finish
            </Text>
          </Pressable>
        ) : (
          <></>
        )}
        {this.props.appState === Views.ViewResults ? (
          <>
            <View>
              <Text>
                Total: {this.state.finalResults}/{this.maximumResults()}
              </Text>
            </View>
            <FlatList<Question>
              style={{ width: "100%", height: 400 }}
              data={questions}
              nestedScrollEnabled
              renderItem={({ item: question }) => (
                <View
                  style={{
                    zIndex: 50,
                    elevation: 50,
                  }}
                >
                  <ResultCard
                    question={question}
                    addToFinalResults={this.setResults}
                    key={question.id}
                    selectedQuestionAnswers={
                      this.state.selectedQuestions[question.id as number]
                    }
                    id={this.props.questions.indexOf(question)}
                    {...rest}
                  ></ResultCard>
                </View>
              )}
            />
          </>
        ) : (
          <FlatList<Question>
            style={{ width: "100%", height: 400 }}
            data={questions}
            nestedScrollEnabled
            renderItem={({ item: question }) => (
              <View
                style={{
                  zIndex: 50,
                  elevation: 50,
                }}
              >
                {rest.appState === Views.StartTest ? (
                  <View key={question.id}>
                    <TestCard
                      handleDeleteAnswer={this.handleDeleteAnswer}
                      handleSelectedAnswers={this.getQuestions}
                      question={question}
                      key={question.id}
                      id={questions.indexOf(question)}
                      {...rest}
                    />
                  </View>
                ) : (
                  <View key={question.id}>
                    <QuestionCard
                      question={question}
                      key={question.id}
                      id={questions.indexOf(question)}
                      maxQuestions={questions.length - 1}
                      {...rest}
                    />
                  </View>
                )}
              </View>
            )}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  removeFilterButton: {
    padding: 10,
    color: "white",
    backgroundColor: "#ff4466",
    borderRadius: 10,
    margin: 5,
    textAlign: "center",
  },
});
