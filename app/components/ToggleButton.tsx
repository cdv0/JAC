import React from 'react';
import { DimensionValue, Pressable, Text } from 'react-native';
interface Props{
    text :string;
    width?: DimensionValue; // optional fixed width
    flag: boolean; // flag to update
    onPress: (isToggled:boolean) => void;
}

const ToggleButton = ({text, onPress, width, flag = false}:Props) => {

  const handlePress= () =>{
    onPress(!flag); 
  }

  return (
    <Pressable onPress={handlePress} 
    className={`py-[7] h-[38] items-center justify-center rounded-xl self-center
    ${flag? `bg-primaryBlue border border-textBlack`: `bg-white border border-primaryBlue`}
    `} style = {width?{width: width}:{paddingHorizontal:30}}>
        <Text className={` ${flag?`buttonTextWhite`:`buttonTextBlue`} `}>
            {text}
        </Text>
    </Pressable>
  )
}

export default ToggleButton