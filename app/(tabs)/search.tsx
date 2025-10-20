import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView } from 'react-native'
import NormalButton from '../components/NormalButton'


const search = () => {

    const [mechanics, setMechanics] = useState([])
    useEffect(() =>{
        const data = async () => {
           try{
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const json = await response.json();
            setMechanics(json);
           } catch (error){
            console.error(error);
           }   
           
        }
        //call
        data();
    }, []);


  return (
    <View className= "flex flex-col">
      
        <View><Text>Search Bar thingies haven't decided how to implement</Text> </View>
        <ScrollView horizontal= {true}>
            <NormalButton text={'Filters'} width= {"28"} onClick = {}/>
            <NormalButton text={'Services'} width={'28'} onClick = {}/>
            <NormalButton text={'Oil Change'} width={'28'} onClick = {} />
            <NormalButton text={'Tire Rotation'} width={'28'} onClick = {}/>
        </ScrollView>
        <View>
            {mechanics.map((item) => (
                <View key={item.id} className = "border-2 border-black m-2 p-2">
                    <Text className = "font-bold">{item.name}</Text>
                </View>
            }         
            
        </View>
        <View> This is where the dealers and mechanics will go</View>

    </View>
  )
}

export default search
