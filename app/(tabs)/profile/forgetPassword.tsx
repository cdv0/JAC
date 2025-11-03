import { Text, TextInput, View } from 'react-native'

const forgetPassword = () => {
  return (
    <View className="flex flex-col gap-4 mt-10 ml-10 mr-10 text-left">
      <Text className="smallTextBold">Enter Verification Code</Text>
      <TextInput
        placeholder="Type here"
        className="px-4 py-3 bg-white border rounded-full smallTextGray border-stroke h-fit"
        maxLength={6}
        keyboardType="numeric"
      ></TextInput>
      <View className="items-center">
        {/* <NormalButton  text="Submit" /> */}
      </View>
    </View>
  )
}
export default forgetPassword
