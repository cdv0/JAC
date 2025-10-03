import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'

const profile = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const signupOnClick = async () => {}

  return (
    <View>
      <Text>Profile</Text>

      <View className="flex flex-row items-center pl-10 ml-10 text-white">
        <Text className="text-dangerDarkRed">Name</Text>
        <TextInput
          onChangeText={setName}
          value={name}
          placeholder="Type here"
        ></TextInput>
        <Text>Email</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Type here"
        ></TextInput>
        <Text>Password</Text>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Type here"
        ></TextInput>

        <Button title="signUp" onPress={signupOnClick}></Button>
      </View>
    </View>
  )
}

export default profile
