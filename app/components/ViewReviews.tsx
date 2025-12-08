import { Text, View } from 'react-native'
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

  const formattedDate = time.toLocaleDateString('en-us', options).replace(',', ' at ')

  return (
    <View className=' border-b-2 border-stroke px-5 py-3'>
      <View className='flex-row ml-5'>
        <View className='w-[50] h-[50] border border-black rounded-full justify-center items-center'>
          {/*Update to retrieve the user profile*/}
          <Text className='buttonTextBlack'>
            T
          </Text>
        </View>
        <View className='w-full'>
          <View className='ml-5'>
            {/*Update to retrieve user name instead of id*/}
            <Text className='ml-2 buttonTextBlack'>
              User {UserId}
            </Text>
            <Text className='ml-2 buttonTextBlack'>
              {formattedDate}
            </Text>
            <StarRatingDisplay color={'black'} starSize={18} StarIconComponent={Star} starStyle={{marginHorizontal:-1}} style={{ alignItems:'center'}} rating={Rating}/>
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