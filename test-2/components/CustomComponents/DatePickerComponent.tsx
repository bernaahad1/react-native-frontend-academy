import React, { Component, ReactNode } from "react";
import { en, registerTranslation } from "react-native-paper-dates";
registerTranslation("en", en);

import { Button, Platform, StyleSheet, TextInput, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import CustomInput from "./CustomInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

interface DatePickerComponentProps {
  date: string;
  validationErrors: string;
  onTextChange: (arr1: string, arr2: string) => void;
}

interface DatePickerComponentState {
  showDatePicker: boolean;
}

export default class DatePickerComponent extends Component<
  DatePickerComponentProps,
  DatePickerComponentState
> {
  state: Readonly<DatePickerComponentState> = {
    showDatePicker: false,
  };
  handleDateChange = ({ date }: { date: Date }) => {
    this.props.onTextChange("date", this.getIsoDate(date));
    this.setState({ showDatePicker: false });
  };
  getIsoDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  render() {
    return (
      <>
        {Platform.OS === "web" ? (
          <CustomInput
            id="date"
            value={this.props.date}
            header="Date in form YYYY-MM-DD"
            handleChange={this.props.onTextChange}
            valudationErrors={this.props.validationErrors}
          ></CustomInput>
        ) : (
          <>
            <TextInput
              style={styles.dateInput}
              value={this.props.date}
              onChangeText={(text: string) => {
                this.props.onTextChange("date", text);
              }}
            />
            <Button
              color="#6E85B7"
              onPress={() => this.setState({ showDatePicker: true })}
              title="Choose Date"
            />
            {
              <DateTimePickerModal
                isVisible={this.state.showDatePicker}
                date={new Date(this.props.date)}
                mode="date"
                onConfirm={(date) => {
                  this.props.onTextChange(
                    "date",
                    date.toISOString().split("T")[0]
                  );
                  this.setState({ showDatePicker: false });
                }}
                onCancel={() => this.setState({ showDatePicker: false })}
              />
            }
          </>
        )}
        {/* <View style={styles.dateChooser}>
          <>
            <TextInput
              style={styles.dateInput}
              value={this.props.date}
              onChangeText={(text: string) => {
                this.props.onTextChange("date", text);
              }}
            />
            <Button
              color="gray"
              onPress={() => this.setState({ showDatePicker: true })}
              title="Choose Date"
            />
          </>
        </View> */}

        {/* <DatePickerModal
          locale="en"
          mode="single"
          visible={this.state.showDatePicker}
          onDismiss={() => this.setState({ showDatePicker: false })}
          date={new Date(this.props.date)}
          onConfirm={(date) => {
            this.props.onTextChange(
              "date", date.toString()
            );
            this.setState({ showDatePicker: false });
          }}
          onChange={(date) => {
            this.props.onTextChange(
              "date", date.toString()
            );
            this.setState({ showDatePicker: false });
          }}
          saveLabel="Save"
        /> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
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
});
