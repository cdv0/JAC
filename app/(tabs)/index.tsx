import { images } from "@/constants/images";
import Slider from '@react-native-community/slider';
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";
export default function Index() {

  //TODO create a string array of categories to filter
  const [categories, setCategories] = useState<string[]>([]);

  //#region helper functions
  const insertCategory= (newCategory:string) => {
    setCategories(arr =>[...arr, newCategory]);
  };

  const removeCategory = (Category:string) =>{
    setCategories(categories.filter(item => item!=Category));
  };
  //#endregion

  //use this to enter categories to filter
  const handleCategories = (flag:boolean, Category:string) => {
    if (flag)
      insertCategory(Category);
    else
      removeCategory(Category)
  }

  //#region constants
  const [isFiltersActive, setisFiltersActive] = useState(false);
  const [isFiltersModal, setisFiltersModal] = useState(false);

  //#region quick Filter
  
  //0 -> oil change, 1 -> tire, 2-> Smog, 3->Transmission, 4->Wheel
  const [quickFilterStates, setQuickFilterStates] = useState(Array(5).fill(false));

  const updateQuickFilterStates = (i:number, value:boolean) =>{
    setQuickFilterStates(arr => 
        arr.map((item, index) => (index === i)?value:item
        )
      );
  };
  //#endregion
  
  //#region services filter
  const [isServicesActive, setIsServicesActive] = useState(false);
  const [isServicesModal, setIsServicesModal] = useState(false);
  const [ActiveTab, setISActiveTab] = useState('1');

  const updateServices =(i:number, value:boolean, setFunc:React.Dispatch<React.SetStateAction<any[]>>) =>{
    setFunc(arr =>
      arr.map((item, index) =>(index ===i)?value:item)
    );
  };

  const [AC_Heat, setAC_Heat] = useState(Array(5).fill(false));
  const [Bat_Elec, setBat_Elec] = useState(Array(5).fill(false));
  const servicesView = (id:string) =>{
    switch(id){
      case '1':
        return(
          <View>
            <ScrollView className="gap-[5%]">
              <Text className={` ${AC_Heat[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(0, !AC_Heat[0], setAC_Heat)}}
              >
                AC recharge
              </Text>
              <Text className={` ${AC_Heat[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(1, !AC_Heat[1], setAC_Heat)}}
              >
                Compressor replacement
              </Text>
              <Text className={` ${AC_Heat[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(2, !AC_Heat[2], setAC_Heat)}}>
                Radiator service
              </Text>
              <Text className={` ${AC_Heat[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(3, !AC_Heat[3], setAC_Heat)}}>
                Heater Core repair
              </Text>
              <Text className={` ${AC_Heat[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(4, !AC_Heat[4], setAC_Heat)}}>
                Thermostat/water pump
              </Text>
            </ScrollView>
          </View>
        );   
      case '2':
        return(
          <ScrollView className="gap-[5%]">
            <Text className={` ${Bat_Elec[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateServices(0, !Bat_Elec[0], setBat_Elec)}}>
              Battery Replacement
            </Text>
            <Text className="buttonTextBlue w-full border-b py-[5%] border-stroke text-center">
              Alternator/Starter Repair
            </Text>
            <Text className="buttonTextBlue w-full border-b py-[5%] border-stroke text-center">
              Wiring & Fuses
            </Text>
            <Text className="buttonTextBlue w-full border-b py-[5%] border-stroke text-center">
               Check Engine Light Diagnostics
            </Text>
            <Text className="buttonTextBlue w-full border-b py-[5%] border-stroke text-center">
              Lighting/Electronics
            </Text>
          </ScrollView>
        );      
      default:
        return(
          <Text>
            Hello
          </Text>
        );
      
    }
  };
  //#endregion

  //#region expanded Filters
  //0-> relevance, 1-> open now, 2->popular, 3-> rating
  const [expFilterStates, setExpFilterStates] = useState(Array(4).fill(false));

  const updateExpFilterStates = (i:number, value:boolean) =>{
    setExpFilterStates(arr => 
        arr.map((item, index) => (index === i)?value:item
        )
      );
  };

  const [expFilterApplied, setExpFilterApplied] = useState(Array(4).fill(false));

  const updateExpFilterApplied = (i:number, value:boolean) =>{
    setExpFilterApplied(arr => 
        arr.map((item, index) => (index === i)?value:item
        )
      );
  };

  const [minP, setminP] = useState('');
  const [tempMinP, setTempMinP] = useState('');

  const [maxP, setmaxP] = useState('');
  const [tempMaxP, setTempMaxP] = useState('');
  const minD = 0;
  const maxD = 20;
  
  const [sliderValue, setSliderValue] = useState(maxD / 2); 
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
  const [warning, setWarning] = useState(false);
  
  const width= '45%';
  //#endregion
  
  //#endregion

  return (
   <SafeAreaView className="flex-1" edges={['right', 'top', 'left']}>
      <View
      className="flex-1 bg-white "
      >
        <View className="justify-center w-full h-[17%]">
          <images.searchBackground width="100%" height="100%" style={{ position: 'absolute', zIndex: 0 }} />
          <View className="ml-[50%]">
            <NormalButton onClick={()=>{router.push('/(tabs)/garage')}} text={"Enter Garage"}/>
          </View>
        </View > 
        <SearchBar placeholder1="Search" placeholder2="Location"/>
        <View >
          <ScrollView  horizontal={true} contentContainerStyle={{gap:10}} showsHorizontalScrollIndicator={false}>
            <NormalButton variant={`${isFiltersActive?`primary`:`outline`}`} onClick={()=>{setisFiltersModal(!isFiltersModal)}} text="Filters"/>
            <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setIsServicesModal(!isServicesModal)}} text="Services"/>
            <ToggleButton flag = {quickFilterStates[0]} onPress={(newf)=>{updateQuickFilterStates(0,newf)}} text="Oil Change" />
            <ToggleButton flag = {quickFilterStates[1]} onPress={(newf)=>{updateQuickFilterStates(1,newf)}} text="Tire Rotation"/>
            <ToggleButton flag = {quickFilterStates[2]} onPress={(newf)=>{updateQuickFilterStates(2, newf)}} text="Smog Check"/>
            <ToggleButton flag ={quickFilterStates[3]} onPress={(newf)=>{updateQuickFilterStates(3, newf)}} text="Transmission Repair"/>
            <ToggleButton flag = {quickFilterStates[4]} onPress={(newf)=>{updateQuickFilterStates(4, newf)}} text="Wheel Alignment"/>
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
                        updateExpFilterStates(0, expFilterApplied[0]);
                        updateExpFilterStates(1, expFilterApplied[1]);
                        updateExpFilterStates(2, expFilterApplied[2])
                        updateExpFilterStates(3, expFilterApplied[3]);
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
                  <ToggleButton width={width} text="Relevance" flag={expFilterStates[0]} onPress={(newf)=>{updateExpFilterStates(0, newf)}}/>
                  <ToggleButton width={width} text="Open Now" flag={expFilterStates[1]} onPress={(newf)=>{updateExpFilterStates(1,newf)}}/>
                </View>

                <View className="flex-row justify-between ml-[5%] mr-[5%] mt-[-2%]">
                  <ToggleButton width={width} text="Popular" flag={expFilterStates[2]} onPress={(newf)=>{updateExpFilterStates(2, newf)}}/>
                  <ToggleButton width={width} text="Rating" flag={expFilterStates[3]} onPress={(newf)=>{{updateExpFilterStates(3, newf)}}}/>
               
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
                   let min = (tempMinP.split('$').join('')=='')?null: parseInt(tempMinP.split('$').join(''), 10);
                   let max = (tempMaxP.split('$').join('')=='')?null: parseInt(tempMaxP.split('$').join(''), 10);
                   {/*TODO handle when min =='' and max!='' and vice versa*/}
                   if(min==null || max ==null ||min<=max)
                   {
                      setWarning(false);
                      if(expFilterStates.some(flag => flag) || tempMinP != ''|| tempMaxP != '' || tempSliderValue != maxD /2){
                        setisFiltersActive(true)
                      }
                      else{
                        setisFiltersActive(false)
                      }

                      //filter logic goes here

                      updateExpFilterApplied(0, expFilterStates[0]);
                      updateExpFilterApplied(1, expFilterStates[1]);
                      updateExpFilterApplied(2, expFilterStates[2]);
                      updateExpFilterApplied(3, expFilterStates[3]);
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

        {/*Expand Services*/}
        <Modal visible={isServicesModal}>
          <View className="flex-1">
              <View className="flex-row justify-between ml-[2%] mr-[2%] mt-[5%] mb-[5%]">
                <Text className="justify-start text-[25px] buttonTextBlack">
                  Services
                </Text>

                <Pressable 
                  onPress={()=> 
                    {
                      setIsServicesModal(!isServicesModal);
                    }}>
        
                    <View className="w-[35] items-center justify-center ">
                      <Text className="text-[25px] buttonTextBlack">
                        X
                      </Text>
                    </View>

                </Pressable>
              </View>

              <View className="flex-1 flex-row ">
                <View className="w-[30%]">
                  <ScrollView>
                    
                    <Text onPress={()=>{setISActiveTab('1')}} 
                        className={`bg ${ActiveTab == '1'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-t border-stroke`}
                        > A/C & Heating
                    </Text>
                    <Text onPress={()=>{setISActiveTab('2')}} 
                        className={`bg ${ActiveTab == '2'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Battery & Electrical
                    </Text>
                    <Text onPress={()=>{setISActiveTab('3')}} 
                        className={`bg ${ActiveTab == '3'?'bg-stroke':''} py-[15%]  buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Engine Services
                    </Text>
                    <Text onPress={()=>{setISActiveTab('4')}} 
                        className={`bg ${ActiveTab == '4'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Suspension & Steering
                    </Text>
                    <Text onPress={()=>{setISActiveTab('5')}} 
                        className={`bg ${ActiveTab == '5'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Brakes
                    </Text>
                    <Text onPress={()=>{setISActiveTab('6')}} 
                        className={`bg ${ActiveTab == '6'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Exhaust & Muffler
                    </Text>
                    <Text onPress={()=>{setISActiveTab('7')}} 
                        className={`bg ${ActiveTab == '7'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Tires & Wheels
                    </Text>
                    <Text onPress={()=>{setISActiveTab('8')}} 
                        className={`bg ${ActiveTab == '8'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Fluids
                    </Text>
                    <Text onPress={()=>{setISActiveTab('9')}} 
                        className={`bg ${ActiveTab == '9'?'bg-stroke':''} py-[15%] buttonTextBlack text-[15px] text-center border-b border-stroke`}
                        >Other
                    </Text>
                  </ScrollView>
                </View>
                

                <View className=" w-[70%] border-l border-t border-stroke">
                    {servicesView(ActiveTab)}
                    
                </View>
              </View>
            <View className="border border-stroke py-[2%]">
              <View className="self-end mr-[5%]">
                <NormalButton text="Apply" onClick={() => {}}/>
              </View>
            </View>
          </View>
        </Modal>
        
      </View>
   </SafeAreaView>
    
  );
}
