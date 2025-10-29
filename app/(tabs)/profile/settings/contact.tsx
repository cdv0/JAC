import { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import NormalButton from '@/app/components/NormalButton';

export default function Contact() {
  const[Name, setName] = useState('')
  const[Email, setEmail] = useState('')
  const[Message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false);

  const submitForm = () => {
    setSubmitted(true);
    let formData = {
      Name: Name,
      Email: Email,
      Message: Message,
    }
    console.log('Contact form submitted:', formData)
  }

  //Check for empty input upon submission
  const isNameInvalid = submitted && !Name.trim();
  const isEmailInvalid = submitted && !Email.trim();
  const isMessageInvalid = submitted && !Message.trim();

  return (
  <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="bg-white rounded-xl px-5 pt-3 pb-5 gap-3 mt-3 mx-3">
        <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="font-semibold text-textBlack">Name</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={Name}
                      placeholder="Type here"
                      keyboardType="default"
                      onChangeText={setName}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isNameInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
                    
                    {/* Error message for empty input */}
                    {isNameInvalid ? (
                      <Text className="dangerText mx-2">Name is required</Text>
                    ): null}
                  </View>
        <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="font-semibold text-textBlack">Email</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={Email}
                      placeholder="Type here"
                      keyboardType="default"
                      onChangeText={setEmail}
                      className={`border rounded-full px-4 py-2 smallTextGray ${isEmailInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
                    
                    {/* Error message for empty input */}
                    {isEmailInvalid ? (
                      <Text className="dangerText mx-2">Email is required</Text>
                    ): null}
                  </View>
        <View className="gap-2">
                    <View className="flex-1 flex-row">
                      <Text className="font-semibold text-textBlack">Message</Text>
                      <Text className="dangerText"> *</Text>
                    </View>
                    <TextInput
                      value={Message}
                      multiline = { true }
                      numberOfLines = { 6 }
                      placeholder="Type here"
                      keyboardType="default"
                      onChangeText={setMessage}
                      className={`border rounded-xl px-4 py-2 smallTextGray ${isMessageInvalid ? "border-dangerBrightRed" : "border-stroke"}`}
                    />
                    
                    {/* Error message for empty input */}
                    {isMessageInvalid ? (
                      <Text className="dangerText mx-2">Message is required</Text>
                    ): null}
                  </View>
          <View className="pt-5">
            <NormalButton
              variant="primary"
              text="Submit"
              onClick= {submitForm}
            ></NormalButton>
          </View>
        </View>
    </SafeAreaView>
    )
}