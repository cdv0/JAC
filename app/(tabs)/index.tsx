import { images } from "@/constants/images";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";
export default function Index() {

  const [isFiltersActive, setisFiltersActive] = useState(false);
  const [isFiltersModal, setisFiltersModal] = useState(false);
  const [isServicesActive, setisServicesActive] = useState(false);
  const [minP, setminP] = useState('');
  const [maxP, setmaxP] = useState('');
  
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
            <NormalButton variant={`${isFiltersActive?`primary`:`outline`}`} onClick={()=>{setisFiltersModal(!isFiltersModal)}} text="Filters"/>
            <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setisServicesActive(!isServicesActive)}} text="Services"/>
            <ToggleButton onPress={()=>{}} text="Oil Change"/>
            <ToggleButton onPress={()=>{}} text="Tire Rotation"/>
            <ToggleButton onPress={()=>{}} text="Smog Check"/>
            <ToggleButton onPress={()=>{}} text="Transmission Repair"/>
            <ToggleButton onPress={()=>{}} text="Wheel Alignment"/>
          </ScrollView>
        </View>
        
        <View className="mt-[10] ml-2">
            <Text className="text-[25px]">Find Nearby</Text>
        </View>
        {/*Expand filters */}
        <Modal visible={isFiltersModal}>
          <View className="flex-1">
              <View className="flex-row justify-between ml-[2%] mr-[2%] mt-[5%] mb-[5%]">
                  <Text className="justify-start  text-[25px] buttonTextBlack">
                    Filters
                  </Text>
                  {/* <NormalButton paddingVertical={1} variant="outline" text="X" onClick={()=>{setisFiltersModal(!isFiltersModal)}}/> */}
                  <Pressable onPress={()=>{setisFiltersModal(!isFiltersModal)}}>
                    <View className="w-[35] items-center justify-center ">
                      <Text className="text-[25px] buttonTextBlack">
                        X
                      </Text>
                    </View>
                    
                  </Pressable>

              </View>
              
              <View className="flex-1 border border-stroke gap-[10]">
                
                <Text className="text-[20px] buttonTextBlack ml-[5%] mt-[2%] mb-[2%]">
                  Sort by
                </Text>

                <View className="flex-row justify-between ml-[5%] mr-[5%]">
                  <ToggleButton width={150} text="Relevance" onPress={()=>{}}/>
                  <ToggleButton width={150} text="Open Now" onPress={()=>{}}/>
                </View>

                <View className="flex-row justify-between ml-[5%] mr-[5%]">
                  <ToggleButton width={150} text="Popular" onPress={()=>{}}/>
                  <ToggleButton width={150} text="Rating" onPress={()=>{}}/>
                </View>

                <Text className="text-[20px] buttonTextBlack ml-[5%] mt-[2%] mb-[2%]">
                  Price
                </Text>

                <View className="flex-row ml-[5%] mr-[5%] gap-[5%] items-center">
                  <Text className="buttonTextBlack ">
                    Minimum:
                  </Text>

                  <View className="border border-textBlack w-[25%] rounded-xl">
                    <TextInput value={minP} keyboardType='numeric' 
                              onChangeText={(newP)=>{
                                              if (newP == '')
                                                setminP(`${newP}`); //if there's nothing don't add dollar sign
                                              else
                                              {
                                                newP = newP.split('$').join('');
                                                setminP(`$${newP}`);
                                              }
                                            }}/>
                  </View> 

                  <Text className="buttonTextBlack">
                    Maximum:
                  </Text>

                  <View className="border border-textBlack w-[25%] rounded-xl">
                    <TextInput value={maxP} keyboardType='numeric'
                              onChangeText={(newP)=>{
                                              if (newP == '')
                                                setmaxP(`${newP}`); //if there's nothing don't add dollar sign
                                              else
                                              {
                                                newP = newP.split('$').join('');
                                                setmaxP(`$${newP}`);
                                              }
                                            }}/>
                  </View> 

                </View>
                
                <Text className="text-[20px] buttonTextBlack ml-[5%] mt-[2%] mb-[2%]">
                  Distance
                </Text>

            </View>

          </View>

          <View className="items-end mt-[2%] mb-[2%]">
            <NormalButton text="Apply" onClick={()=>{setisFiltersModal(!isFiltersModal)}}/>
          </View>

        </Modal>
        
      </View>
   </SafeAreaView>
    
  );
}
