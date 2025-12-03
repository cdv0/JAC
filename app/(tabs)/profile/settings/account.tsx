import { readUserProfile } from '@/_backend/api/profile'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image, Alert } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as DocumentPicker from 'expo-document-picker'
import {
  uploadProfilePicture,
  ALLOWED_MIME_TYPES_IMAGE,
  MAX_IMAGE_SIZE,
  type File,
} from '@/_backend/api/fileUpload'
import { Hub } from 'aws-amplify/utils'

const PROFILE_IMAGE_URI_KEY_PREFIX = 'profileImageUri'
const getProfileImageKey = (userId: string) => `${PROFILE_IMAGE_URI_KEY_PREFIX}:${userId}`

export default function Account() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const user = await getCurrentUser()
        const currentUserId = user.userId
        setUserId(currentUserId)

        const cacheKey = getProfileImageKey(currentUserId)
        const cachedUri = await AsyncStorage.getItem(cacheKey)
        if (cachedUri) setProfileImage(cachedUri)

        const attrs = await fetchUserAttributes()
        const emailAttr = attrs.email

        const userData = await readUserProfile(currentUserId, emailAttr)

        setFirstName(userData.firstName ?? '')
        setLastName(userData.lastName ?? '')
        setEmail(emailAttr ?? '')
        setCreatedAt(attrs.createdAt ?? '')
      } catch {}
    })()
  }, [])

  const handleChangeProfilePicture = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES_IMAGE,
        multiple: false,
        copyToCacheDirectory: true,
      })

      if (res.canceled) return

      const doc = res.assets[0]

      const pickedFile: File = {
        uri: doc.uri,
        name: doc.name,
        size: doc.size ?? 0,
        mimeType: doc.mimeType ?? null,
      }

      if (!pickedFile.mimeType || !ALLOWED_MIME_TYPES_IMAGE.includes(pickedFile.mimeType)) {
        Alert.alert('Unsupported file', 'Please choose a JPG image.')
        return
      }

      if (pickedFile.size && pickedFile.size > MAX_IMAGE_SIZE) {
        Alert.alert('Image too large', 'Please choose an image smaller than 256 KB.')
        return
      }

      if (!userId || !email) {
        Alert.alert('Error', 'Missing user information.')
        return
      }

      setUploading(true)

      const payload = {
        uri: pickedFile.uri,
        name: pickedFile.name,
        size: pickedFile.size,
        mimeType: pickedFile.mimeType,
        userId,
        email,
      }

      await uploadProfilePicture(payload)

      const cacheKey = getProfileImageKey(userId)
      setProfileImage(pickedFile.uri)
      await AsyncStorage.setItem(cacheKey, pickedFile.uri)

      Hub.dispatch('profile', { event: 'profileImageUpdated' })
    } catch {
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
              <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-lg text-white">{firstName ? firstName[0] : '?'}</Text>
              </View>
            )}
            {uploading && <Text className="mt-2 text-xs text-gray-500">Uploading...</Text>}
          </View>

          <View className="bg-white rounded-xl">
            <Pressable
              className="flex-row justify-between px-5 pt-5 pb-3"
              onPress={() => router.push('/profile/settings/editName')}
            >
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row gap-3">
                <Text className="xsText">{firstName} {lastName}</Text>
                <ChevronRightIcon size={20} color="#000" />
              </View>
            </Pressable>

            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={() => router.push('/profile/settings/editEmail')}
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
                  params: { email },
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
              <Text className="font-semibold text-textBlack">Change profile picture</Text>
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