import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MechanicView from '../components/MechanicView';
import NormalButton from "../components/NormalButton";
import SearchBar from "../components/SearchBar";
import ToggleButton from "../components/ToggleButton";


interface Mechanics {
    mechanicID: string,
    name: string,
    //rating: string,
    Image: string,
    Services: string,
    Certified:boolean,
    address:string,
    
}

export default function Index() {

  //TODO: Refactor filters
  const [categories, setCategories] = useState<string[]>([]);
  //#region helper functions
  const insertCategory= (newCategory:string) => {
    setCategories(arr =>[...arr, newCategory]);
  };

  const removeCategory = (Category:string) =>{
    setCategories(categories.filter(item => item!=Category));
  };

  const searchCondition = (n:string, l:string) => {
    return n.toLowerCase().includes(mQuery.toLowerCase()) && l.toLowerCase().includes(lQuery.toLowerCase());
  }

  const applyFilter = () =>{
    if(categories.length ==0){
      let temp = mechanics.filter(element=> searchCondition(element.name, element.address));
      return isCertified? temp.filter(x => x.Certified):temp;
    }
    else{
      let temp = mechanics.filter(element=>{
        return categories.every(cat=> element.Services.includes(cat)) && searchCondition(element.name, element.address);
      });
      return isCertified? temp.filter(x => x.Certified):temp;
    }
   
  }

  //#endregion

  //use this to enter categories to filter
  const handleCategories = (flag:boolean, Category:string) => {
    if (flag)
      insertCategory(Category.toLowerCase());
    else
      removeCategory(Category.toLowerCase())
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
                  const file = await fetch("/local/dummy/data2.json");
                  const mechanicsData = await file.json();    
                  const temp =  JSON.parse(mechanicsData.body).data as Mechanics[];    
                  temp.forEach((x:Mechanics)=>{
                     x.Services = x.Services.toLowerCase()
                  }) 
                  setMechanics(temp);
                  
                 
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
  const [isCertified, setIsCertified] = useState(false);
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
                    onPress={()=>{updateStates(0, !AC_Heat[0], setAC_Heat); handleCategories(!AC_Heat[0], "AC Recharge")}}
              >
                AC Recharge
              </Text>
              <Text className={` ${AC_Heat[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !AC_Heat[1], setAC_Heat); handleCategories(!AC_Heat[1], "Compressor Replacement")}}
              >
                Compressor Replacement
              </Text>
              <Text className={` ${AC_Heat[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !AC_Heat[2], setAC_Heat); handleCategories(!AC_Heat[2], "Radiator Service")}}>
                Radiator Service
              </Text>
              <Text className={` ${AC_Heat[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !AC_Heat[3], setAC_Heat); handleCategories(!AC_Heat[3], "Heater Core Repair")}}>
                Heater Core Repair
              </Text>
              <Text className={` ${AC_Heat[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !AC_Heat[4], setAC_Heat); handleCategories(!AC_Heat[4], "Thermostat/Water Pump")}}>
                Thermostat/Water Pump
              </Text>   
          </>
        );   
      case '2':
        return(
          <>
            <Text className={` ${Bat_Elec[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Bat_Elec[0], setBat_Elec); handleCategories(!Bat_Elec[0], "Battery Replacement");}}>
              Battery Replacement
            </Text>
            <Text className={` ${Bat_Elec[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Bat_Elec[1], setBat_Elec); handleCategories(!Bat_Elec[1], "Alternator/Starter Repair")}}>
              Alternator/Starter Repair
            </Text>
            <Text className={` ${Bat_Elec[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Bat_Elec[2], setBat_Elec); handleCategories(!Bat_Elec[2], "Wiring & Fuses")}}>
              Wiring & Fuses
            </Text>
            <Text className={` ${Bat_Elec[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Bat_Elec[3], setBat_Elec); handleCategories(!Bat_Elec[3], "Radio")}}>
               Radio
            </Text>
            <Text className={` ${Bat_Elec[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Bat_Elec[4], setBat_Elec); handleCategories(!Bat_Elec[4], "Lighting")}}>
              Lighting
            </Text>
          </>
        );     
      case '3':
        return(
          <>
            <Text className={` ${Eng_Serv[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Eng_Serv[0], setEng_Serv); handleCategories(!Eng_Serv[0], "Engine Diagnostics/Check Engine lights")}}>
              Engine Diagnostics/Check Engine lights
            </Text>
            <Text className={` ${Eng_Serv[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Eng_Serv[1], setEng_Serv); handleCategories(!Eng_Serv[1], "Engine Repair")}}>
              Engine Repair
            </Text>
            <Text className={` ${Eng_Serv[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Eng_Serv[2], setEng_Serv); handleCategories(!Eng_Serv[2], "Ignition System")}}>
              Ignition System
            </Text>
            <Text className={` ${Eng_Serv[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Eng_Serv[3], setEng_Serv); handleCategories(!Eng_Serv[3], "Fuel System")}}>
              Fuel System
            </Text>
            <Text className={` ${Eng_Serv[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Eng_Serv[4], setEng_Serv); handleCategories(!Eng_Serv[4], "Engine Performance Check")}}>
              Engine Performance Check
            </Text>
          </>
        );
      case '4':
        return(
          <>
            <Text className={` ${Suspen_Steer[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Suspen_Steer[0], setSuspen_Steer); handleCategories(!Suspen_Steer[0], "Steering Wheel adjustment")}}>
              Steering Wheel Adjustment
            </Text>
            <Text className={` ${Suspen_Steer[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Suspen_Steer[1], setSuspen_Steer); handleCategories(!Suspen_Steer[1], "Shock and Strut Replacement")}}>
              Shock and Strut Replacement
            </Text>
            <Text className={` ${Suspen_Steer[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Suspen_Steer[2], setSuspen_Steer); handleCategories(!Suspen_Steer[2], "Power Streering Repair")}}>
              Power Streering Repair
            </Text>
            <Text className={` ${Suspen_Steer[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Suspen_Steer[3], setSuspen_Steer); handleCategories(!Suspen_Steer[3], "Steering/Suspension Component Replacement")}}>
              Steering/Suspension Component Replacement
            </Text>
          </>
        );
      case '5':
        return(
          <>
            <Text className={` ${Brakes[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Brakes[0], setBrakes); handleCategories(!Brakes[0], "Brake Pad Replacement")}}>
              Brake Pad Replacement
            </Text>
            <Text className={` ${Brakes[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Brakes[1], setBrakes); handleCategories(!Brakes[1], "Rotor and Drum Replacement")}}>
              Rotor and Drum Replacement
            </Text>
            <Text className={` ${Brakes[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Brakes[2], setBrakes); handleCategories(!Brakes[2], "Brake Caliper")}}>
              Brake Caliper
            </Text>
            <Text className={` ${Brakes[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Brakes[3], setBrakes); handleCategories(!Brakes[3], "Anti-Lock Braking Diagnostics and Repair")}}>
              Anti-Lock Braking Diagnostics and Repair
            </Text>
            <Text className={` ${Brakes[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Brakes[4], setBrakes); handleCategories(!Brakes[4], "Parking/Emergency Brake Repair")}}>
              Parking/Emergency Brake Repair
            </Text>
          </>
        );
      case '6':
        return(
          <>
            <Text className={` ${Exh_Muff[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Exh_Muff[0], setExh_Muff); handleCategories(!Exh_Muff[0], "Muffler Replacement")}}>
              Muffler Replacement
            </Text>
            <Text className={` ${Exh_Muff[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Exh_Muff[1], setExh_Muff); handleCategories(!Exh_Muff[1], "Catalytic Converter Replacement")}}>
              Catalytic Converter Replacement
            </Text>
            <Text className={` ${Exh_Muff[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Exh_Muff[2], setExh_Muff); handleCategories(!Exh_Muff[2], "Exhaust Pipe Repair")}}>
              Exhaust Pipe Repair
            </Text>
            <Text className={` ${Exh_Muff[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Exh_Muff[3], setExh_Muff); handleCategories(!Exh_Muff[3], "Exhaust Pipe Replacement")}}>
              Exhaust Pipe Replacement
            </Text>
          </>
        );
      case '7':
        return(
          <>
            <Text className={` ${Tires[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Tires[0], setTires); handleCategories(!Tires[0], "Tire Rotation")}}>
              Tire Rotation
            </Text>
            <Text className={` ${Tires[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Tires[1], setTires); handleCategories(!Tires[1], "Tire Repair")}}>
              Tire Repair
            </Text>
            <Text className={` ${Tires[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Tires[2], setTires); handleCategories(!Tires[2], "Tire Replacement")}}>
              Tire Replacement
            </Text>
            <Text className={` ${Tires[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Tires[3], setTires); handleCategories(!Tires[3], "Tire Rim Repair")}}>
              Tire Rim Repair
            </Text>
          </>
        );
      case '8':
        return(
          <>
            <Text className={` ${Fluids[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(0, !Fluids[0], setFluids); handleCategories(!Fluids[0], "Oil/Filter Replacement")}}>
              Oil/Filter Replacement
            </Text>
            <Text className={` ${Fluids[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(1, !Fluids[1], setFluids); handleCategories(!Fluids[1], "Coolant Replacement")}}>
              Coolant Replacement
            </Text>
            <Text className={` ${Fluids[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Fluids[2], setFluids); handleCategories(!Fluids[2], "Transmission Fluid Replacement")}}>
             Transmission Fluid Replacement
            </Text>
            <Text className={` ${Fluids[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Fluids[3], setFluids); handleCategories(!Fluids[3], "Power Steering Fluid Replacement")}}>
             Power Steering Fluid Replacement
            </Text>
            <Text className={` ${Fluids[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Fluids[4], setFluids); handleCategories(!Fluids[4], "Brake Fluid Replacement")}}>
              Brake Fluid Replacement
            </Text>
            <Text className={` ${Fluids[5]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(5, !Fluids[5], setFluids); handleCategories(!Fluids[5], "Differential Fluid Replacement")}}>
              Differential Fluid Replacement
            </Text>
          </>
        );
      case '9':
        return(
          <>
            <Text className={` ${Other[0]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                      onPress={()=>{updateStates(0, !Other[0], setOther); handleCategories(!Other[0], "Emission Check")}}>
              Emission Check
            </Text>
            <Text className={` ${Other[1]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                      onPress={()=>{updateStates(1, !Other[1], setOther); handleCategories(!Other[1], "SeatBelt Replacement")}}>
              SeatBelt Replacement
            </Text>
            <Text className={` ${Other[2]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(2, !Other[2], setOther); handleCategories(!Other[2], "Door Handle Replacement")}}>
              Door Handle Replacement
            </Text>
            <Text className={` ${Other[3]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(3, !Other[3], setOther); handleCategories(!Other[3], "Wiper Replacement")}}>
              Wiper Replacement
            </Text>
            <Text className={` ${Other[4]?'buttonTextWhite bg-primaryBlue':'buttonTextBlue'} w-full border-b-[2px] py-[5%] border-stroke text-center`}
                    onPress={()=>{updateStates(4, !Other[4], setOther); handleCategories(!Other[4], "Seat Replacement")}}>
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
  const [sortOpt, setSortOpt] = useState('0');
  const [sortOptApplied, setSortOptApplied] = useState('0');
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
        <SearchBar placeholder1="Search" value1={mQuery} onChangeText1={(newV)=>{setMQuery(newV)}}
                    placeholder2="Location" value2={lQuery} onChangeText2={(newL)=>{setLQuery(newL)}}/>
        <View >
          <ScrollView  horizontal={true} contentContainerStyle={{gap:10}} showsHorizontalScrollIndicator={false}>
            <NormalButton variant={`${isFiltersActive?`primary`:`outline`}`} onClick={()=>{setisFiltersModal(!isFiltersModal)}} text="Filters"/>
            <NormalButton variant={`${isServicesActive?`primary`:`outline`}`} onClick={()=>{setIsServicesModal(!isServicesModal)}} text="Services"/>
            <ToggleButton flag = {isCertified} onPress={(newf)=>{setIsCertified(newf)}} text="Certified"/>
            <ToggleButton flag = {quickFilterStates[0]} onPress={(newf)=>{
                                                                            updateStates(0, newf, setQuickFilterStates); 
                                                                            handleCategories(newf, "Oil Change");
                                                                            }} text="Oil Change" />
            <ToggleButton flag = {quickFilterStates[1]} onPress={(newf)=>{
                                                                            updateStates(1, newf, setQuickFilterStates);
                                                                            handleCategories(newf, "Tire Rotation");
                                                                            }} text="Tire Rotation"/>
            <ToggleButton flag = {quickFilterStates[2]} onPress={(newf)=>{
                                                                            updateStates(2, newf, setQuickFilterStates);
                                                                            handleCategories(newf, "Smog Check");
                                                                            }} text="Smog Check"/>
            <ToggleButton flag ={quickFilterStates[3]} onPress={(newf)=>{
                                                                            updateStates(3, newf, setQuickFilterStates);
                                                                            handleCategories(newf, "Transmission Repair");
                                                                            }} text="Transmission Repair"/>
            <ToggleButton flag = {quickFilterStates[4]} onPress={(newf)=>{
                                                                            updateStates(4, newf, setQuickFilterStates)
                                                                            handleCategories(newf, "Wheel Alignment");
                                                                            }} text="Wheel Alignment"/>
          </ScrollView>
        </View>
        
        
        <Text className="text-2xl mt-5 ml-5 mb-5">Find Nearby</Text>
        <View style={{flex:1}}>
            <FlatList
                      
                data={applyFilter()}
                keyExtractor={(item) => item.mechanicID}
                numColumns={2}
                renderItem={({item})=> <MechanicView {...item}/>}
                contentContainerStyle={{alignItems:'center'}}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text>No Mechanics found</Text>}
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
                        setSortOpt(sortOptApplied);
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
                  <ToggleButton width={width} text="Relevance" flag={sortOpt == '1'} onPress={(newf)=>{newf?setSortOpt('1'):setSortOpt('0')}}/>
                  <ToggleButton width={width} text="Open Now" flag={sortOpt == '2'} onPress={(newf)=>{newf?setSortOpt('2'):setSortOpt('0')}}/>
                </View>

                <View className="flex-row justify-between ml-[5%] mr-[5%] mt-[-2%]">
                  <ToggleButton width={width} text="Popular" flag={sortOpt == '3'} onPress={(newf)=>{newf?setSortOpt('3'):setSortOpt('0')}}/>
                  <ToggleButton width={width} text="Rating" flag={sortOpt == '4'} onPress={(newf)=>{newf?setSortOpt('4'):setSortOpt('0')}}/>
               
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
                      if(sortOpt !='0' || tempMinP != ''|| tempMaxP != '' || tempSliderValue != maxD /2){
                        setisFiltersActive(true)
                      }
                      else{
                        setisFiltersActive(false)
                      }

                      //filter logic goes here

                      setSortOptApplied(sortOpt);
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
