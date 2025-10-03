import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type NormalButtonProps = {
  onClick: () => void
  text: string
  size: string
}

export default function NormalButton({
  onClick,
  text,
  size,
}: NormalButtonProps) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View
        className={`bg-textBlack w-${size} h-8 items-center justify-center rounded-xl`}
      >
        <Text className="text-white ">{text}</Text>
      </View>
    </TouchableOpacity>
  )
}
