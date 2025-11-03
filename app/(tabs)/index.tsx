import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MechanicView from "../components/MechanicView";
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";

export default function Index() {

  //TODO: Apply filtering
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
  };

  const updateStates =(i:number, value:boolean, setFunc:React.Dispatch<React.SetStateAction<any[]>>) =>{
    setFunc(arr =>
      arr.map((item, index) =>(index ===i)?value:item)
    );
  };

  //#region constants
  const [mechanics, setMechanics] = useState<any[]>([]);
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
      
  const [mQuery, setMQuery] = useState('');
  const [lQuery, setLQuery] = useState('');
  const [isFiltersModal, setisFiltersModal] = useState(false);

  const [isFiltersActive, setisFiltersActive] = useState(false);
  const width= '45%';//for toggle button

  //#region quick Filter
  //0 -> oil change, 1 -> tire, 2-> Smog, 3->Transmission, 4->Wheel
  const [quickFilterStates, setQuickFilterStates] = useState(Array(5).fill(false));

  //#endregion
  

  //#region services filter
  const [isServicesActive, setIsServicesActive] = useState(false);
  const [isServicesModal, setIsServicesModal] = useState(false);
  const [ActiveTab, setISActiveTab] = useState('1');

  const [AC_Heat, setAC_Heat] = useState(Array(5).fill(false));
  const [Bat_Elec, setBat_Elec] = useState(Array(5).fill(false));
  const [Eng_Serv, setEng_Serv] = useState(Array(5).fill(false));
  const [Suspen_Steer, setSuspen_Steer] = useState(Array(4).fill(false));
  const [Brakes, setBrakes] = useState(Array(5).fill(false));
  const [Exh_Muff, setExh_Muff] = useState(Array(4).fill(false));
  const [Tires, setTires] = useState(Array(4).fill(false));
  const [Fluids, setFluids] = useState(Array(6).fill(false));
  const [Other, setOther] = useState(Array(5).fill(false));

  //Render the sub-categories depending on the current main-category viewed
  const servicesView = (id:string) =>{
    switch(id){
      case '1':
        return(
          <>
              <Text className={` ${AC_Heat[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !AC_Heat[0], setAC_Heat)}}
              >
                AC recharge
              </Text>
              <Text className={` ${AC_Heat[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !AC_Heat[1], setAC_Heat)}}
              >
                Compressor replacement
              </Text>
              <Text className={` ${AC_Heat[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !AC_Heat[2], setAC_Heat)}}>
                Radiator service
              </Text>
              <Text className={` ${AC_Heat[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !AC_Heat[3], setAC_Heat)}}>
                Heater Core repair
              </Text>
              <Text className={` ${AC_Heat[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !AC_Heat[4], setAC_Heat)}}>
                Thermostat/water pump
              </Text>   
          </>
        );   
      case '2':
        return(
          <>
            <Text className={` ${Bat_Elec[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Bat_Elec[0], setBat_Elec)}}>
              Battery Replacement
            </Text>
            <Text className={` ${Bat_Elec[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Bat_Elec[1], setBat_Elec)}}>
              Alternator/Starter Repair
            </Text>
            <Text className={` ${Bat_Elec[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Bat_Elec[2], setBat_Elec)}}>
              Wiring & Fuses
            </Text>
            <Text className={` ${Bat_Elec[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Bat_Elec[3], setBat_Elec)}}>
               Radio
            </Text>
            <Text className={` ${Bat_Elec[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Bat_Elec[4], setBat_Elec)}}>
              Lighting
            </Text>
          </>
        );     
      case '3':
        return(
          <>
            <Text className={` ${Eng_Serv[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Eng_Serv[0], setEng_Serv)}}>
              Engine Diagnosts/Check Engine lights
            </Text>
            <Text className={` ${Eng_Serv[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Eng_Serv[1], setEng_Serv)}}>
              Engine Repair
            </Text>
            <Text className={` ${Eng_Serv[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Eng_Serv[2], setEng_Serv)}}>
              Ignition System
            </Text>
            <Text className={` ${Eng_Serv[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Eng_Serv[3], setEng_Serv)}}>
              Fuel System
            </Text>
            <Text className={` ${Eng_Serv[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Eng_Serv[4], setEng_Serv)}}>
              Engine Performance Check
            </Text>
          </>
        );
      case '4':
        return(
          <>
            <Text className={` ${Suspen_Steer[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Suspen_Steer[0], setSuspen_Steer)}}>
              Steering Wheel adjustment
            </Text>
            <Text className={` ${Suspen_Steer[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Suspen_Steer[1], setSuspen_Steer)}}>
              Shock and Strut replacement
            </Text>
            <Text className={` ${Suspen_Steer[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Suspen_Steer[2], setSuspen_Steer)}}>
              Power Streering repair
            </Text>
            <Text className={` ${Suspen_Steer[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Suspen_Steer[3], setSuspen_Steer)}}>
              Steering/Suspension Component Replacement
            </Text>
          </>
        );
      case '5':
        return(
          <>
            <Text className={` ${Brakes[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Brakes[0], setBrakes)}}>
              Brake Pad Replacement
            </Text>
            <Text className={` ${Brakes[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Brakes[1], setBrakes)}}>
              Rotor and drum replacement
            </Text>
            <Text className={` ${Brakes[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Brakes[2], setBrakes)}}>
              Brake caliper
            </Text>
            <Text className={` ${Brakes[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Brakes[3], setBrakes)}}>
              Anti-Lock Braking Diagnostics and Repair
            </Text>
            <Text className={` ${Brakes[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Brakes[4], setBrakes)}}>
              Parking/Emergency Brake Repair
            </Text>
          </>
        );
      case '6':
        return(
          <>
            <Text className={` ${Exh_Muff[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Exh_Muff[0], setExh_Muff)}}>
              Muffler Replacement
            </Text>
            <Text className={` ${Exh_Muff[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Exh_Muff[1], setExh_Muff)}}>
              Catalytic Converter Replacement
            </Text>
            <Text className={` ${Exh_Muff[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Exh_Muff[2], setExh_Muff)}}>
              Exhaust Pipe Repair
            </Text>
            <Text className={` ${Exh_Muff[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Exh_Muff[3], setExh_Muff)}}>
              Exhaust Pipe Alignment
            </Text>
          </>
        );
      case '7':
        return(
          <>
            <Text className={` ${Tires[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Tires[0], setTires)}}>
              Tire rotation
            </Text>
            <Text className={` ${Tires[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Tires[1], setTires)}}>
              Tire Repair
            </Text>
            <Text className={` ${Tires[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Tires[2], setTires)}}>
              Tire Replacement
            </Text>
            <Text className={` ${Tires[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Tires[3], setTires)}}>
              Tire Rim Repair
            </Text>
          </>
        );
      case '8':
        return(
          <>
            <Text className={` ${Fluids[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Fluids[0], setFluids)}}>
              Oil/Filter Replacement
            </Text>
            <Text className={` ${Fluids[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Fluids[1], setFluids)}}>
              Coolant Replacement
            </Text>
            <Text className={` ${Fluids[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Fluids[2], setFluids)}}>
             Transmission Replacement
            </Text>
            <Text className={` ${Fluids[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Fluids[3], setFluids)}}>
             Power Steering Fluid Replacement
            </Text>
            <Text className={` ${Fluids[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Fluids[4], setFluids)}}>
              Brake Fluid Replacement
            </Text>
            <Text className={` ${Fluids[5]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(5, !Fluids[5], setFluids)}}>
              Differential Fluid Replacement
            </Text>
          </>
        );
      case '9':
        return(
          <>
            <Text className={` ${Other[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                      onPress={()=>{updateStates(0, !Other[0], setOther)}}>
              Emission Check
            </Text>
            <Text className={` ${Other[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                      onPress={()=>{updateStates(1, !Other[1], setOther)}}>
              SeatBelt Replacement
            </Text>
            <Text className={` ${Other[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Other[2], setOther)}}>
              Door Handle Replacement
            </Text>
            <Text className={` ${Other[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Other[3], setOther)}}>
              Wiper Replacement
            </Text>
            <Text className={` ${Other[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Other[4], setOther)}}>
              Seat Replacement
            </Text>
          </>    
        );
        default:
          return(
            <Text>
              This should not be seen
            </Text>
          ); 
    }
  };
  //#endregion

  //#region expanded Filters
  //0-> relevance, 1-> open now, 2->popular, 3-> rating
  const [expFilterStates, setExpFilterStates] = useState(Array(4).fill(false));
  const [expFilterApplied, setExpFilterApplied] = useState(Array(4).fill(false));

  const [minP, setminP] = useState('');
  const [tempMinP, setTempMinP] = useState('');

  const [maxP, setmaxP] = useState('');
  const [tempMaxP, setTempMaxP] = useState('');
  const minD = 0;
  const maxD = 20;
  
  const [sliderValue, setSliderValue] = useState(maxD / 2); 
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
  const [warning, setWarning] = useState(false);
  
  //#endregion
  
  //#endregion

  return (
   <SafeAreaView className="flex-1" edges={['right', 'top', 'left']}>
      <View
      className="flex-1 bg-white "
      >
        <View className="justify-center w-full h-[18%]">
        
          <ImageBackground source={require("@/public/assets/images/test.png")} imageStyle={{width:'auto', height: 140 , marginTop:-60}} resizeMode='cover'>
            <View className='items-end mr-[5%]'>
               <NormalButton onClick={()=>{router.push('/(tabs)/garage')}} text={"Enter Garage"}/>
            </View>
           
          </ImageBackground>
          
        </View > 
        <SearchBar placeholder1="Search" value1={mQuery} 
                    placeholder2="Location" value2={lQuery} />
        <View >
          <ScrollView  horizontal={true} contentContainerStyle={{gap:10}} showsHorizontalScrollIndicator={false}>
            <NormalButton variant={`${isFiltersActive?`primary`:`outline`}`} onClick={()=>{setisFiltersModal(!isFiltersModal)}} text="Filters"/>
            <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setIsServicesModal(!isServicesModal)}} text="Services"/>
            <ToggleButton flag = {quickFilterStates[0]} onPress={(newf)=>{updateStates(0, newf, setQuickFilterStates)}} text="Oil Change" />
            <ToggleButton flag = {quickFilterStates[1]} onPress={(newf)=>{updateStates(1, newf, setQuickFilterStates)}} text="Tire Rotation"/>
            <ToggleButton flag = {quickFilterStates[2]} onPress={(newf)=>{updateStates(2, newf, setQuickFilterStates)}} text="Smog Check"/>
            <ToggleButton flag ={quickFilterStates[3]} onPress={(newf)=>{updateStates(3, newf, setQuickFilterStates)}} text="Transmission Repair"/>
            <ToggleButton flag = {quickFilterStates[4]} onPress={(newf)=>{updateStates(4, newf, setQuickFilterStates)}} text="Wheel Alignment"/>
          </ScrollView>
        </View>
        
        
        <Text className="text-2xl mt-5 ml-5 mb-5">Find Nearby</Text>
        
        <View style={{flex:1}}>
            <FlatList
                      
                data={mechanics}
                keyExtractor={(item) => item.name}
                numColumns={2}
                renderItem={({item})=> <MechanicView {...item}/>}
                columnWrapperStyle={{justifyContent:'space-between'}}
                contentContainerStyle={{flexGrow:1, alignItems:'center'}}
                showsVerticalScrollIndicator={false}
              />
        </View>
          
       
        


        {/*Expand filters */}
        <Modal visible={isFiltersModal} className='flex-1'>
          <View className={`flex-1 ${Platform.OS=='ios'?'mt-[10%]':''}`}>
              <View className="flex-row justify-between ml-[2%] mr-[2%] mt-[5%] mb-[5%]">
                  <Text className="justify-start text-2xl buttonTextBlack">
                    Filters
                  </Text>

                  <Pressable 
                    onPress={()=> 
                      {
                        //undo the changes
                        updateStates(0, expFilterApplied[0], setExpFilterStates) 
                        updateStates(1, expFilterApplied[1], setExpFilterStates);
                        updateStates(2, expFilterApplied[2], setExpFilterStates)
                        updateStates(3, expFilterApplied[3], setExpFilterStates);
                        setTempMinP(minP);
                        setTempMaxP(maxP);
                        setWarning(false);
                        setTempSliderValue(sliderValue);
                        setisFiltersModal(!isFiltersModal);
                      }}>
          
                      <View className="w-[35] items-center justify-center ">
                        <Text className="text-2xl buttonTextBlack">
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
                  <ToggleButton width={width} text="Relevance" flag={expFilterStates[0]} onPress={(newf)=>{updateStates(0, newf, setExpFilterStates)}}/>
                  <ToggleButton width={width} text="Open Now" flag={expFilterStates[1]} onPress={(newf)=>{updateStates(1, newf, setExpFilterStates)}}/>
                </View>

                <View className="flex-row justify-between ml-[5%] mr-[5%] mt-[-2%]">
                  <ToggleButton width={width} text="Popular" flag={expFilterStates[2]} onPress={(newf)=>{updateStates(2, newf, setExpFilterStates)}}/>
                  <ToggleButton width={width} text="Rating" flag={expFilterStates[3]} onPress={(newf)=>{updateStates(3, newf, setExpFilterStates)}}/>
               
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
                                                //newP = newP.split('$').join('');
                                                newP = newP.replace(/[^0-9]/g,'');
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
                                              //newP = newP.split('$').join('');
                                              newP = newP.replace(/[^0-9]/g,'');
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

                      updateStates(0, expFilterStates[0], setExpFilterApplied);
                      updateStates(1, expFilterStates[1], setExpFilterApplied);
                      updateStates(2, expFilterStates[2], setExpFilterApplied);
                      updateStates(3, expFilterStates[3], setExpFilterApplied);
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
        <Modal visible={isServicesModal} className='flex-1'>
          <View className={`flex-1 ${Platform.OS=='ios'?'mt-[10%]':''}`}>
              <View className="flex-row justify-between ml-[2%] mr-[2%] mt-[5%] mb-[5%]">
                <Text className="justify-start text-2xl buttonTextBlack">
                  Services
                </Text>

                <Pressable 
                  onPress={()=> 
                    {
                      setIsServicesActive(AC_Heat.some(x =>x) || 
                        Bat_Elec.some(x=>x) || Eng_Serv.some(x=>x) || Suspen_Steer.some(x=>x) || Brakes.some(x=>x)||
                        Exh_Muff.some(x=>x)|| Tires.some(x=>x) || Fluids.some(x=>x) || Other.some(x=>x))
                      setIsServicesModal(!isServicesModal);
                    }}>
        
                    <View className="w-[35] items-center justify-center ">
                      <Text className="text-2xl buttonTextBlack">
                        X
                      </Text>
                    </View>

                </Pressable>
              </View>

              <View className="flex-1 flex-row ">
                <View className="w-[30%]">
                  <ScrollView showsHorizontalScrollIndicator={false}>
                    
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
                    <ScrollView className="gap-[5%]" showsHorizontalScrollIndicator={false}>
                      {servicesView(ActiveTab)}    
                    </ScrollView> 
                </View>
              </View>
          </View>
        </Modal>
        
      </View>
   </SafeAreaView>
    
  );
}
