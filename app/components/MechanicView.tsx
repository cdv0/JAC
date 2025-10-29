import { images } from "@/constants/images"
import { Link } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { SvgUri } from 'react-native-svg'
type MechanicViewProps = {
    name: string,
    type: string,
    rating: string,
    reviews: string,
    image: string,
    services: string[]
}

export default function MechanicView(
    {
        name, type, rating, reviews, image
    }: MechanicViewProps){
                            

        return(
            
            <Link href={`../mechanic/${name}`} asChild>
                <TouchableOpacity style={{width:'48%', marginBottom:'5%'}}>
                    <View className = "rounded-xl border border-stroke py-[10%]">
                        {image==''?(<images.defaultImage width={'100%'} height={150} />):
                        <SvgUri width={'100%'} height={150}  uri={image}/>
                        }
                        <View className ="my-[5%] ml-[15%]">
                            <Text className = {`text-xl buttonTextBlack`}>{name}</Text>
                            <Text className = {`text-l buttonTextGray`}>Type: {type}</Text>
                           
                            <View className="flex-row ">
                                <Text>Rating:</Text>
                                <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={parseFloat(rating)}/>
                                
                            </View>
                            <Text>Reviews: {reviews}</Text>
                        </View>
                    </View> 
                </TouchableOpacity>    
            </Link>
        )
}