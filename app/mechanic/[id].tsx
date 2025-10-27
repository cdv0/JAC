import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

const Details = () => {
  const {id} = useLocalSearchParams()
  return (
    /* id just the name of the mechanic. Will need to pull the mechanic info using the id */ 
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default Details