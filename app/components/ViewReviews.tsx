import { Text, View } from 'react-native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
type ReviewProps ={
    rating: number,
    review: String,
    userId: string
}
const ViewReviews = ({rating, review, userId}:ReviewProps) => {
  return (
    <View className=' border-b-2 border-stroke px-5 py-3'>
      <View className='flex-row ml-5'>
        <View className='w-[50] h-[50] border border-black rounded-full justify-center items-center'>
          <Text className='buttonTextBlack'>
            T
          </Text>
        </View>
        <View>
          <View className='ml-5'>
            <Text className='ml-2'>
              User {userId}
            </Text>
            <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={rating}/>
          </View>
        </View>
          
      </View>
      <Text className='buttonTextBlack mx-5'>
        {review}
      </Text>
    </View>
  )
}

export default ViewReviews