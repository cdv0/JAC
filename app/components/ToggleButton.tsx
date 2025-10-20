import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
interface Props{
    text :string;
    width?: number; /* optional fixed width*/
    onPress: (isToggled:boolean) => void;
}

const ToggleButton = ({text, onPress, width}:Props) => {
  const [isToggled, setIsToggled] = useState(false);

  const handlePress= () =>{
    setIsToggled(!isToggled);
    onPress(!isToggled); 
  }

  return (
    <Pressable onPress={handlePress} 
    className={`${width?`w-[${width}]`:`px-[30]`} py-[7] h-[38] items-center justify-center rounded-xl self-center
    ${isToggled? `bg-primaryBlue border border-textBlack`: `bg-white border border-primaryBlue`}
    `}>
        <Text className={` ${isToggled?`buttonTextWhite`:`buttonTextBlue`} `}>
            {text}
        </Text>
    </Pressable>
  )
}

export default ToggleButton