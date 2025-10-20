import { images } from "@/constants/images";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";
export default function Index() {
  return (
   <SafeAreaView className="flex-1" edges={['right', 'top', 'left']}>
      <View
      className="flex-1 bg-white "
      >
        <View className="justify-center w-full h-[135px]">
          <images.searchBackground width="100%" height="100%" style={{ position: 'absolute', zIndex: 0 }} />
          <View className="ml-[50%]">
            <NormalButton onClick={()=>{}} text={"Enter Garage"}/>
          </View>
        </View > 
        <SearchBar placeholder1="Search" placeholder2="Location"/>
        <View >
          <ScrollView  horizontal={true} contentContainerStyle={{gap:10}} showsHorizontalScrollIndicator={false}>
          <ToggleButton onPress={()=>{}} text="Filters"/>
          <ToggleButton onPress={()=>{}} text="Services"/>
          <ToggleButton onPress={()=>{}} text="Oil Change"/>
          <ToggleButton onPress={()=>{}} text="Tire Rotation"/>
          <ToggleButton onPress={()=>{}} text="Smog Check"/>
          <ToggleButton onPress={()=>{}} text="Transmission Repair"/>
          <ToggleButton onPress={()=>{}} text="Wheel Alignment"/>
        </ScrollView>
        </View>
        
        <View className="mt-[10px] ml-2">
            <Text className="text-[25px]">Find Nearby</Text>
        </View>
        
      </View>
   </SafeAreaView>
    
  );
}
