import { readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image, Alert } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { uploadProfilePicture, ALLOWED_MIME_TYPES_IMAGE, MAX_IMAGE_SIZE } from '@/_backend/api/fileUpload'

const PROFILE_IMAGE_URI_KEY = 'profileImageUri'

export default function Account() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const cachedUri = await AsyncStorage.getItem(PROFILE_IMAGE_URI_KEY)
        if (cachedUri) {
          setProfileImage(cachedUri)
        }

        const user = await getCurrentUser()
        const attrs = await fetchUserAttributes()
        const emailAttr = attrs.email
        if (!emailAttr) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          )
        }

        setUserId(user.userId)

        const userData = await readUserProfile(user.userId, emailAttr)

        setFirstName(userData.firstName ?? '')
        setLastName(userData.lastName ?? '')
        setEmail(emailAttr ?? '')
        setCreatedAt(attrs.createdAt ?? '')
      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [])

  const handleChangeProfilePicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos so you can pick a profile picture.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return
      }

      const asset = result.assets[0]
      const uri = asset.uri
      const fileName = asset.fileName || `profile-${Date.now()}.jpg`
      const fileSize = asset.fileSize ?? 0
      const mimeType = asset.mimeType ?? 'image/jpeg'

      if (!ALLOWED_MIME_TYPES_IMAGE.includes(mimeType)) {
        Alert.alert('Unsupported file', 'Please choose a JPG image (.jpg or .jpeg).')
        return
      }

      if (fileSize && fileSize > MAX_IMAGE_SIZE) {
        Alert.alert('Image too large', 'Please choose an image smaller than 256 KB.')
        return
      }

      if (!userId || !email) {
        Alert.alert('Error', 'Missing user information.')
        return
      }

      setUploading(true)

      const payload = {
        uri,
        name: fileName,
        size: fileSize,
        mimeType,
        userId,
        email,
      }

      const key = await uploadProfilePicture(payload)
      console.log('Uploaded profile image key:', key)

      setProfileImage(uri)
      await AsyncStorage.setItem(PROFILE_IMAGE_URI_KEY, uri)
      
    } catch (e: any) {
      console.log('Error changing profile picture:', e?.message || e)
      Alert.alert('Error', 'There was a problem uploading your picture.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex-col justify-start">
        <View className="h-full px-2 pt-3">
          <View className="items-center mb-4">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-lg text-white">
                  {firstName ? firstName[0] : '?'}
                </Text>
              </View>
            )}
            {uploading && (
              <Text className="mt-2 text-xs text-gray-500">Uploading...</Text>
            )}
          </View>

          <View className="bg-white rounded-xl">
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/editName')}
            >
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row gap-3">
                <Text className="xsText">
                  {firstName} {lastName}
                </Text>
                <ChevronRightIcon size={20} color="#000" />
              </View>
            </Pressable>

            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() => {
                router.push('/profile/settings/editEmail')
              }}
            >
              <Text className="font-semibold text-textBlack">Email</Text>
              <View className="flex-row gap-3">
                <Text className="xsText">{email}</Text>
                <ChevronRightIcon size={20} color="#000" />
              </View>
            </Pressable>

            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() =>
                router.push({
                  pathname: '/profile/settings/editPassword',
                  params: { email: email },
                })
              }
            >
              <Text className="font-semibold text-textBlack">Password</Text>
              <View className="flex-row gap-3">
                <Text className="xsText">*********</Text>
                <ChevronRightIcon size={20} color="#000" />
              </View>
            </Pressable>

            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={handleChangeProfilePicture}
            >
              <Text className="font-semibold text-textBlack">
                Change profile picture
              </Text>
              <View className="flex-row gap-3">
                <ChevronRightIcon size={20} color="#000" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}