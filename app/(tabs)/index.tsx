import { images } from "@/constants/images";
import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
export default function Index() {
  return (
   <SafeAreaView className="flex-1" edges={['right', 'top', 'left']}>
      <View
      className="flex-1 bg-white relative"
      >
        <View className="justify-center w-full h-[150px] relative">
          <images.searchBackground width="100%" height="100%" style={{ position: 'absolute', top:0, zIndex: 0 }} />
          <View className="ml-[50%]">
            <NormalButton onClick={()=>{}} text={"Enter Garage"}/>
          </View>
        </View > 
        <SearchBar placeholder1="Search" placeholder2="Location"/>

      </View>
   </SafeAreaView>
    
  );
}
