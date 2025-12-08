import {
  ALLOWED_MIME_TYPES_IMAGE,
  MAX_IMAGE_SIZE,
  uploadProfilePicture,
  type File,
} from '@/_backend/api/fileUpload'
import { deleteAccount, readUserProfile } from '@/_backend/api/profile'
import NormalButton from '@/app/components/NormalButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  deleteUser,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Image, Pressable, Text, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

const PROFILE_IMAGE_URI_KEY_PREFIX = 'profileImageUri'
const getProfileImageKey = (userId: string) =>
  `${PROFILE_IMAGE_URI_KEY_PREFIX}:${userId}`

export default function Account() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false)
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
        const emailAttr = attrs.email!.toString()

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

      if (
        !pickedFile.mimeType ||
        !ALLOWED_MIME_TYPES_IMAGE.includes(pickedFile.mimeType)
      ) {
        Alert.alert('Unsupported file', 'Please choose a JPG image.')
        return
      }

      if (pickedFile.size && pickedFile.size > MAX_IMAGE_SIZE) {
        Alert.alert(
          'Image too large',
          'Please choose an image smaller than 256 KB.'
        )
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

  const deleteAccountHandler = async () => {
    // call lambda to delete content from DB

    const result = await deleteAccount(userId, email)

    try {
      setDeleteAccountModal(false)
      await deleteUser()
      setDeleteConfirmModal(true)

      await new Promise((r) => setTimeout(r, 3000))

      await signOut()
      router.push('/(tabs)/profile')
    } catch (error) {
      console.error('Unable to delete user: ', error)
    }
  }

  return (
    // <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex flex-col justify-start">
        <View className="h-full px-2 pt-5">
          <View className="items-center mb-5">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="items-center justify-center w-24 h-24 bg-gray-300 rounded-full">
                <Text className="text-lg text-white">
                  {firstName ? firstName[0] : '?'}
                </Text>
              </View>
            )}
            {uploading && (
              <Text className="mt-2 text-xs text-gray-500">Uploading...</Text>
            )}
          </View>
          <View className="flex items-center h-full px-2">
            {deleteAccountModal && (
              <View className="absolute z-40 flex w-4/5 gap-6 px-8 py-8 mt-20 bg-white border-2 rounded-xl border-stroke">
                <Text className="text-center text-black largeTitle ">
                  Delete Account
                </Text>
                <Text className="w-full text-xl text-center text-dangerDarkRed">
                  Are you sure you want to delete your account?
                </Text>

                <View className="flex flex-row gap-8">
                  <NormalButton
                    text="Cancel"
                    onClick={() => setDeleteAccountModal(false)}
                    variant="outline"
                  />

                  <NormalButton
                    text="Confirm"
                    onClick={deleteAccountHandler}
                    variant="danger"
                  />
                </View>
              </View>
            )}
            {deleteConfirmModal && (
              <View className="absolute z-40 flex w-4/5 gap-6 px-8 py-8 mt-20 bg-white border-2 rounded-xl border-stroke">
                <Text className="font-extrabold text-center text-black largeTitle">
                  User Data Deleted
                </Text>
              </View>
            )}

            <View className="flex w-full gap-6 bg-white rounded-xl">
              <Pressable
                className="flex-row justify-between px-5 pt-5 pb-3"
                onPress={() => router.push('/profile/settings/editName')}
              >
                <Text className="font-semibold text-textBlack">Name</Text>
                <View className="flex-row gap-3">
                  <Text className=" smallText">
                    {firstName} {lastName}
                  </Text>
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
      </View>
    // </SafeAreaView>
  )
}
