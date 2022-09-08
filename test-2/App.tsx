import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
} from "react-native";
import NavigationBar from "./components/NavigationBar";
import { questionsAPI } from "./dao/repository";
import { Views } from "./model/shared-types";
import React, { Component } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Question, QuestionType } from "./model/question-answer-model";
import QuestionForm from "./components/QuestionForm";
import QuestionCardList from "./components/QuestionCardList";
import CustomButton from "./components/CustomComponents/CustomButton";

export const DEFAULT_PAGE_SIZE = 3;

interface UserAppState {
  questions: Question[];
  editingQuestion: Question;
  errors: string;
  updates: string;
  appStatus: Views;
  // page: number;
  // allPosts: Post[];
  // personalPosts: Post[] | undefined;
}
const getRresetQuestion = () => {
  return new Question("", "", "", {});
};

class App extends Component<{}, UserAppState> {
  state: Readonly<UserAppState> = {
    questions: [],
    editingQuestion: getRresetQuestion(),
    errors: "",
    updates: "",
    //page: 0,
    appStatus: Views.EditingQuestions,
    //currentUser: undefined,
  };

  async componentDidMount() {
    try {
      const allquestions = await questionsAPI.getAllElements();
      this.setState({ questions: allquestions });
      this.setState(({ updates }) => ({ updates: (updates = "") }));
    } catch (err) {
      this.setState(({ errors }) => ({ errors: errors.concat(err as string) }));
      console.log(err as string);
      this.setState(({ updates }) => ({ updates: (updates = "") }));
    }
  }

  handleCreateQuestion = async (question: Question) => {
    try {
      if (question.id) {
        const updated = await questionsAPI.update(question);
        this.setState(({ questions }) => ({
          questions: questions.map((td) =>
            td.id === updated.id ? updated : td
          ),
          editingQuestion: getRresetQuestion(),
        }));
      } else {
        const newQuestion = await questionsAPI.add(question);
        this.setState(({ questions }) => ({
          questions: questions.concat(newQuestion),
        }));
        this.setState(({ errors }) => ({ errors: (errors = "") }));
      }
    } catch (err) {
      this.setState(({ errors }) => ({ errors: errors.concat(err as string) }));
      this.setState(({ updates }) => ({ updates: (updates = "") }));
    }
  };

  handleEditQuestion = (question: Question) => {
    this.setState({ editingQuestion: question });
    this.setState(({ updates }) => ({ updates: (updates = "") }));
  };

  handleDeleteQuestion = async (question: Question) => {
    try {
      await questionsAPI.deleteById(question.id);
      this.setState(({ questions }) => ({
        questions: questions.filter((usr) => usr.id !== question.id),
      }));
    } catch (err) {
      this.setState(({ errors }) => ({ errors: errors.concat(err as string) }));
      setTimeout(() => {
        this.setState(({ errors }) => ({ errors: (errors = "") }));
      }, 3000);
      this.setState(({ updates }) => ({ updates: (updates = "") }));
      console.log(err as string);
    }
  };

  handleResetForm = () => {
    this.setState({
      editingQuestion: getRresetQuestion(),
    });
  };

  handleViewChange = (state: Views) => {
    this.setState(({ appStatus }) => ({
      appStatus: (appStatus = state),
    }));
  };
  handleMove = (index1: number, index2: number) => {
    const newArr = [...this.state.questions];
    [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];
    this.setState({ questions: newArr });
  };

  render() {
    return (
      <>
        <PaperProvider
          theme={{
            ...DefaultTheme,
            fonts: {
              medium: {
                padding: 0,
              },
            },
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <StatusBar></StatusBar>
            <SafeAreaView style={{ backgroundColor: "black" }}></SafeAreaView>
            {this.state.appStatus !== Views.StartTest && (
              <Pressable
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: "green",
                  borderColor: "darkgreen",
                  borderWidth: 2,
                  zIndex: 50,
                }}
                onPress={() => this.handleViewChange(Views.StartTest)}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "beige" }}
                >
                  Start{Platform.OS === "web" && " the Test"}
                </Text>
              </Pressable>
            )}
            <NavigationBar
              appStatus={this.state.appStatus}
              appStatusChange={this.handleViewChange}
            ></NavigationBar>

            {this.state.appStatus === Views.EditingQuestions ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F7ECDE",
                  height: 300,
                }}
              >
                <QuestionCardList
                  questions={this.state.questions}
                  appState={this.state.appStatus}
                  onEdit={this.handleEditQuestion}
                  onDelete={this.handleDeleteQuestion}
                  appStatusChange={this.handleViewChange}
                  onMove={this.handleMove}
                />
              </View>
            ) : this.state.appStatus === Views.AddQuestion ? (
              <ScrollView style={{ backgroundColor: "#F7ECDE", height: 0 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#F7ECDE",
                  }}
                >
                  <QuestionForm
                    key={this.state.editingQuestion?.id}
                    question={this.state.editingQuestion}
                    onCreateQuestion={this.handleCreateQuestion}
                    onResetForm={this.handleResetForm}
                    appStatusChange={this.handleViewChange}
                  ></QuestionForm>
                </View>
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F7ECDE",
                }}
              >
                <QuestionCardList
                  questions={this.state.questions}
                  appState={this.state.appStatus}
                  onEdit={this.handleEditQuestion}
                  onDelete={this.handleDeleteQuestion}
                  appStatusChange={this.handleViewChange}
                  onMove={this.handleMove}
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </PaperProvider>
      </>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontWeight: "bold",
    fontSize: 50,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",

    backgroundColor: "rgba(247,247,247,1.0)",
  },
  errors: {
    padding: 5,
    border: 1,
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: "#eecccc",
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
  updates: {
    padding: 5,
    border: 1,
    margin: 40,
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: "lightgreen",
    color: "green",
    textAlign: "center",
  },
});
