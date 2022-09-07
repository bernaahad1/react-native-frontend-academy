import { en, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", en);

import {
  Alert,
  Button,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as yup from "yup";
import CustomButton from "./CustomComponents/CustomButton";
import CustomInput from "./CustomComponents/CustomInput";
// import { FormQuestionComponent } from "./Form/FormQuestionComponent";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DatePickerModal } from "react-native-paper-dates";
import { Views } from "../model/shared-types";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import DatePickerComponent from "./CustomComponents/DatePickerComponent";
import React, { Component } from "react";
import AdditionalInfo from "./AdditionalInfo";
import {
  Answers,
  Question,
  QuestionType,
} from "../model/question-answer-model";
import CustomImageInput from "./CustomComponents/CustomImageInput";

type Validations = {
  [key: string]: yup.BaseSchema;
};

type Additions = {
  [key: string]: Answers;
};

type NewType = {
  text: string;
  type: string;
  points: string;
  picture: string;
  id: string;
  created: string;
  modified: string;
  answers: Additions;
  typeArr: string[];
  validations: Validations;
  validationErrors: {
    text: string;
    type: string;
    picture: string;
  };
};

type QuestionFormState = NewType;

interface QuestionFormProps {
  question: Question | undefined;
  onCreateQuestion: (question: Question) => void;
  onResetForm: () => void;
  appStatusChange: (state: Views) => void;
}
export type FieldValidationResult = string[] | string | undefined;
export default class QuestionForm extends Component<
  QuestionFormProps,
  QuestionFormState
> {
  state: Readonly<QuestionFormState> = {
    id: this.props.question?.id?.toString() || "",
    text: this.props.question?.text || "",
    points: this.props.question?.points || "",
    created:
      this.props.question?.created || new Date().toISOString().split("T")[0],
    modified:
      this.props.question?.modified || new Date().toISOString().split("T")[0],
    type: this.props.question?.type || "",
    picture: this.props.question?.picture || "",
    validations: {
      text: yup.string().min(10).max(500),
      uri: yup.string().min(10),
    },
    typeArr: ["None", "MultipleChoice", "MultipleResponse", "DaragAndDrop"],
    answers: this.props.question?.answers || {},
    validationErrors: {
      text: "",
      type: "",
      picture: "",
    },
  };

  validatorValidate(
    validator: yup.BaseSchema,
    fieldName: string,
    value: string
  ) {
    try {
      validator.validateSync(value);
    } catch (err) {
      const validationError = err as yup.ValidationError;
      return validationError.errors;
    }
  }

  handleValidation = (
    field: string,
    value: string,
    validations: yup.BaseSchema
  ) => {
    let errors: FieldValidationResult;
    if (Array.isArray(validations)) {
      errors = validations
        .flatMap((validator) => this.validatorValidate(validator, field, value))
        .filter((err) => err !== undefined) as string[];
    } else {
      errors = this.validatorValidate(validations, field, value);
    }
    let strErrors: FieldValidationResult = errors;
    if (Array.isArray(errors)) {
      strErrors = errors.join(", ");
    } else if (errors === undefined) {
      strErrors = "";
    }
    this.setState(({ validationErrors }) => ({
      validationErrors: { ...validationErrors, [field]: strErrors },
    }));
    console.log(strErrors, field);
    console.log(this.state.validationErrors);
  };

  handleTextChange = (
    field: string,
    value: string,
    validations?: yup.BaseSchema
  ) => {
    const stateUpdeadline = {
      [field]: value,
    } as unknown as QuestionFormState;
    this.setState(stateUpdeadline);
    if (validations) {
      this.handleValidation(field, value, validations);
    }
  };

  handleNewAnswer = (field: string, value: Answers) => {
    console.log(this.state.answers);

    const newVal = { [field]: value };
    this.setState(({ answers }) => ({ answers: { ...answers, ...newVal } }));
    // console.log(this.state.additions);
  };
  handleDeleteAnswer = (key: string) => {
    const { answers } = this.state;
    const blob = Object.keys(answers)
      .filter((k) => k !== key)
      .map((k) => {
        return { [k.toString()]: answers[k] };
      });

    let newAnswer: Additions = {};
    blob.forEach((elem) => {
      newAnswer = { ...newAnswer, ...elem };
    });

    this.setState({ answers: { ...newAnswer } });
  };

  validateSubmit = () => {
    for (const [key1, validation] of Object.entries(this.state.validations)) {
      for (const [key2, value] of Object.entries(this.state)) {
        if (key2 === key1) {
          //console.log(key2,value);

          this.handleValidation(key2, value.toString(), validation);
        }
      }
    }
    //console.log(this.state.validationErrors);

    for (const value2 of Object.values(this.state.validationErrors)) {
      console.log(value2.toString(), "here");

      if (value2 !== "") {
        return false;
      }
    }
    return true;
  };

  handleRegistrationSubmit = () => {
    //if (!this.validateSubmit()) {
    //   console.log("no submit");

    //   return;
    // }

    this.props.onCreateQuestion(
      new Question(
        this.state.text,
        this.state.type,
        this.state.points,
        this.state.answers,
        this.state.picture,
        this.state.created,
        this.state.modified,
        this.state.id ? parseInt(this.state.id) : undefined
      )
    );
    this.resetQuestionState();
    this.props.appStatusChange(Views.EditingQuestions);
  };

  handleRegistrationReset = () => {
    this.resetQuestionState();
    this.props.onResetForm();
  };

  resetQuestionState = () => {
    this.setState({
      id: "",
      text: "",
      points: "",
      created: new Date().toISOString().split("T")[0],
      modified: new Date().toISOString().split("T")[0],
      picture: "",
      answers: {},
      validationErrors: {
        text: "",
        type: "",
        picture: "",
      },
    });
  };

  getIsoDate(date: Date) {
    return date.toISOString().split("T")[0];
  }
  render() {
    return (
      <View style={styles.registrationForm}>
        <Text style={styles.header}>Add new Question</Text>
        <Text>{this.state.id}</Text>
        <CustomInput
          id="text"
          value={this.state.text}
          header="Question"
          handleChange={this.handleTextChange}
          valudationErrors={this.state.validationErrors.text}
          validations={this.state.validations.text}
        ></CustomInput>
        <CustomImageInput
          imageValue={this.state.picture}
          id={"picture"}
          header={"Select picture"}
          onChange={this.handleTextChange}
        ></CustomImageInput>
        <CustomInput
          id="points"
          value={this.state.points}
          header="Points"
          handleChange={this.handleTextChange}
          valudationErrors={this.state.validationErrors.text}
          validations={this.state.validations.text}
        ></CustomInput>
        <Text>Select Type</Text>
        <SelectDropdown
          data={this.state.typeArr}
          onSelect={(selectedItem, index) => {
            this.handleTextChange("type", this.state.typeArr[index]);
          }}
          defaultButtonText={this.state.typeArr[0]}
          buttonTextAfterSelection={(selectedItem) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
        />
        <AdditionalInfo
          answers={this.state.answers}
          questionTypes={this.state.type}
          onNewAddition={this.handleNewAnswer}
          onChange={this.handleNewAnswer}
          onDelete={this.handleDeleteAnswer}
        ></AdditionalInfo>
        <View style={styles.btnContainer}>
          <CustomButton
            text={"Upload"}
            onPress={this.handleRegistrationSubmit}
            buttonStyles={{ ...styles.button, backgroundColor: "#94B49F" }}
            textStyles={styles.text}
          ></CustomButton>
          <CustomButton
            text={"Reset form"}
            onPress={this.handleRegistrationReset}
            buttonStyles={{ ...styles.button, backgroundColor: "#F65A83" }}
            textStyles={styles.text}
          ></CustomButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  registrationForm: {
    width: "85%",
    backgroundColor: "#B2C8DF",
    borderRadius: 10,
    padding: 15,
    alignItems: "stretch",
    paddingHorizontal: 40,
    paddingBottom: 30,
    marginTop: 10,
    marginBottom: 10,
    maxWidth: 800,
  },
  header: {
    fontWeight: "bold",
    fontSize: 36,
    alignSelf: "center",
    padding: 5,
    paddingBottom: 20,
  },
  dateChooser: {
    display: "flex",
    flexDirection: "row",
  },
  dateInput: {
    flex: 1,
    fontSize: 20,
    padding: 5,
    borderColor: "#6E85B7",
    borderWidth: 2,
    borderRadius: 5,
  },
  input: {
    borderColor: "#6E85B7",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  text: {
    color: "#FCF8E8",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,

    width: "50%",
    color: "#F7ECDE",
    fontWeight: "bold",
  },

  label: {
    fontSize: 20,
    alignSelf: "flex-start",
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 30,
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#6E85B7",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "transparent" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
