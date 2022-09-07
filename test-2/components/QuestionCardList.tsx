import React, {
  Component,
  ForwardedRef,
  forwardRef,
  useMemo,
  useRef,
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

const ITEM_HEIGHT = 300;
export const DEFAULT_PAGE_SIZE = 3;

interface Props {
  questions: Question[];
  page: number;
  // filter: FilterType;
  scrollIndex?: number;
  onDelete: (question: Question) => void;
  onEdit: (question: Question) => void;
  onLoad: () => void;
  onFavouritesAdd: (question: Question) => void;
  filterFavorites: boolean;
  appState: Views;
  appStatusChange: (state: Views) => void;
  onMove: (index1: number, index2: number) => void;
}

type PostIdToAnimatedValueMap = {
  [id: number]: Animated.Value;
};

const QuestionCardList = forwardRef<FlatList<Question>, Props>(
  (props, fRef) => {
    const {
      questions,
      scrollIndex,
      page,
      onLoad,
      filterFavorites,
      ...rest
    }: Props = props;
    const postsAnimatedValues = useRef<PostIdToAnimatedValueMap>([]).current;

    const visible = (questions: Question[], filterFavorites: boolean) => {
      let newImages = questions
        // .filter((post) => (!filter ? true : post.status === filter))
        .filter((question) => {
          // if (filterFavorites !== false) {
          //   return question.isFavorite === true;
          // }
          return true;
        });
      return newImages;
    };

    const memoizedVisiblePosts = useMemo(
      () => visible(questions, props.filterFavorites),
      [questions, filterFavorites]
    );

    function intersect(arr1: string[], arr2: string[]) {
      for (const element of arr2) {
        if (!arr1.includes(element)) {
          return false;
        }
      }
      return true;
    }
    function renderHeader() {
      return (
        <NavigationBar
          appStatus={props.appState}
          appStatusChange={props.appStatusChange}
        ></NavigationBar>
      );
    }
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
                //flex: 1,
                zIndex: 50,
                elevation: 50,
                opacity: postsAnimatedValues[question.id!],
                marginLeft:
                  postsAnimatedValues[question.id!]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-500, 0],
                  }) ?? 0,
              }}
            >
              {rest.appState === Views.StartTest ?<TestCard
                  question={question}
                  key={question.id}
                  id={questions.indexOf(question)}
                  
                  {...rest}
                /> :
                <ImageCard
                  question={question}
                  key={question.id}
                  id={questions.indexOf(question)}
                  maxQuestions={questions.length - 1}
                  {...rest}
                />}
            </Animated.View>
          )}
          // initialScrollIndex={scrollIndex}
          removeClippedSubviews={false}
          getItemLayout={(
            data: Question[] | null | undefined,
            index: number
          ) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
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
