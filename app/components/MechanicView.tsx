import React from 'react'
import { Text, TouchableOpacity, View, ImageSourcePropType, Image } from 'react-native'


type MechanicViewProps = {
    name: string,
    type: string,
    rating: string,
    reviews: string,
    image: ImageSourcePropType
}

export default function MechanicView(
    {
        name, type, rating, reviews, image
    }: MechanicViewProps){
        return(
            <View className = {`flex flex-row`}>
                <Image source = {image}></Image>
                <View className = {`flex flex-col`}>
                    <Text>{name}</Text>
                    <Text>{type}</Text>
                    <Text>{rating} will add stars later</Text>
                    <Text>{reviews}</Text>
                </View>
            </View>
        )
}