import { SafeAreaView } from 'react-native-safe-area-context';
const map = () => {
  return (
    <SafeAreaView className='flex-1' edges={['right', 'top', 'left']}>
      {/* <View className='flex-1'>
        <View style={{zIndex:1}}>
          <SearchBar placeholder1='Search' placeholder2='Location'/>
        </View>
        <MapView style={StyleSheet.absoluteFill} provider={PROVIDER_GOOGLE}/>
      </View> */}
    </SafeAreaView>
  )
}

export default map