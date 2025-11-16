import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, DimensionValue, FlatList, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Float } from 'react-native/Libraries/Types/CodegenTypesNamespace';
import NormalButton from '../components/NormalButton';
import TimeConverter from '../components/TimeConverter';
import ViewReviews from '../components/ViewReviews';



interface MechanicViewProps {
    mechanicID: string,
    name: string,
    Certified:boolean,
    Review: string,
    Image: string,
    Services: string,
    Hours: string[],
    address: string,
    Website: string,
    Phone: string,
    
}

type ReviewProps ={
    MechanicId:string,
    Rating: number,
}

const Details = () => {
  const {id} = useLocalSearchParams();
 
  const [mechanic, setMechanic] = useState<any>(null);
  const[reviews, setReviews] = useState<any[]>([])
  const [ratingCount, setRatingCount] = useState<any[]>([])
  const [reviewAVG, setreviewAVG] = useState<Float>(0);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  useEffect(() => {
            const data = async () => {
                try {
                    const file = await fetch("/local/dummy/data2.json");
                    const mechanicsData = await file.json();
                    const found = JSON.parse(mechanicsData.body).data.find((x:MechanicViewProps) =>x.mechanicID ===id)
                    setMechanic(found|| null)
                    if (!mechanic){
                      const file2 = await fetch("/local/dummy/review.json");
                      const reviewData = await file2.json();
                      const reviews = JSON.parse(reviewData.body).filter((x:ReviewProps) =>x.MechanicId === id) as ReviewProps[]
                      setReviews(reviews || [])     
                      let sum = 0;
                      reviews.forEach(x=>{
                          sum+=x.Rating
                      })
                      setreviewAVG(sum/reviews.length)  
                  }
                    
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
    const servicesData = mechanic.Services.split(',').map( (item:string) => item.trim());
    const condition = (mechanic.Hours.length > 0) || (mechanic.address != '') || (mechanic.Website != '') || (mechanic.Phone !='');
    const temp = reviews.reduce((acc, curr)=>{
                        const val = String(Math.round(curr['Rating']))
                        acc[val] = (acc[val] || 0) + 1
                        return acc
                      }, {'1': 0,'2': 0,'3': 0,'4': 0,'5': 0,} as Record<string, number>);
    const sortedTemp = Object.keys(temp)
    .sort((a, b) => Number(b) - Number(a)) // Sort keys numerically
    .reduce((acc, key) => {
        acc[key] = temp[key];
        return acc;
    }, {} as Record<string, number>)

    return(
      <SafeAreaView className='flex-1 bg-subheaderGray' edges={['right', 'bottom','left']}>
        <KeyboardAvoidingView className='flex-1' behavior='position' keyboardVerticalOffset={100}>
        <ScrollView contentContainerStyle={{ paddingBottom: 60, gap:'1%' }}showsHorizontalScrollIndicator={false}>
              <View className='w-full bg-white flex-row pl-[5%] py-[5%]'>
                  {!mechanic.Image?(<images.defaultImage width={100} height={100} />):
                              <Image source={{uri:String(mechanic.Image)}} className='w-[100] h-[100]'/>
                              }
                  <View className='ml-[5%] justify-center'>
                      <Text className='text-2xl buttonTextBlack'>{mechanic.name}</Text>
                      <View className='flex-row'>
                        <Text>Ratings: </Text>
                        <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={reviewAVG}/>
                      </View>
                      <Text>Reviews: {reviews.length}</Text>
                  </View>
                {mechanic.Certified && <images.badge width={25} height={25} style={{marginTop:20, marginLeft:15}}/>}
              </View>

              <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
                  <Text className='text-2xl buttonTextBlack mb-[5%] '> Services</Text>
                  <FlatList
                    className='mx-[5%] mb-[5%]'
                    data={more?servicesData:servicesData.slice(0,8)}
                    renderItem={({item})=> <Text className='flex-1 smallTextBlue'>{'\u2B24'} {item}</Text>}
                    numColumns={2}
                    initialNumToRender={2}
                    scrollEnabled={false}
                    columnWrapperClassName='gap-20 '
                    contentContainerClassName='gap-2'
                  />
                  {(!more && servicesData.length > 8) && <Text className='text-lightBlueText bold text-center' onPress={()=>{setMore(true)}}>show more...</Text>}
                  {(more && servicesData.length > 8) && <Text className='text-lightBlueText text-center' onPress={()=>{setMore(false)}}>show ...</Text>}           
              </View>

              {condition && 
                <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
                  <Text className='text-2xl buttonTextBlack mb-[5%] ml-[2%]'>Additional Details</Text>
                  <View className='mx-[5%]'>
                    {mechanic.Website != '' && 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Website: <Text className='buttonTextBlue'>{mechanic.Website}</Text>
                          </Text>)}
                    {mechanic.Phone != ''&& 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Phone: <Text className='buttonTextBlue'>{mechanic.Phone}</Text>
                          </Text>)}
                    {mechanic.address != ''&& 
                        (<Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Address: <Text className='buttonTextBlue'>{mechanic.address}</Text>
                          </Text>)}
                    {mechanic.Hours.length > 0 && 
                      (      
                      <>
                        <Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Hours</Text>
                        <View className='mx-[5%] w-[50%]'>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Mon</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[0])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Tues</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[1])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Weds</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[2])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Thurs</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[3])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Fri</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[4])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Sat</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[5])}</Text>
                          </View>
                          <View className='flex-row justify-between mb-[2%]'>
                            <Text className='buttonTextBlue'>Sun</Text>
                            <Text className='buttonTextBlue'>{TimeConverter(mechanic.Hours[6])}</Text>
                          </View>
                          
                        </View>
                      </>)}
                  </View>
                  
                </View>
              }
               <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%]'>
                <View className='items-center w-[30%] ml-[10%]'>
                      <Text className='text-center buttonTextBlack'>
                        Want to add a review?
                      </Text>
                      <StarRatingDisplay rating={0} color='black' starSize={20}/>
                </View>
                <View className='flex-1 justify-center'>
                  <NormalButton text='Log in' onClick={()=>{}}/>
                </View>
                
              </View>
              
              <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%] gap-2'>
                <View className='items-center mt-[5%]'>
                  <Text className='buttonTextBlack mb-[5%]'>{reviewAVG?reviewAVG.toFixed(2):0}</Text>
                  <StarRatingDisplay rating={reviewAVG} color='black' starSize={15}/>
                  <Text className='buttonTextBlack mt-[5%]'>{reviews.length} reviews</Text>
                </View>
                <View className='items-center flex-1 mr-[2%]'> 

                    {
                      Object.keys(sortedTemp).reverse().map(x=>{
                        const percent = reviews.length >0?sortedTemp[x]/reviews.length * 100:0
                        return (<View key={x} className=' w-full mb-[2%] flex-row justify-center items-center gap-1'>
                          <Text className='buttonTextBlack mt-[-2%]'>
                            {x}
                          </Text>
                          <View className='bg-stroke rounded-full w-full mb-[2%] flex-row'>
                              <Text className='bg-primaryBlue rounded-full' style={{width:`${percent}%` as DimensionValue}}> </Text>
                           </View>
                        </View>)
                      })
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
              <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
                <FlatList
                data={reviews}
                renderItem={({item})=><ViewReviews {... item}/>}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{gap:10}}
                ListEmptyComponent={<Text className='self-center buttonTextBlack'>No Reviews Available</Text>}
                scrollEnabled={false}
                />
              </View>
              
                    
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
          
      
    )
  }
}

export default Details