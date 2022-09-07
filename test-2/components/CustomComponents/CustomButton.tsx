import React, { Component, ReactNode } from "react";
import { Pressable, StyleSheet,Text } from "react-native";

interface CustomButtonProps{
    text: string,
    onPress: () => void,
    buttonStyles?: {},
    textStyles?:{},
}

export default class CustomButton extends Component<CustomButtonProps, {}> {
    render() {
        return (
            <Pressable
            style={{ ...styles.button, backgroundColor: "#F65A83",...this.props.buttonStyles }}
            onPress={this.props.onPress}
          >
                <Text selectable={false} style={{...styles.text,...this.props.textStyles}}>{this.props.text}</Text>
          </Pressable>)
    }
    
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        // paddingVertical: 11,
        // paddingHorizontal: 31,
        borderRadius: 4,
        width: "100%",
        // color: "#F7ECDE",
        // fontWeight: "bold",
        // marginTop: 5,
    },
    text: {
        color: "#FCF8E8",
        fontSize: 20,
      },
})