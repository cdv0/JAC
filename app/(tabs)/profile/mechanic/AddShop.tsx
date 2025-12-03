import NormalButton from '@/app/components/NormalButton';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ReactNativeModal as Modal } from 'react-native-modal';
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from 'react-native-safe-area-context';
interface props{
    visible:boolean
    onClose:()=> void
}

interface shop{
  name:string,
  address:string,
  hours:string[],
  ImageId:string | null,
  Location:number[] | null,
  shopPhone:string,
  Services:string[]
  Website:string,
  license: string| null;
}

type day ={
  start:string,
  end:string
};
type schedule = Record<string, day>;

const AddShop = ({visible, onClose}:props) => { 
  const phoneInput = useRef<PhoneInput>(null);
  const [shop, setShop] =useState<shop>({
          name:'',
          address:'',
          hours:['', '', '', '' , '', '', ''],
          ImageId: null,
          Location: null,
          shopPhone:'',
          Services:[],
          Website:'',
          license:null,
        })

  const reset = ()=>{
    setShop({
          name:'',
          address:'',
          hours:['', '', '', '' , '', '', ''],
          ImageId: null,
          Location: null,
          shopPhone:'',
          Services:[],
          Website:'',
          license: null
        })
  }
  const [days, setDays]= useState<schedule>({
      'Monday':{ start:'', end:''},
      'Tuesday':{ start:'', end:''},
      'Wednesday':{ start:'', end:''},
      'Thursday':{ start:'', end:''},
      'Friday':{ start:'', end:''},
      'Saturday':{ start:'', end:''},
      'Sunday':{ start:'', end:''},
    })
    
  useEffect(()=>{
    setDays({
    'Monday':{ start:'', end:''},
    'Tuesday':{ start:'', end:''},
    'Wednesday':{ start:'', end:''},
    'Thursday':{ start:'', end:''},
    'Friday':{ start:'', end:''},
    'Saturday':{ start:'', end:''},
    'Sunday':{ start:'', end:''},
    })
    }, [visible])

  const setHours = () =>{
 
    const [date, setDate] = useState(new Date()); 
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<string | null>(null);


    const showTimePicker = (target: string) => {
        setPickerTarget(target); // Set the target first
        setShowPicker(true);     // Then show the picker
    };

     const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (selectedDate && pickerTarget) {
            setDate(selectedDate);
            
            const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            
            // Use the pickerTarget state to determine which time to update
                const keys = pickerTarget.split('-')
                setDays(prevDays => ({
                ...prevDays,
                [keys[0]]: { 
                    ...prevDays[keys[0]], // Keep the other field's value (end if updating start, vice versa)
                    [keys[1]]: formattedTime, // Update ONLY the target field ('start' or 'end')
                }
            }));           
        }
            // Reset the target once selection is done/dismissed
        setPickerTarget(null); 
    }; 

    const render = (day:string) =>{
      return(
      <View className='flex-row ml-5 items-center'>
            <Text className='buttonTextBlack   text-l font-bold'>{day}: </Text>
            <Text className='buttonTextBlack   text-l '> From  </Text>
            <View className='flex-row border border-black rounded-xl'>
              <Pressable onPress={() => showTimePicker(`${day}-start`)}>
                <Text className='buttonTextBlack   text-l py-2 px-2'>
                  {days[day].start==""?"Enter Time":days[day].start}
                </Text>
              </Pressable>
            </View>
            <Text className='buttonTextBlack   text-l '> To  </Text>
            <View className='flex-row border border-black rounded-xl'>
              <Pressable onPress={() => showTimePicker(`${day}-end`)}>
                <Text className='buttonTextBlack   text-l py-2 px-2'>
                  {days[day].end==""?"Enter Time":days[day].end}
                </Text>
              </Pressable>
            </View>
        </View>
      )
    }

    return(
    <View>
      <Text className='buttonTextBlack   text-xl  mb-5'>Business Hours</Text>
        {Object.keys(days).map(x=> {return <View key={x} className='mb-5'>
          {render(x)}
        </View>})}

        {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date} // Use the internal Date state
                    mode="time" // We only need the time picker UI
                    is24Hour={false} 
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                />
            )}
    </View>
    )
    
  }
  const [query, setQuery] = useState('')
  const validServices = ['Smog Check', 'Transmission Repair', 'Oil Check', 'Exhaust']

  return (
    <Modal isVisible={visible} style={{flex:1, margin:0}} >
        <SafeAreaView className='w-full h-full bg-white' style={{alignSelf:'center'}}>
          <KeyboardAvoidingView className='flex-1' behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView contentContainerStyle={{ paddingBottom: 10, gap:10 }} showsVerticalScrollIndicator={false}>
              <Text className='buttonTextBlack  font-bold text-2xl self-center'>Add a shop</Text>
              <View className='w-[80%] ml-[10%] mt-[10%]'>
                {/*Add business Name*/}
                <Text className='buttonTextBlack   text-xl'>Business Name</Text>
                <TextInput value={shop.name} onChangeText={(newV) =>{setShop({...shop, name:newV})}} 
                  placeholder='Business Name' placeholderTextColor= "#9E9E9E"
                  className="buttonTextBlack  border border-stroke ml-[5%] mb-5"  />
                {/*Add business Address*/}
                <Text className='buttonTextBlack   text-xl'>Business Address</Text>
                <TextInput value={shop.address} onChangeText={(newV) =>{setShop({...shop, address:newV})}} 
                  placeholder='Business Address' placeholderTextColor= "#9E9E9E"
                  className=" buttonTextBlack  border border-stroke ml-[5%] mb-5"  />

                {/*Add business Website*/}
                <Text className='buttonTextBlack   text-xl'>Business Website</Text>
                <TextInput value={shop.Website} onChangeText={(newV) =>{setShop({...shop, Website:newV})}} 
                  placeholder='Business Website' placeholderTextColor= "#9E9E9E"
                  className=" buttonTextBlack  border border-stroke ml-[5%] mb-5"  />
                {/*Add business Phone*/}
                <Text className='buttonTextBlack   text-xl'>Business Phone</Text>
                <PhoneInput ref={phoneInput} layout="first" defaultCode='US' defaultValue={shop.shopPhone} 
                                                  onChangeText={(newV) =>{
                                                                          setShop({...shop, shopPhone:newV})}} 
                  placeholder='Business Phone' textInputProps={{
                  keyboardType: 'numeric',
                }} containerStyle={{marginBottom:5}}/>

                {/*Add business License*/}
                <Text className='buttonTextBlack   text-xl'>Business License</Text>
                <TextInput value={shop.license?shop.license:''} onChangeText={(newV) =>{setShop({...shop, license:newV})}} 
                  placeholder='Business License' placeholderTextColor= "#9E9E9E"
                  className=" buttonTextBlack  border border-stroke ml-[5%] mb-5"  />
                
                {/*Add hours*/}
                {setHours()}

                <Text className='buttonTextBlack   text-xl'>Services</Text>
                <View className='flex-row mx-[5%] justify-between'>
                  <TextInput value={query} onChangeText={(newV) =>{setQuery(newV)}}
                    placeholder='Add Services' placeholderTextColor= "#9E9E9E"
                    className=" buttonTextBlack  border border-stroke w-[65%]"  />
                  <NormalButton onClick={()=>{
                                              if(!shop.Services.includes(query) && validServices.find(x=> x.toLocaleLowerCase().localeCompare(query.toLocaleLowerCase())))
                                                setShop(prev=>({...prev, Services:[...prev.Services, query]}))
                                              }} text='Enter'/>
                </View>
              {/*Suggestion*/}
              {query.length>0 && <FlatList
                data={validServices.filter(x=> x.includes(query))}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={()=>{setQuery(item)}} className='ml-[5%] border border-stroke w-[59%]'>
                    <Text className='buttonTextBlack'>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
                ListEmptyComponent={<Text className='buttonTextBlack'>
                  No Result for {query}
                </Text>}
              /> }

              <View className='mt-[10]'>
                <FlatList
                  data={shop.Services}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View className='bg-lightBlueText  rounded-xl'>
                      <Text className='buttonTextWhite px-2'>
                        {item}
                      </Text>
                    </View>
                  )}
                  numColumns={4}
                  columnWrapperStyle={{gap:2}}
                  scrollEnabled={false}
                  ListEmptyComponent={<Text className='buttonTextBlack self-center'>
                    No Services Added
                  </Text>}
                />
              </View>
              
            </View>
        
            </ScrollView>
          </KeyboardAvoidingView>
          <View className='flex-row self-center gap-20'>
              <NormalButton text='Cancel' variant='cancel' onClick={()=>{reset();onClose();}} />
              <NormalButton text='Add' variant='lightBlue' onClick={()=>{
                                                                        //add ADD query here
                                                                        reset();
                                                                        onClose();}} />
          </View>        
        </SafeAreaView>
    </Modal>
  )
}

export default AddShop