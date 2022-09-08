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

const QuestionCardList = forwardRef<FlatList<Question>, Props>(
  (props, fRef) => {
    const { questions, ...rest }: Props = props;
    const [selectedQuestions, setSelectedQuestions] = useState(
      {} as { [questionid: number]: Additions }
    );

    const getQuestions = (questionId: number, answer: Additions) => {
      setSelectedQuestions({
        ...selectedQuestions,
        ...{ ...{ [questionId]: answer } },
      });
      // console.log("====================================");
      // console.log(selectedQuestions);
      // console.log("====================================");
    };

    const handleDeleteAnswer = (questionId: number, answerKey: string) => {
      const blob = Object.keys(selectedQuestions[questionId])
        .filter((k) => k !== answerKey)
        .map((k) => {
          return { [k.toString()]: selectedQuestions[questionId][k] };
        });

      let newAnswer: Additions = {};
      blob.forEach((elem) => {
        newAnswer = { ...newAnswer, ...elem };
      });
      setSelectedQuestions({
        ...selectedQuestions,
        ...{ ...{ [questionId]: newAnswer } },
      });
      // this.setState({ selectedAnswers: { ...newAnswer } });
    };
    return (
      <>
        {props.appState === Views.StartTest && (
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
              props.appStatusChange(Views.ViewResults)
              console.log("====================================");
            console.log(selectedQuestions);
              console.log("====================================");
            }
            }
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "beige" }}>
              End{Platform.OS === "web" && " the Test"}
            </Text>
          </Pressable>
        )}
        {rest.appState === Views.ViewResults ? (
          <FlatList<Question>
            ref={fRef}
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
                  key={question.id}
                  selectedQuestionAnswers={
                    selectedQuestions[question.id as number]
                  }
                  id={questions.indexOf(question)}
                  {...rest}
                ></ResultCard>
              </View>
            )}
          />
        ) : (
          <FlatList<Question>
            ref={fRef}
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
                      handleDeleteAnswer={handleDeleteAnswer}
                      handleSelectedAnswers={getQuestions}
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
);

export default QuestionCardList;

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
