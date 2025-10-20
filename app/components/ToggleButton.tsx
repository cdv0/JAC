import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
interface Props{
    text :string;
    onPress: (isToggled:boolean) => void;
}

const ToggleButton = ({text, onPress}:Props) => {
  const [isToggled, setIsToggled] = useState(false);

  const handlePress= () =>{
    setIsToggled(!isToggled);
    onPress(!isToggled); 
  }

  return (
    <Pressable onPress={handlePress} 
    className={`px-8 h-10 items-center justify-center rounded-xl self-center
    ${isToggled? `bg-primaryBlue border border-textBlack`: `bg-white border border-primaryBlue`}
    `}>
        <Text className={` ${isToggled?`buttonTextWhite`:`buttonTextBlack`}`}>
            {text}
        </Text>
    </Pressable>
  )
}

export default ToggleButton