import { DimensionValue, Pressable, Text } from 'react-native';
interface Props{
    text :string;
    width?: DimensionValue; // optional fixed width
    flag: boolean; // flag to update
    onPress: (isToggled:boolean) => void;
}

const ToggleButton = ({text, onPress, width, flag}:Props) => {

  const handlePress= () =>{
    onPress(!flag); 
  }
  
  return (
    <Pressable onPress={handlePress} 
    className={`py-[7] px-[30] h-[38] items-center justify-center rounded-xl
    ${flag? `bg-primaryBlue border border-textBlack`: `bg-white border border-primaryBlue`}
    `} style = {width?{width: width}:{width:'auto'}}>
        <Text className={` ${flag?`buttonTextWhite`:`buttonTextBlue`}`}>
            {text}
        </Text>
    </Pressable>
  )
}

export default ToggleButton