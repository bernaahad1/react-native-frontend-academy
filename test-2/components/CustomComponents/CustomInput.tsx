
import React, { Component } from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as yup from "yup";

interface CustomInputProps {
  id: string;
  value: string;
  header: string;
  handleChange: (
    value: string,
    id: string,
    validations?: yup.BaseSchema
  ) => void;
  secureTextEntry?: boolean;
  valudationErrors?: string;
  validations?: yup.BaseSchema;
  multiline?: boolean;
  numberOfLines?: number;
}

class CustomInput extends Component<CustomInputProps, {}> {
  

  handleTextChange = (text: string) => {
    this.props.handleChange(this.props.id, text, this.props.validations);
  };

  render() {
    return (
      <View>
        <Text>{this.props.header}</Text>
        <TextInput
          style={styles.input}
          value={this.props.value}
          onChangeText={this.handleTextChange}
          secureTextEntry={this.props.secureTextEntry}
          multiline={this.props.multiline}
          numberOfLines={this.props.numberOfLines}
        />
        {this.props.valudationErrors && (
          <Text style={styles.errors}>{this.props.valudationErrors}</Text>
        )}
      </View>
    );
  }
}
export default CustomInput;

const styles = StyleSheet.create({
  input: {
    borderColor: "#6E85B7",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  errors: {
    fontSize: 15,
    borderColor: "#F65A83",
    borderWidth: 1,
    borderRadius: 5,
    color: "#F65A83",
   // padding: 2,
    backgroundColor: "#fabece",
  },
});
