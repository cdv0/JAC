import { Link } from 'expo-router'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'


type MechanicViewProps = {
    name: string,
    type: string,
    rating: string,
    reviews: string,
    image: ImageSourcePropType,
    services: string[]
}

export default function MechanicView(
    {
        name, type, rating, reviews, image
    }: MechanicViewProps){
        return(
            <Link href={`../mechanic/${name}`} asChild>
                <TouchableOpacity>
                   <View className = {`flex flex-row`}>
                    <Image className ={"w-3/12 m-2 object-cover" }source = {image}></Image>
                    <View className = {`flex flex-col`}>
                        <Text className = {`text-xl text-textBlack`}>{name}</Text>
                        <Text className = {`text-l text-subheaderGray`}>{type}</Text>
                        <Text>{rating}/5</Text>
                        <Text>Reviews: {reviews}</Text>
                    </View>
                </View> 
                </TouchableOpacity>    
            </Link>
        )
}