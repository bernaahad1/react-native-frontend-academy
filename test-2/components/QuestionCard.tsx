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

interface Point {
  x: number;
  y: number;
}

interface imageItemProps {
  question: Question;
  onEdit: (image: Question) => void | undefined;
  onDelete: (image: Question) => void | undefined;
  onMove: (index1: number, index2: number) => void;
  maxQuestions: number;
  appState: Views;
  appStatusChange: (state: Views) => void;
  id: number;
  dropSquare?: {
    px: number;
    py: number;
    width: number;
    height: number;
  };
  onDrop?: () => void;
  itemInfo?: {
    content: string;
  };
}

export default class QuestionCard extends Component<imageItemProps, {}> {
  panValue = new Animated.ValueXY({ x: 0, y: 0 });
  opacityAnim = new Animated.Value(1);
  colorAnim = new Animated.Value(1);

  render() {
    const panStyle = {
      transform: this.panValue.getTranslateTransform(),
    };
    const backgroundColor = this.opacityAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#fcd56a", "#C4D7E0"],
      extrapolate: "clamp",
    });
    const { answers } = { ...this.props.question };
    return (
      <View style={{ ...styles.outerCard }}>
        <Animated.View
          // {...this.panResponder.panHandlers}
          style={{
            ...panStyle,
            ...styles.card,
            // opacity: this.opacityAnim,
            //backgroundColor: backgroundColor,
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
                    Answer Score: {value.scorePerc}
                  </Text>
                </View>
              ))}
          </View>
          <>
            <View style={styles.btnContainer}>
              <>
                <Pressable
                  style={{ ...styles.button, backgroundColor: "#94B49F" }}
                  onPress={() => {
                    this.props.onEdit(this.props.question);
                    this.props.appStatusChange(Views.AddQuestion);
                  }}
                >
                  <Text selectable={false}>Edit</Text>
                </Pressable>
                <Pressable
                  style={{ ...styles.button, backgroundColor: "#FF87B2" }}
                  onPress={() => this.props.onDelete(this.props.question)}
                >
                  <Text selectable={false}>Delete</Text>
                </Pressable>
                {this.props.id > 0 && (
                  <Pressable
                    style={{ ...styles.button, backgroundColor: "gray" }}
                    onPress={() =>
                      this.props.onMove(this.props.id, this.props.id - 1)
                    }
                  >
                    <Text selectable={false}>Move up</Text>
                  </Pressable>
                )}
                {this.props.id < this.props.maxQuestions && (
                  <Pressable
                    style={{ ...styles.button, backgroundColor: "gray" }}
                    onPress={() =>
                      this.props.onMove(this.props.id, this.props.id + 1)
                    }
                  >
                    <Text selectable={false}>Move Down</Text>
                  </Pressable>
                )}
              </>
            </View>
          </>
        </Animated.View>
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
    width: 100,
    height: 100,
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
    // width: "100%",
    color: "#F7ECDE",
    fontWeight: "bold",
  },
});
