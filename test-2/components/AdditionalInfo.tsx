import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { Answers } from "../model/question-answer-model";

import CustomButton from "./CustomComponents/CustomButton";
import CustomImageInput from "./CustomComponents/CustomImageInput";
import CustomInput from "./CustomComponents/CustomInput";

type Additions = {
  [key: string]: Answers;
};

interface AdditionalInfoState {
  scorePerc: string;
  text: string;
  picture: string;
  created: string;
  modified: string;
  id: string;
}
interface AdditionalInfoProps {
  answers: Additions;
  questionTypes: string;
  onNewAddition: (arg1: string, arg2: Answers) => void;
  onChange: (arg1: string, arg2: Answers) => void;
  onDelete:(arg1:string,arg2: Answers)=>void
}

export default class AdditionalInfo extends Component<
  AdditionalInfoProps,
  AdditionalInfoState
> {
  state: Readonly<AdditionalInfoState> = {
    scorePerc: "",
    text: "",
    picture: "",
    created: new Date().toISOString().split("T")[0],
    modified: new Date().toISOString().split("T")[0],
    id: "",
  };

  handleAdditionChange = (key: string, value: Answers) => {
    const stateUpdeadline = {
      [key]: value,
    };
    // this.setState(stateUpdeadline);
    this.props.onChange(key, value);
  };

  handleNewHeaderChange = (key: string, value: string) => {
    const stateUpdeadline = {
      [key]: value,
    } as unknown as AdditionalInfoState;
    this.setState(stateUpdeadline);
  };
  onNewHeader = () => {
    //console.log(Object.entries(this.props.answers));
    const newAnsw = this.getNewAnswer();

    this.props.onNewAddition(
      this.state.id !== "" ? this.state.id : newAnsw.id.toString(),
      this.getNewAnswer()
    );
    this.setState({
      picture: "",
      text: "",
      scorePerc: "",
      created: new Date().toISOString().split("T")[0],
      modified: new Date().toISOString().split("T")[0],
      id:"",
    });
    //this.setState({ newHeader: "" });
  };
  getNewAnswer = () => {
    return new Answers(
      this.state.scorePerc,
      this.state.text,
      this.state.picture
    );
  };
  handleEdit = () => {};
  render() {
    const { answers, questionTypes, ...rest } = this.props;
    return (
      <>
        <View
          style={{
            borderColor: "#6E85B7",
            borderWidth: 2,
            padding: 5,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Current answers
          </Text>
          {Object.entries(answers).map(([key, value]) => (
            <View>
              <Text>Answer text: {value.text}</Text>
              <Text>Score: {value.scorePerc}</Text>
              {value.picture != "" && (
                <Image
                  source={{
                    uri: value.picture,
                  }}
                  style={styles.imagePickerThumbnail}
                  resizeMode="cover"
                />
              )}
              <Button
                title={"Edit"}
                onPress={() => {
                  this.setState({ picture: value.picture || "" });
                  this.setState({ scorePerc: value.scorePerc || "" });
                  this.setState({ text: value.text || "" });
                  this.setState({ created: value.created || "" });
                  this.setState({ modified: value.modified || "" });
                  this.setState({ id: value.id.toString() || "" });
                }}
              ></Button>
              <Button
                title={"Delete"}
                onPress={() => {
                  this.setState({ picture: value.picture || "" });
                  this.setState({ scorePerc: value.scorePerc || "" });
                  this.setState({ text: value.text || "" });
                  this.setState({ created: value.created || "" });
                  this.setState({ modified: value.modified || "" });
                  this.setState({ id: value.id.toString() || "" });
                }}
              ></Button>
            </View>
          ))}
        </View>
        {this.props.questionTypes === "DragAndDrop" ? (
          <></>
        ) : (
          <View
            style={{
              borderColor: "#6E85B7",
              borderWidth: 2,
              padding: 5,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Add new answer
            </Text>
            <CustomInput
              id={"text"}
              header={"Answer text"}
              value={this.state.text}
              handleChange={this.handleNewHeaderChange}
            ></CustomInput>
            <CustomImageInput
              imageValue={this.state.picture}
              id={"picture"}
              header={"Select picture"}
              onChange={this.handleNewHeaderChange}
            ></CustomImageInput>
            <CustomInput
              id={"scorePerc"}
              header={"Answer Score"}
              value={this.state.scorePerc}
              handleChange={this.handleNewHeaderChange}
            ></CustomInput>

            <CustomButton
              text="Add new answer"
              onPress={this.onNewHeader}
            ></CustomButton>
          </View>
        )}
        {/* <CustomInput
          id={"newHeader"}
          header={"Answer context"}
          value={this.state.newHeader}
          handleChange={this.handleNewHeaderChange}
        ></CustomInput>
        <CustomButton
          text="Add new answer"
          onPress={this.onNewHeader}
        ></CustomButton> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  imagePickerThumbnail: {
    width: 90,
    height: 90,
    borderColor: "#6E85B7",
    backgroundColor: "#ccc",
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 8,
  },
});
