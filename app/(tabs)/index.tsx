import { images } from "@/constants/images";
import { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";
import MechanicView from '../components/MechanicView';


export default function Index() {

  const [isFiltersActive, setisFiltersActive] = useState(false);
  const [isServicesActive, setisServicesActive] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  useEffect(() => {
          const data = async () => {
              try {
                  const file = await fetch("/local/dummy/data.json");
                  const mechanicsData = await file.json();
                  setMechanics(mechanicsData.mechanics);
              } catch (error) {
                  console.error("Error loading mechanics data:", error);
              }
          }
          data();
      }, []);
  return (
   <SafeAreaView className="flex-1" edges={['right', 'top', 'left']}>
      <View
      className="flex-1 bg-white "
      >
        <View className="justify-center w-full h-[17%]">
          <images.searchBackground width="100%" height="100%" style={{ position: 'absolute', zIndex: 0 }} />
          <View className="ml-[50%]">
            <NormalButton onClick={()=>{}} text={"Enter Garage"}/>
          </View>
        </View > 
        <SearchBar placeholder1="Search" placeholder2="Location"/>
        <View >
          <ScrollView  horizontal={true} contentContainerStyle={{gap:10}} showsHorizontalScrollIndicator={false}>
          <NormalButton variant={`${isFiltersActive?`primary`:`outline`}`} onClick={()=>{setisFiltersActive(!isFiltersActive)}} text="Filters"/>
          <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setisServicesActive(!isServicesActive)}} text="Services"/>
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
        <View>
                    {
                        mechanics.map((mechanic:any) => {
                            return (
                                <MechanicView 
                                    name={mechanic.name}
                                    type={mechanic.type}
                                    rating={mechanic.rating}
                                    reviews={mechanic.reviews}
                                    image={mechanic.image}
                                    services={mechanic.services}
                                />
                            )
                    })
                    }
                </View>
      </View>
   </SafeAreaView>
    
  );
}
