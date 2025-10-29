import { images } from '@/constants/images';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { SvgUri } from 'react-native-svg';

interface keyPair{
  [key:string]:string
};

interface MechanicViewProps {
    name: string,
    type: string,
    rating: string,
    reviews: string,
    image: string,
    services: string[],
    additional_details: keyPair
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
      <SafeAreaView className='flex-1'>
        <View className='flex-1'>
        <ScrollView contentContainerClassName='gap-[2%]'>
              <View className='w-full bg-white flex-row pl-[5%] py-[5%]'>
                  {mechanic.image==''?(<images.defaultImage width={100} height={100} />):
                              <SvgUri  width={100} height={100} uri={mechanic.image}/>
                              }
                  <View className='ml-[5%] justify-center'>
                      <Text className='buttonTextBlack'>{mechanic.name}</Text>
                      <View className='flex-row'>
                        <Text>Ratings: </Text>
                        <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={parseFloat(mechanic.rating)}/>
                      </View>
                      <Text>Reviews: {mechanic.reviews}</Text>
                  </View>
              </View>

              <View className='w-[95%] bg-white rounded-xl self-center py-[5%]'>
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
                <View className='w-[95%] bg-white rounded-xl self-center '>
                  <Text className='text-[25px] buttonTextBlack mb-[5%] ml-[2%]'>Additional Details</Text>
                  <View className='mx-[5%] gap-[5%] '>
                    {'website' in mechanic.additional_details && 
                        (<Text className='smallTextBlue'>{'\u2B24'} Website: <Text className='buttonTextBlue'>{mechanic.additional_details['website']}</Text>
                          </Text>)}
                    {'phone' in mechanic.additional_details && 
                        (<Text className='smallTextBlue'>{'\u2B24'} Phone: <Text className='buttonTextBlue'>{mechanic.additional_details['phone']}</Text>
                          </Text>)}
                    {'address' in mechanic.additional_details && 
                        (<Text className='smallTextBlue'>{'\u2B24'} Address: <Text className='buttonTextBlue'>{mechanic.additional_details['address']}</Text>
                          </Text>)}
                    {/* {'hours' in mechanic.additional_details && 
                      (
                        
                      <View>
                        <Text className='smallTextBlue'>{'\u2B24'} Hours</Text>
                        <View className='m-[5%] w-[50%] gap-[5%]'>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Mon</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][0]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Tues</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][1]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Weds</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][2]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Thurs</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][3]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Fri</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][4]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Sat</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][5]}</Text>
                          </View>
                          <View className='flex-row justify-between'>
                            <Text className='buttonTextBlue'>Sun</Text>
                            <Text className='buttonTextBlue'>{mechanic.additional_details['hours'][6]}</Text>
                          </View>
                          
                        </View>
                      </View>)} */}
                  </View>
                  
                </View>
              }

              <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%]'>
                <View className='items-center'>
                  <Text className='buttonTextBlack mb-[5%]'>{mechanic.rating}</Text>
                  <StarRatingDisplay rating={parseFloat(mechanic.rating)} color='black' starSize={15}/>
                  <Text className='buttonTextBlack mt-[5%]'>{mechanic.reviews} reviews</Text>
                </View>
              </View>
 
        </ScrollView>
      </View>
      </SafeAreaView>
      
          
      
    )
  }
}

export default Details