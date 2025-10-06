import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import NormalButton from '../components/NormalButton'

const search = () => {
  return (
    <View className= "flex flex-col">
      
        <View><Text>Search Bar thingies haven't decided how to implement</Text> </View>
        <ScrollView horizontal= {true}>
            <NormalButton text={'Filters'} size={'28'} />
            <NormalButton text={'Services'} size={'28'} />
            <NormalButton text={'Oil Change'} size={'28'} />
            <NormalButton text={'Tire Rotation'} size={'28'} />
        </ScrollView>

        <View> This is where the dealers and mechanics will go</View>

    </View>
  )
}

export default search