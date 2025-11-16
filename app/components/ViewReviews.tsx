import { Text, View } from 'react-native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { Float } from 'react-native/Libraries/Types/CodegenTypesNamespace'
type ReviewProps ={
    Rating: Float,
    Review: String,
    userId: string
}
const ViewReviews = ({Rating, Review, userId}:ReviewProps) => {
  return (
    <View className='flex-1 border-b-2 border-stroke'>
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
            <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={Rating}/>
          </View>
        </View>
          
      </View>
      <Text className='buttonTextBlack mx-5'>
        {Review}
      </Text>
    </View>
  )
}

export default ViewReviews