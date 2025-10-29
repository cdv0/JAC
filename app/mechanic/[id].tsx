import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, DimensionValue, FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { SvgUri } from 'react-native-svg';
import NormalButton from '../components/NormalButton';


interface keyPair{
  [key:string]:string
};

interface MechanicViewProps {
    name: string,
    type: string,
    certified:boolean,
    rating: string,
    ratingsDist:string[],
    reviews: string,
    image: string,
    services: string[],
    additional_details: keyPair,
}

const Details = () => {
  const {id} = useLocalSearchParams();
 
  const [mechanic, setMechanic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  useEffect(() => {
            const data = async () => {
                try {
                    const file = await fetch("/local/dummy/data.json");
                    const mechanicsData = await file.json();
                    
                    const found = mechanicsData.mechanics.find((x:MechanicViewProps) =>x.name ===id)
                    setMechanic(found|| null)
                    
                } catch (error) {
                    console.error("Error loading mechanics data:", error);
                }
                finally{
                  setLoading(false)
                }
            }
            data();
        }, [id]);
  
  
  if (loading){
    return(
      <View className='items-center justify-center'>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  else if(!mechanic){
    return (
      <View>
        <Text>
          {id} could not be found
        </Text>
      </View>
    )
  }
  else{
    return(
      <SafeAreaView className='flex-1 bg-subheaderGray' edges={['right', 'bottom','left']}>
        {/* <View className='flex-1'> */}
        <ScrollView contentContainerStyle={{ paddingBottom: 60, gap:'1%' }}showsHorizontalScrollIndicator={false}>
              <View className='w-full bg-white flex-row pl-[5%] py-[5%]'>
                  {mechanic.image==''?(<images.defaultImage width={100} height={100} />):
                              <SvgUri  width={100} height={100} uri={mechanic.image}/>
                              }
                  <View className='ml-[5%] justify-center'>
                      <Text className='text-[25px] buttonTextBlack'>{mechanic.name}</Text>
                      <View className='flex-row'>
                        <Text>Ratings: </Text>
                        <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={parseFloat(mechanic.rating)}/>
                      </View>
                      <Text>Reviews: {mechanic.reviews}</Text>
                  </View>
                {mechanic.certified && <images.badge width={25} height={25} style={{marginTop:20, marginLeft:15}}/>}
              </View>

              <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
                  <Text className='text-[25px] buttonTextBlack mb-[5%] '> Services</Text>
                  <FlatList
                    className='mx-[5%] mb-[5%]'
                    data={more?mechanic.services:mechanic.services.slice(0,8)}
                    renderItem={({item})=> <Text className='flex-1 smallTextBlue'>{'\u2B24'} {item}</Text>}
                    numColumns={2}
                    initialNumToRender={2}
                    scrollEnabled={false}
                    columnWrapperClassName='gap-20 '
                    contentContainerClassName='gap-2'
                  />
                  {(!more && mechanic.services.length > 8) && <Text className='text-lightBlueText bold text-center' onPress={()=>{setMore(true)}}>show more...</Text>}
                  {(more && mechanic.services.length > 8) && <Text className='text-lightBlueText text-center' onPress={()=>{setMore(false)}}>show ...</Text>}           
              </View>

              {(Object.keys(mechanic.additional_details).length>0)&& 
                <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
                  <Text className='text-[25px] buttonTextBlack mb-[5%] ml-[2%]'>Additional Details</Text>
                  <View className='mx-[5%]'>
                    {'website' in mechanic.additional_details && 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Website: <Text className='buttonTextBlue'>{mechanic.additional_details['website']}</Text>
                          </Text>)}
                    {'phone' in mechanic.additional_details && 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Phone: <Text className='buttonTextBlue'>{mechanic.additional_details['phone']}</Text>
                          </Text>)}
                    {'address' in mechanic.additional_details && 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Address: <Text className='buttonTextBlue'>{mechanic.additional_details['address']}</Text>
                          </Text>)}
                    {'hours' in mechanic.additional_details && 
                      (      
                      <>
                        <Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Hours</Text>
                        <View className='mx-[5%] w-[50%]'>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Mon</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][0]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Tues</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][1]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Weds</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][2]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Thurs</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][3]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Fri</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][4]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Sat</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][5]}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Sun</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][6]}</Text>
                          </View>
                          
                        </View>
                      </>)}
                  </View>
                  
                </View>
              }
              <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%]'>
                <View className='items-center w-[30%] ml-[5%]'>
                      <Text className='text-center buttonTextBlack'>
                        Want to add a review?
                      </Text>
                      <StarRatingDisplay rating={0} color='black' starSize={20}/>
                </View>
                <View className='flex-1 justify-center'>
                  <NormalButton text='Log in!' onClick={()=>{}}/>
                </View>
                
              </View>
              
              <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%]'>
                <View className='items-center mt-[5%]'>
                  <Text className='buttonTextBlack mb-[5%]'>{mechanic.rating}</Text>
                  <StarRatingDisplay rating={parseFloat(mechanic.rating)} color='black' starSize={15}/>
                  <Text className='buttonTextBlack mt-[5%]'>{mechanic.reviews} reviews</Text>
                </View>
                <View className='items-center flex-1 mr-[2%]'> 
                    {mechanic.ratingsDist.map((percent:string, index:number) => (
                                
                        <View key={index} className='bg-stroke rounded-full w-full mb-[2%]'>
                            <Text className='bg-primaryBlue rounded-full' style={{width:`${percent}%` as DimensionValue}}/>
                         </View>
                     
                    ))
                    }    
                </View>
              </View>

              <View className='flex-row w-[95%] justify-between self-center '>
                <View className='flex-row border border-stroke rounded-full bg-white items-center '>
                    <icons.search/>
                    <TextInput className='w-[50%]'/>
                </View>
                <NormalButton text='Filter' onClick={()=> {}}/>
              </View>
                    
        </ScrollView>
      </SafeAreaView>
      
          
      
    )
  }
}

export default Details