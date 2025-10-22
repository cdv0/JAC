import { images } from "@/constants/images";
import Slider from '@react-native-community/slider';
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";
export default function Index() {

  const [isFiltersActive, setisFiltersActive] = useState(false);
  const [isFiltersModal, setisFiltersModal] = useState(false);

  const [isOilChangeActive, setIsOiltChangeActive] = useState(false);
  const [isTireActive, setIsTireActive] = useState(false);
  const [isSmogActive, setIsSmogActive] = useState(false);
  const [isTransmissionActive, setIsTransmissionActive] = useState(false);
  const [isWheelActive, setIsWheelActive] = useState(false);

  const [isServicesActive, setIsServicesActive] = useState(false);

  const [isRelevanceActive, setIsRelevanceActive] = useState(false);
  const [isRelevanceApplied, setIsRelevanceApplied] = useState(false);

  const [isOpenNowActive, setIsOpenNowActive] = useState(false);
  const [isOpenNowApplied, setIsOpenNowApplied] = useState(false);

  const [isPopularActive, setIsPopularActive] = useState(false); 
  const [isPopularApplied, setIsPopularApplied] = useState(false); 
  
  const [isRatingActive, setIsRatingActive] = useState(false);
  const [isRatingApplied, setIsRatingApplied] = useState(false);
  
  const [minP, setminP] = useState('');
  const [tempMinP, setTempMinP] = useState('');

  const [maxP, setmaxP] = useState('');
  const [tempMaxP, setTempMaxP] = useState('');

  const width= '45%';
  const minD = 0;
  const maxD = 20;
  
  const [sliderValue, setSliderValue] = useState(maxD / 2); 
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
  const [warning, setWarning] = useState(false);
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
            <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setIsServicesActive(!isServicesActive)}} text="Services"/>
            <ToggleButton flag = {isOilChangeActive} onPress={(newF)=>{setIsOiltChangeActive(newF)}} text="Oil Change" />
            <ToggleButton flag = {isTireActive} onPress={(newf)=>{setIsTireActive(newf)}} text="Tire Rotation"/>
            <ToggleButton flag = {isSmogActive} onPress={(newf)=>{setIsSmogActive(newf)}} text="Smog Check"/>
            <ToggleButton flag ={isTransmissionActive} onPress={(newf)=>{setIsTransmissionActive(newf)}} text="Transmission Repair"/>
            <ToggleButton flag = {isWheelActive} onPress={(newf)=>{setIsWheelActive(newf)}} text="Wheel Alignment"/>
          </ScrollView>
        </View>
        
        <View className="mt-[10] ml-2">
            <Text className="text-[25px]">Find Nearby</Text>
        </View>

        {/*Expand filters */}
        <Modal visible={isFiltersModal} >
          <View className="flex-1">
              <View className="flex-row justify-between ml-[2%] mr-[2%] mt-[5%] mb-[5%]">
                  <Text className="justify-start  text-[25px] buttonTextBlack">
                    Filters
                  </Text>

                  <Pressable 
                    onPress={()=> 
                      {
                        //undo the changes
                        setIsRelevanceActive(isRelevanceApplied);
                        setIsOpenNowActive(isOpenNowApplied);
                        setIsPopularActive(isPopularApplied)
                        setIsRatingActive(isRatingApplied);
                        setTempMinP(minP);
                        setTempMaxP(maxP);
                        setWarning(false);
                        setTempSliderValue(sliderValue);
                        setisFiltersModal(!isFiltersModal);
                      }}>
          
                      <View className="w-[35] items-center justify-center ">
                        <Text className="text-[25px] buttonTextBlack">
                          X
                        </Text>
                      </View>

                  </Pressable>

              </View>
              
              <View className="flex-1 border border-stroke gap-[5%] ">
                
                <Text className="text-[20px] buttonTextBlack ml-[5%] mt-[5%]">
                  Sort by
                </Text>

                <View className="flex-row justify-between ml-[5%] mr-[5%]">
                  <ToggleButton width={width} text="Relevance" flag={isRelevanceActive} onPress={(newf)=>{setIsRelevanceActive(newf)}}/>
                  <ToggleButton width={width} text="Open Now" flag={isOpenNowActive} onPress={(newf)=>{setIsOpenNowActive(newf)}}/>
                </View>

                <View className="flex-row justify-between ml-[5%] mr-[5%] mt-[-2%]">
                  <ToggleButton width={width} text="Popular" flag={isPopularActive} onPress={(newf)=>{setIsPopularActive(newf)}}/>
                  <ToggleButton width={width} text="Rating" flag={isRatingActive} onPress={(newf)=>{setIsRatingActive(newf)}}/>
                </View>

                <Text className="text-[20px] buttonTextBlack ml-[5%] ">
                  Price
                </Text>
                <View className="flex-row ml-[5%] mr-[5%] gap-[2%] items-center">
                  <Text className="buttonTextBlack ">
                    Minimum:
                  </Text>

                  <View className={`border ${warning?'border-dangerBrightRed':'border-textBlack'} w-[30%] rounded-xl`}>
                    <TextInput value={tempMinP} keyboardType='numeric'                  
                              onChangeText={(newP)=>{              
                                                newP = newP.split('$').join('');
                                                newP = newP.replace(/[-,.]/g,'');
                                                if(newP == '')
                                                  setTempMinP('');
                                                else
                                                  setTempMinP(`$${newP}`);        
                                               }}/>
                  </View> 

                  <Text className="buttonTextBlack">
                    Maximum:
                  </Text>

                  <View className={`border ${warning?'border-dangerBrightRed':'border-textBlack'} w-[30%] rounded-xl`}>
                    <TextInput value={tempMaxP} keyboardType='numeric'
                              onChangeText={(newP)=>{ 
                                              newP = newP.split('$').join('');
                                              newP = newP.replace(/[-,.]/g,'');
                                              if (newP == '')
                                                setTempMaxP('')
                                              else
                                                setTempMaxP(`$${newP}`);
                                            }}/>
                  </View> 

                </View>

                {warning&&<Text className="text-[10px] ml-[5%] buttonTextBlack text-dangerBrightRed mb-[-5%]">*Minimum cannot be over Maxmimum</Text>}
                
                <Text className="text-[20px] buttonTextBlack ml-[5%] mt-[2%] ">
                  Distance
                </Text>
                
                <View className="h-[10%] ml-[5%] mr-[5%] ">
                    <Text className="self-center">
                      {tempSliderValue==maxD?`${tempSliderValue}+`:tempSliderValue} mi
                    </Text>

                    <Slider
                          minimumValue={minD}
                          maximumValue={maxD}
                          minimumTrackTintColor="#3A5779"
                          maximumTrackTintColor="#9E9E9E"
                          thumbTintColor="#3A5779"
                          step={1}
                          value={tempSliderValue}
                          onValueChange={(newVal)=>{setTempSliderValue(newVal)}}
                      />

                    <View className="flex-row justify-between">
                      <Text >
                        {minD} mi
                      </Text>
                      <Text >
                        {maxD}+ mi
                      </Text> 
                    </View>
                </View>
                                 
            </View>

          </View>

          {/*Apply these filters only when apply button is pressed*/}
          <View className="items-end mt-[2%] mb-[2%] mr-[2%]">
            <NormalButton text="Apply" 
                  onClick={()=>{
                   let min = (tempMinP.split('$').join('')=='')?0: parseInt(tempMinP.split('$').join(''), 10);
                   let max = (tempMaxP.split('$').join('')=='')?0: parseInt(tempMaxP.split('$').join(''), 10);
                   if(min<=max)
                   {
                      setWarning(false);
                      if(isRelevanceActive || isOpenNowActive || isPopularActive 
                        || isRatingActive || tempMinP != ''|| tempMaxP != '' || tempSliderValue != maxD /2){
                        setisFiltersActive(true)
                      }
                      else{
                        setisFiltersActive(false)
                      }

                      //filter logic goes here

                      setIsRelevanceApplied(isRelevanceActive);
                      setIsOpenNowApplied(isOpenNowActive);
                      setIsPopularApplied(isPopularActive);
                      setIsRatingApplied(isRatingActive);
                      setminP(tempMinP);
                      setmaxP(tempMaxP);
                      setSliderValue(tempSliderValue);
                      setisFiltersModal(!isFiltersModal)
                    }
                    else
                      setWarning(true);
                  }}/>
                                
          </View>

        </Modal>
        
      </View>
   </SafeAreaView>
    
  );
}
