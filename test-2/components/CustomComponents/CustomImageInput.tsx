import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Component } from "react";
import { View, StyleSheet, Text, TextInput, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import CustomButton from "./CustomButton";

type SupportedMediaType = "image/jpeg" | "image/png" | "image/webp";
type SupportedFileExtensions = "jpeg" | "jpg" | "png" | "webp";

const MediaTypeToFormatMap = {
  "image/jpeg": SaveFormat.JPEG,
  "image/png": SaveFormat.PNG,
  "image/webp": SaveFormat.WEBP,
};

const FileExtensionToFormatMap = {
  jpeg: SaveFormat.JPEG,
  jpg: SaveFormat.JPEG,
  png: SaveFormat.PNG,
  webp: SaveFormat.WEBP,
};

interface CustomImageInputProps {
  imageValue: string;
  id: string;
  header: string;
  onChange: (id: string, imageValue: string) => void;
  format?: SaveFormat;
}

export default class CustomImageInput extends Component<
  CustomImageInputProps,
  {}
> {
  state = {
    format: SaveFormat.JPEG,
  };
  openImagePickerAsync = async () => {
    if (!this.props.onChange) return;
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }
    const formImageData = await this.getFormImageResult(pickerResult);

    console.log(formImageData);
    this.handleFieldChanged(formImageData);
  };

  handleFieldChanged = (uri: string) => {
    const fileExtension = uri.substring(
      uri.lastIndexOf(".") + 1
    ) as SupportedFileExtensions;

    const newform = fileExtension
      ? FileExtensionToFormatMap[fileExtension]
      : undefined;
    this.setState({ format: newform });
    if (this.props.onChange) {
      this.props.onChange(this.props.id, uri);
    }
  };

  async getFormImageResult(
    pickerResult: ImagePicker.ImageInfo
  ): Promise<string> {
    const { uri, width, height } = pickerResult;
    let inferredFormat: SaveFormat;
    let localUrl: string = "";
    if (uri.startsWith("data")) {
      const mediaType = uri.substring(
        5,
        uri.indexOf(";")
      ) as SupportedMediaType;
      inferredFormat = MediaTypeToFormatMap[mediaType] || SaveFormat.JPEG;
    } else if (uri.startsWith("file")) {
      const fileExtension = uri.substring(
        uri.lastIndexOf(".") + 1
      ) as SupportedFileExtensions;
      inferredFormat =
        FileExtensionToFormatMap[fileExtension] || SaveFormat.JPEG;
      localUrl = pickerResult.uri;
    } else {
      throw "Unsupported url type: " + uri;
    }
    const dataUri = await convertToDataUriWithFormat(uri, inferredFormat);
    return dataUri;
  }

  render() {
    return (
      <View style={{ ...styles.view }}>
        <Text style={{ ...styles.label }}>{this.props.header}</Text>
        <View style={styles.imagePicker}>
          <View style={styles.imagePickerControls}>
            <TextInput
              style={{ ...styles.input }}
              value={this.props.imageValue}
              onChangeText={this.handleFieldChanged}
              numberOfLines={1}
            />
            <CustomButton
              text="Pick an image"
              onPress={this.openImagePickerAsync}
              buttonStyles={{
                backgroundColor: "#6E85B7",
                borderRadius: 5,
                padding: 5,
              }}
            ></CustomButton>
          </View>
          <Image
            source={{
              uri:
                this.props.imageValue !== ""
                  ? this.props.imageValue
                  : "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
            }}
            style={styles.imagePickerThumbnail}
            resizeMode="cover"
          />
        </View>
        {/* {errors && (
          <Text style={{ ...styles.error, ...errorStyle }}>{errors}</Text>
        )} */}
      </View>
    );
  }
}

// utility functions
async function convertToDataUriWithFormat(
  uri: string,
  format = SaveFormat.JPEG
) {
  const manipResult = await manipulateAsync(uri, [], {
    base64: true,
    compress: 0.3,
    format,
  });
  return "data:image/xxx;base64," + manipResult.base64;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },

  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "85%",
  },
  label: {
    paddingTop: 5,
    fontSize: 16,
    alignSelf: "flex-start",
  },
  input: {
    height: 40,
    fontSize: 20,
    borderColor: "#6E85B7",
    backgroundColor: "#B2C8DF",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
  },
  error: {
    fontSize: 15,
    color: "red",
    borderColor: "red",
    backgroundColor: "#fcbdbd",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  imagePicker: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagePickerControls: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
  },
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
