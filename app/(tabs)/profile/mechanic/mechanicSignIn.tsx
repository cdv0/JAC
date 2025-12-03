import AddShop from '@/app/components/AddShop'
import NormalButton from '@/app/components/NormalButton'
import { useState } from 'react'
import { Text, View } from 'react-native'
const mechanicSignIn = () => {
  const [addModalVisible, setAddModalVisible] = useState(false)
  const close =()=>{setAddModalVisible(false)};
  return (
    <View className='flex-1 bg-white'>
      <NormalButton onClick={()=>{setAddModalVisible(true)}} text='Add'/>
      <Text>Mechanic Sign In</Text>
      <AddShop visible={addModalVisible} onClose={close}/>
    </View>
  )
}
export default mechanicSignIn
