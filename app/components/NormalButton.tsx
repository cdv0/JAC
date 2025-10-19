import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ButtonVariant = "primary" | "outline" | "cancel" | "danger" | "lightBlue" | "black";

type NormalButtonProps = {
  onClick: () => void;
  text: string;
  width?: number | string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  variant?: ButtonVariant;
  grow?: boolean;
};

export default function NormalButton({
  onClick,
  text,
  width,
  paddingHorizontal = 30,
  paddingVertical = 7,
  variant = "primary",
  grow = false
}: NormalButtonProps) {

  /*
  Button Types:
  - Primary: Blue BG + White text
  - Outline: White BG + Blue stroke + Blue text
  - Cancel: Gray BG + Black text
  - Danger: Red BG + White text
  - LightBlue: Light blue BG + White text (only for Garage)
  - Black: Black BG + Whtie text
  */
  const variantStyles = {
    primary: {
      container: "bg-primaryBlue border border-textBlack",
      text: "buttonTextWhite",
    },
    outline: {
      container: "bg-white border border-primaryBlue",
      text: "buttonTextBlue",
    },
    danger: {
      container: "bg-dangerBrightRed border border-dangerDarkRed",
      text: "buttonTextWhite",
    },
    cancel: {
      container: "bg-secondary border border-grayBorder",
      text: "buttonTextBlue",
    },
    lightBlue: {
      container: "bg-lightBlueButton border border-lightBlueText",
      text: "buttonTextWhite",
    },
    black: {
      container: "bg-textBlack",
      text: "buttonWhiteText"
    }
  };

  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8} style={grow ? { alignSelf: "stretch", flexGrow: 1 } : undefined }>
      <View
        className={`${variantStyles[variant].container} items-center justify-center rounded-xl ${grow ? "self-stretch w-full" : "self-center"}`}
        style={{
          width,
          paddingHorizontal,
          paddingVertical,
          height: 38,
        }}
      >
        <Text className={`buttonTextWhite ${variantStyles[variant].text}`}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}