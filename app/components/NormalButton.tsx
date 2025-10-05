import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type NormalButtonProps = {
  onClick?: () => void
  text: string
  size: string
}

export default function NormalButton({
  onClick,
  text,
  size,
}: NormalButtonProps) {
  const rem = 16
  const width = Number(size) * rem
  return (
    //Need to add activeOpacity later
    <TouchableOpacity onPress={onClick} activeOpacity={0.9}>
      <View
        style={{ width: width }}
        className={`bg-primaryBlue stroke-textBlack h-8 items-center justify-center rounded-xl border`}
      >
        <Text className="text-white ">{text}</Text>
      </View>
    </TouchableOpacity>
  )
}
