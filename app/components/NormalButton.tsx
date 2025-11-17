import { ReactNode } from 'react';
import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';

type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'cancel'
  | 'danger'
  | 'lightBlue'
  | 'black'

type NormalButtonProps = {
  onClick: () => void
  text: string
  width?: DimensionValue
  paddingHorizontal?: number
  paddingVertical?: number
  variant?: ButtonVariant
  icon?: ReactNode
  grow?: boolean
  height?: number
};

export default function NormalButton({
  onClick,
  text,
  width,
  paddingHorizontal = 30,
  paddingVertical = 7,
  variant = 'primary',
  icon,
  grow = false,
  height = 38
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
      container: 'bg-primaryBlue border border-textBlack',
      text: 'buttonTextWhite',
    },
    outline: {
      container: 'bg-white border border-primaryBlue',
      text: 'buttonTextBlue',
    },
    danger: {
      container: 'bg-dangerBrightRed border border-dangerDarkRed',
      text: 'buttonTextWhite',
    },
    cancel: {
      container: 'bg-secondary border border-grayBorder',
      text: 'buttonTextBlue',
    },
    lightBlue: {
      container: 'bg-lightBlueButton border border-lightBlueText',
      text: 'buttonTextWhite',
    },
    black: {
      container: 'bg-textBlack',
      text: 'buttonWhiteText',
    },
  }

  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8} style={grow ? { alignSelf: "stretch", flexGrow: 1 } : undefined }>
      <View
        className={`${variantStyles[variant].container} items-center justify-center rounded-xl flex flex-row ${grow ? "self-stretch w-full" : "self-center"}`}
        style={{
          width: width,
          paddingHorizontal,
          paddingVertical,
          height: 38,
        }}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text className={`buttonTextWhite ${variantStyles[variant].text}`}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}