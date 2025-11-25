import { Text, View } from 'react-native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import Star from './Star'
type ReviewProps ={
    rating: number,
    review: String,
    userId: string,
    createdAt: string
}
const ViewReviews = ({rating, review, userId, createdAt}:ReviewProps) => {

  const time = new Date(createdAt)
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
          <Text className='buttonTextBlack'>
            T
          </Text>
        </View>
        <View className='w-full'>
          <View className='ml-5'>
            <Text className='ml-2 buttonTextBlack'>
              User {userId}
            </Text>
            <Text className='ml-2 buttonTextBlack'>
              {formattedDate}
            </Text>
            {/*todo: Fix inconsisent star sizes */}

            <StarRatingDisplay color={'black'} starSize={18} StarIconComponent={Star} starStyle={{marginHorizontal:-1}} style={{ alignItems:'center'}} rating={rating}/>
          </View>
        </View>
          
      </View>
      <Text className='buttonTextBlack mx-5 mt-5'>
        {review}
      </Text>
    </View>
  )
}

export default ViewReviews