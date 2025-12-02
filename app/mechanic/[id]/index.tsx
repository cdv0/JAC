import { readUserProfile } from '@/_backend/api/profile';
import { getMechanicById, getReviewsByMechanic } from '@/_backend/api/review';
import NormalButton from '@/app/components/NormalButton';
import Star from '@/app/components/Star';
import TimeConverter from '@/app/components/TimeConverter';
import ToggleButton from '@/app/components/ToggleButton';
import ViewReviews from '@/app/components/ViewReviews';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, DimensionValue, FlatList, Image, KeyboardAvoidingView, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ReactNativeModal as Modal } from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Float } from 'react-native/Libraries/Types/CodegenTypesNamespace';




interface MechanicViewProps {
  mechanicID: string;
  name: string;
  Certified: boolean;
  Review: number;
  Image: string;
  Services: string;
  Hours: string[];
  address: string;
  Website: string;
  Phone: string;
  lat: number;
  lon: number;
}

type ReviewProps = {
  ReviewId: string;
  MechanicId: string;
  Rating: number;
  Review: string;
  UserId: string;
};

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
 
  const [mechanic, setMechanic] = useState<any>(null);
  const[reviews, setReviews] = useState<any[]>([])
  const [reviewAVG, setreviewAVG] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : null;

  

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const email = attrs.email;
        if (!email) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          );
        }

        const userData = await readUserProfile(userId, email);

        setFirstName(userData.firstName ?? '');
        setLastName(userData.lastName ?? '');
        setIsAuthenticated(true);
      } catch (e: any) {
        console.log('Details: Error loading user data:', e);
        console.log('Details: Error message:', e?.message);
        setFirstName('');
        setLastName('');
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [Verified, setVerified] = useState(false);
  const [choice, setChoice] = useState("");
  const [isClaimed, setClaimed] = useState(false); //change to fetch query
  const [asMechanic,setAsMechanic] = useState(false);
  const [claimVisibile, setClaimVisibile] = useState(false);
  const [claimLoading, setClaimLoading]= useState(true);
  const handleChoice = (flag:boolean, choice:string)=>{
    if (flag){
      setChoice(choice)
    }
    else{
      setChoice('')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setMechanic(null);
        setReviews([]);
        setreviewAVG(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Mechanic details
        console.log("id", id)
        const mech = await getMechanicById(String(id));
        setMechanic(mech as any);

        // 2. Reviews for this mechanic
        const { reviews: backendReviews, average } = await getReviewsByMechanic(
          String(id)
        );

        setReviews(
          backendReviews.map((r: any) => ({
            ReviewId: r.ReviewId ?? r.reviewId,
            MechanicId: r.MechanicId ?? r.mechanicId,
            Rating: Number(r.Rating ?? r.rating ?? 0),
            Review: r.Review ?? r.review ?? '',
            UserId: r.UserId ?? r.userId,
            CreatedAt: r.CreatedAt ?? r.createdAt,
          }))
        );

        if (backendReviews.length > 0) {
          // Prefer backend average, fallback to computed
          const avg =
            typeof average === 'number' && !Number.isNaN(average)
              ? average
              : backendReviews.reduce(
                  (acc: number, r: any) =>
                    acc + Number(r.Rating ?? r.rating ?? 0),
                  0
                ) / backendReviews.length;

          setreviewAVG(avg as Float);
        } else {
          setreviewAVG(0);
        }
      } catch (error) {
        console.error('Error loading mechanic/reviews:', error);
        setMechanic(null);
        setReviews([]);
        setreviewAVG(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!mechanic) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{id} could not be found</Text>
      </View>
    );
  } else {
    const servicesData = mechanic.Services.split(',').map((item: string) =>
      item.trim()
    );
    const condition =
      (mechanic.Hours?.length ?? 0) > 0 ||
      mechanic.address !== '' ||
      mechanic.Website !== '' ||
      mechanic.Phone !== '';

    // Histogram buckets
    const temp = reviews.reduce(
      (acc, curr) => {
        const ratingNum = Number(curr.Rating ?? 0);
        const val = String(Math.round(ratingNum));
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<string, number>
    );

    const sortedTemp = Object.keys(temp)
      .sort((a, b) => Number(b) - Number(a))
      .reduce((acc, key) => {
        acc[key] = temp[key];
        return acc;
      }, {} as Record<string, number>);

    // Search filter
    const searchReviews = query!=''?reviews.filter(x=> x.Review.toLowerCase().includes(query.toLowerCase())):reviews;
    const applyFilter = () =>{
      const temp =searchReviews
      if (choice ==''){
        return temp
      }
      else if (choice =='5')
        return temp.filter(x=> x.Rating == Number(choice))
      else{
        const bound = Number(choice)
        return temp.filter(x=> bound<=x.Rating && x.Rating<bound + 1)
      }
    }

    return(
      <SafeAreaView className='flex-1 bg-subheaderGray' edges={['right', 'bottom','left']}>
        <KeyboardAvoidingView className='flex-1' behavior='padding' keyboardVerticalOffset={100}>
        <ScrollView contentContainerStyle={{ paddingBottom: 10, gap:10 }} showsVerticalScrollIndicator={false}>
              <View className='w-full bg-white flex-row pl-[5%] py-[5%]'>
                  {!mechanic.Image?(<images.defaultImage width={120} height={120} />):
                              <Image source={{uri:String(mechanic.Image)}} className='w-[120] h-[120]'/>
                              }
                  <View className='ml-[5%] justify-center'>
                      <Text className='text-2xl buttonTextBlack'>{mechanic.name}</Text>
                      <View className='flex-row'>
                        <Text className='buttonTextBlack'>Ratings: </Text>
                        <StarRatingDisplay color={'black'} starSize={20} StarIconComponent={Star} rating={reviewAVG} starStyle={{marginHorizontal:-1}}/>
                      </View>
                      <Text className='buttonTextBlack mb-[10]'>Reviews: {reviews.length}</Text>
                      {asMechanic && <ToggleButton flag={isClaimed} 
                      text={isClaimed?'Claimed':'Claim Business'} 
                      onPress={async ()=>{
                                      /**
                                       * 
                                       * PsuedoCode
                                       * if Claimed
                                       *    prompt for confirmation modal
                                       *    return
                                       * 
                                       * call modal
                                       * call async func for claiming
                                       *    
                                       *  
                                       * 
                                       *  */
                                          
                                      // setClaimVisibile(true)  
                                      // await claim()                                                                            
                                    }}/>}
                  </View>
                  <View style={{marginTop:30, marginLeft:15, gap:10}}>
                    {mechanic.Certified && <images.badge width={30} height={30}/>}            
                  </View>
                
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
                    showsVerticalScrollIndicator={false}

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
                        (<View className='flex-row gap-5'>
                          <View className='w-[80%]'>
                            <Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Address: <Text className='buttonTextBlue'>{mechanic.address} </Text>
                          </Text>
                          </View>
                          {mechanic.Location && <Pressable onPress={()=>Linking.openURL(`https://google.com/maps/search/?api=1&query=${mechanic.Location[0]},${mechanic.Location[1]}&force_browser=true`)}>
                            <icons.start width={20} height={20}/>
                          </Pressable>}
                        </View>)}
                    {mechanic.Hours.length > 0 && 
                      (      
                      <>
                        <Text className='smallTextBlue mb-[2%]'>{'\u2B24'} Hours</Text>
                        <View className='mx-[5%] w-[75%]'>
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
                        {isAuthenticated
                          ? `${ displayName || 'no_name'}`
                          : 'Want to add a review?'}
                      </Text>
                      <StarRatingDisplay rating={0} StarIconComponent={Star} color='black' starSize={20}/>
                </View>
                <View className='flex-1 justify-center'>
                  <NormalButton text= {isAuthenticated ? 'Post a review' : 'Log in'} 
                  onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/profile"); 
                    return;
                  }

                    router.push({
                      pathname: "/mechanic/[id]/createReview",
                      params: { id },
                  });
                }}
              />
                </View>
                
              </View>
              
              <View className='w-[95%] bg-white rounded-xl self-center flex-row py-[5%]'>
                <View className='items-center justify-center gap-[5] mx-[10]'>
                  <Text className='buttonTextBlack text-2xl'>{reviewAVG?reviewAVG.toFixed(1):0}</Text>
                  <StarRatingDisplay rating={reviewAVG} color='black'  StarIconComponent={Star}  starSize={18} />
                  <Text className='buttonTextBlack text-l'>{reviews.length} reviews</Text>
                </View>
                <View className='items-center justify-center flex-1 mr-[2%]'> 

                    {
                      Object.keys(sortedTemp).reverse().map(x=>{
                        const percent = reviews.length >0?sortedTemp[x]/reviews.length * 100:0
                        return (<View key={x} className=' w-full mb-[2%] flex-row justify-center items-center gap-1'>
                          <Text className='buttonTextBlack'>
                            {x}
                          </Text>
                          <View className='bg-stroke rounded-full w-full  flex-row'>
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
                    <TextInput className='w-[50%]'value={query} onChangeText={(newf) =>{setQuery(newf)}}/>
                </View>
                <NormalButton text='Filter' onClick={()=> {setVisible(true)}}/>
              </View>
              <View className='w-[95%] bg-white rounded-xl self-center py-[5%] '>
              <FlatList
                data={applyFilter()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "./mechanic/[id]/viewOtherUser",
                        params: {
                          id: String(id),
                          reviewId: item.ReviewId,
                          mechanicId: item.MechanicId,
                        },
                      })
                    }
                  >
                    <ViewReviews {...item} />
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                ListEmptyComponent={
                  <Text className="self-center buttonTextBlack">
                    No Reviews Available
                  </Text>
                }
                scrollEnabled={false}
                keyExtractor={(item) => item.ReviewId}
                extraData={query}
              />
              </View>

               <Modal isVisible={visible} animationIn="slideInRight" animationOut="slideOutRight" onBackdropPress={() => setVisible(false)}
                backdropOpacity={0.3} style={{justifyContent:'center', alignItems:'flex-end', margin:0}}>
                  <View className='w-[40%] h-[70%] flex-row items-center'>
                      <Pressable className="w-[20px] h-[40px] bg-white rounded-l-[20px] justify-center items-end border-y border-l border-black" onPress={()=>setVisible(false)}>
                        <Text className='text-2xl text-bold buttonTextBlack'>
                          {">"}
                        </Text>
                      </Pressable>
                      <View className='bg-white flex-1 h-full rounded-l-xl justify-around items-center border border-black'>
                        <View className='w-full border-b border-stroke'>
                          <Text className='buttonTextBlack self-center text-2xl'>
                            Filters
                          </Text>
                        </View>
                        
                          <ToggleButton flag={Verified}  onPress={(newf)=>{setVerified(newf)}} text="Verified"/>

                        <View className='w-full items-center border-t pt-[10%] border-stroke'>
                          <ToggleButton flag={choice == '5'}   onPress={(newf)=>{handleChoice(newf, '5')}} text="5 stars"/>
                        </View>                      
                        <ToggleButton flag={choice == '4'}   onPress={(newf)=>{handleChoice(newf, '4')}} text="4 stars"/> 
                        <ToggleButton flag={choice == '3'}   onPress={(newf)=>{handleChoice(newf, '3')}} text="3 stars"/>   
                        <ToggleButton flag={choice == '2'}  onPress={(newf)=>{handleChoice(newf, '2')}} text="2 stars"/> 
                        <ToggleButton flag={choice == '1'}  onPress={(newf)=>{handleChoice(newf, '1')}} text="1 star"/>     
                      </View>
                  </View>            
              </Modal>      
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
          
      
    )
  }
}

export default Details