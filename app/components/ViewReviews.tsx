import { getUserById } from '@/_backend/api/review'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import Star from './Star'
type ReviewProps ={
    Rating: number,
    Review: String,
    UserId: string,
    CreatedAt: string
}
const ViewReviews = ({Rating, Review, UserId, CreatedAt}:ReviewProps) => {

  const time = new Date(CreatedAt)
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
} as Intl.DateTimeFormatOptions;
  const [name, setName]=useState('');
  const [profilePic, setProfilePic] =useState('');
  const [loading, setLoading] = useState(true);
  const formattedDate = time.toLocaleDateString('en-us', options).replace(',', ' at ')
  
  useEffect( ()=>{
    const getUserName = async()=>{
      try{
        console.log(UserId);
        const userData = await getUserById(UserId as string);
        const first = userData.firstName;
        const last = userData.lastName;
        console.log("First: " + first);
        if(first && last)
          setName(`${first} ${last}`);
      }
      catch{
        console.log("Unable to load user name")
      }
      
    }
  const getUserImage = async()=>{
        const uri = await AsyncStorage.getItem('profileImageUri:' + UserId).catch(()=>console.log("Unable to retrieve image"));
        console.log("Image: "+ uri);
        setProfilePic(uri||'');

  }
  const runner = async ()=>{
     await Promise.all([getUserName(), getUserImage()])
  }
  runner()
  setLoading(false);
  },[UserId])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className=' border-b-2 border-stroke px-5 py-3'>
      <View className='flex-row ml-5'>
        <View className='items-center'>
          {profilePic!=''?
          <Image source={{uri:profilePic}} className='w-[50] h-[50] border border-black rounded-full'/>:
          <View className='w-[50] h-[50] border border-black rounded-full justify-center items-center'>
            {/*Update to retrieve the user profile*/}   
            <Text className='buttonTextBlack'>
              {name.split(' ').map(x=>(x[0])).join('')}
            </Text>
          </View>}
        </View>
        
        <View className='w-full'>
          <View className='ml-5'>
            {/*Update to retrieve user name instead of id*/}
            <Text className='ml-2 buttonTextBlack'>
              {name}
            </Text>
            <Text className='ml-2 buttonTextBlack'>
              {formattedDate}
            </Text>
            <StarRatingDisplay color={'black'} starSize={18} StarIconComponent={Star} starStyle={{marginHorizontal:-1}} style={{ alignItems:'center', marginLeft:5}} rating={Rating}/>
          </View>
        </View>
          
      </View>
      <Text className='buttonTextBlack mx-5 mt-5'>
        {Review}
      </Text>
    </View>
  )
}

export default ViewReviews