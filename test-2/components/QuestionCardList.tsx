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
} from "react-native";
import { IdType, Views } from "../model/shared-types";

import { useEffect } from "react";
import ImageCard from "./QuestionCard";
import NavigationBar from "./NavigationBar";
import { Question } from "../model/question-answer-model";
import TestCard from "./TestCard";
import QuestionCard from "./QuestionCard";

const ITEM_HEIGHT = 300;
export const DEFAULT_PAGE_SIZE = 3;

interface Props {
  questions: Question[];
  page: number;
  // filter: FilterType;
  scrollIndex?: number;
  onDelete: (question: Question) => void;
  onEdit: (question: Question) => void;
  appState: Views;
  appStatusChange: (state: Views) => void;
  onMove: (index1: number, index2: number) => void;
}

type PostIdToAnimatedValueMap = {
  [id: number]: Animated.Value;
};

const QuestionCardList = forwardRef<FlatList<Question>, Props>(
  (props, fRef) => {
    const { questions, scrollIndex, page, ...rest }: Props = props;
    const [selectedQuestions, setSelectedQuestions] = useState([] as Question[])
    
    return (
      <>
        <FlatList<Question>
          ref={fRef}
          style={{ width: "100%", height: 400 }}
          data={questions}
          nestedScrollEnabled
          renderItem={({ item: question }) => (
            <Animated.View
              style={{
               
                zIndex: 50,
                elevation: 50,
              }}
            >
              {rest.appState === Views.StartTest ? (
                <View key={question.id}>
                  <TestCard
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
            </Animated.View>
          )}
         
        />
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
