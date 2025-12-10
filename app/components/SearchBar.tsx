import { icons } from "@/constants/icons";
import React from 'react';
import { TextInput, View } from 'react-native';

interface Props{
    placeholder1 :string;
    value1?: string;
    onChangeText1?: (text: string) => void;
    placeholder2 :string;
    value2?: string;
    onChangeText2?: (text: string) => void;

}

const SearchBar = ({placeholder1, value1, onChangeText1, placeholder2, value2,  onChangeText2}:Props) => {
  return (
    <View className='border border-stroke flex-row items-center bg-white rounded-full px-2 py-2 my-4 mx-5'>
      {/*General search*/}
      <icons.search width={55} height={25}/>
      <TextInput
        placeholder={placeholder1}
        value ={value1}
        onChangeText={onChangeText1}
        placeholderTextColor= "#9E9E9E"
        className="flex-1 pr-20 text-textBlack"  
      />
      {/* Diveder*/}
      <View className="w-0.5 h-full bg-stroke"/> 
      {/* Location search*/}
      <icons.location width={55} height={25}/>
      <TextInput
        placeholder={placeholder2}
        value ={value2}
        onChangeText={onChangeText2}
        placeholderTextColor= "#9E9E9E"
        className="flex-1 text-textBlack"  
      />
    
    </View>
  )
}

export default SearchBar