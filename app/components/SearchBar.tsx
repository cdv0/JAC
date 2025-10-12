import { icons } from "@/constants/icons";
import React from 'react';
import { TextInput, View } from 'react-native';

interface Props{
    placeholder1 :string;
    value1?: string;
    onPress1?: () =>void;
    onChangeText1?: (text: string) => void;
    placeholder2 :string;
    value2?: string;
    onPress2?: () =>void;
    onChangeText2?: (text: string) => void;


}

const SearchBar = ({placeholder1, value1, onPress1, onChangeText1, placeholder2, value2, onPress2, onChangeText2}:Props) => {
  return (
    <View className='border border-stroke flex-row items-center bg-white rounded-full px-2 py-2 my-4'>
      {/*General search*/}
      <icons.search className='w-21 h-full' color = "black"/>
      <TextInput
        onPress = {onPress1}
        placeholder={placeholder1}
        value ={value1}
        onChangeText={onChangeText1}
        placeholderTextColor= "#9E9E9E"
        className="flex-1 ml-5 pr-40 text-textBlack"  
      />
      {/* Diveder*/}
      <View className="w-0.5 h-full bg-stroke mx-5"/> 
      {/* Location search*/}
      <icons.location className='w-21 h-full'/>
      <TextInput
        onPress = {onPress2}
        placeholder={placeholder2}
        value ={value2}
        onChangeText={onChangeText2}
        placeholderTextColor= "#9E9E9E"
        className="flex-1 ml-5 mr-5 text-textBlack"  
      />
    
    </View>
  )
}

export default SearchBar