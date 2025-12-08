import { readUserProfile } from '@/_backend/api/profile'
import NormalButton from '@/app/components/NormalButton'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { Pressable, ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { icons } from '@/constants/icons';
import { getReviewsByUser, getMechanicById } from '@/_backend/api/review'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { useFocusEffect } from '@react-navigation/native' 

const PROFILE_IMAGE_URI_KEY_PREFIX = 'profileImageUri'
const getProfileImageKey = (userId: string) => `${PROFILE_IMAGE_URI_KEY_PREFIX}:${userId}`


type SortOption = 'dateNewest' | 'dateOldest' | 'ratingHigh' | 'ratingLow'

export const account = () => {
  const router = useRouter()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [sortOption, setSortOption] = useState<SortOption>('dateNewest')
  const [mechanicsById, setMechanicsById] = useState<Record<string, any>>({})

  const loadAccountData = useCallback(async () => {
    try {
      const { userId } = await getCurrentUser()
      const attrs = await fetchUserAttributes()
      const email = attrs.email
      if (!email) {
        throw new Error(
          'No email on the Cognito profile (check pool/app-client readable attributes).'
        )
      }
  
      const userData = await readUserProfile(userId, email)
      setFirstName(userData.firstName ?? '')
      setLastName(userData.lastName ?? '')
      setCreatedAt(userData.createdAt ?? '')
  
      const reviewData = await getReviewsByUser(userId)
      const safeReviews = reviewData ?? []
      setReviews(safeReviews)
  
      // 🔹 NEW: fetch mechanic info (including Image) for each unique mechanicId
      const mechanicIds = [
        ...new Set(
          safeReviews
            .map((rev: any) => rev.mechanicId ?? rev.MechanicId)
            .filter(Boolean)
        ),
      ]
  
      if (mechanicIds.length === 0) {
        setMechanicsById({})
        return
      }
  
      const entries = await Promise.all(
        mechanicIds.map(async (id) => {
          try {
            const mech = await getMechanicById(String(id))
            return [String(id), mech] as const
          } catch (e) {
            console.log('Account: failed to load mechanic', id, e)
            return [String(id), null] as const
          }
        })
      )
  
      setMechanicsById(Object.fromEntries(entries))
    } catch (e: any) {
      console.log('Account: Error loading user data:', e)
      console.log('Account: Error message:', e.message)
    }
  }, [])
  

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser()
        const cacheKey = getProfileImageKey(userId)
        const cachedUri = await AsyncStorage.getItem(cacheKey)
        if (cachedUri) {
          setProfileImage(cachedUri)
        }

        const attrs = await fetchUserAttributes()
        const email = attrs.email
        if (!email) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          )
        }

        const userData = await readUserProfile(userId, email)
        setFirstName(userData.firstName ?? '')
        setLastName(userData.lastName ?? '')
        setCreatedAt(userData.createdAt ?? '')

        const reviewData = await getReviewsByUser(userId)
        setReviews(reviewData ?? [])
      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [])

  
  useEffect(() => {
    loadAccountData()
  }, [loadAccountData])


  useFocusEffect(
    useCallback(() => {
      loadAccountData()
    }, [loadAccountData])
  )

  const fullInitials =
    (firstName?.[0] ?? '').toUpperCase() + (lastName?.[0] ?? '').toUpperCase()

  function formatMonthYear(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    const fmt = new Intl.DateTimeFormat(undefined, {
      month: 'long',
      year: 'numeric',
    })
    return fmt.format(d)
  }

  const memberSince = formatMonthYear(createdAt)

  const sortedReviews = useMemo(() => {
    const copy = [...reviews]

    const getDate = (rev: any) => {
      const raw = rev.createdAt ?? rev.CreatedAt;
      return raw ? new Date(raw).getTime() : 0;
    };

    const getRating = (rev: any) =>
      Number(rev.rating ?? rev.Rating ?? 0);

    switch (sortOption) {
      case 'dateNewest':
        return copy.sort((a, b) => getDate(b) - getDate(a))
      case 'dateOldest':
        return copy.sort((a, b) => getDate(a) - getDate(b))
      case 'ratingHigh':
        return copy.sort((a, b) => getRating(b) - getRating(a))
      case 'ratingLow':
        return copy.sort((a, b) => getRating(a) - getRating(b))
      default:
        return copy
    }
  }, [reviews, sortOption])

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView>
        <View className="flex-1 mt-5 gap-5 mb-5">
          <View className="flex-row items-center justify-center bg-white pb-12 gap-10 border-b border-secondary">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <View className="h-20 w-20 bg-accountOrange rounded-full items-center justify-center">
                <Text className="text-4xl font-bold text-white">
                  {fullInitials}
                </Text>
              </View>
            )}

            <View>
              <Text className="xsTitle">
                {firstName} {lastName}
              </Text>
              <Text className="xsTextGray">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Text>
              <Text className="xsTextGray">
                Member since {memberSince || '-'}
              </Text>
            </View>
          </View>

          <View className="flex-1 mx-5 gap-6">
            <View className="flex-row justify-between">
              <Text className="mediumTitle">Reviews</Text>
              <NormalButton
                variant="primary"
                text="Filter"
                icon={<icons.filter height={24} width={24} />}
                paddingHorizontal={20}
                onClick={() => {
                  setFilterOpen((f) => !f)
                }}
              />
            </View>

            {filterOpen && (
              <View className="mx-3 pt-4 pb-6 border-y border-stroke">
                <View className="flex-1 flex-row justify-between">
                  <Text className="xsTitle mb-3">Sort by</Text>
                  <Pressable onPress={() => setFilterOpen(false)}>
                    <icons.x height={24} width={24} />
                  </Pressable>
                </View>


                <View className="gap-3">
                  <View className="flex-1 flex-row gap-3">
                    <NormalButton
                      variant={
                        sortOption === 'dateNewest' ? 'primary' : 'outline'
                      }
                      text="Date: Newest - Oldest"
                      grow={true}
                      onClick={() => setSortOption('dateNewest')}
                    />
                    <NormalButton
                      variant={
                        sortOption === 'dateOldest' ? 'primary' : 'outline'
                      }
                      text="Date: Oldest - Newest"
                      grow={true}
                      onClick={() => setSortOption('dateOldest')}
                    />
                  </View>


                  <View className="flex-1 flex-row gap-3">
                    <NormalButton
                      variant={
                        sortOption === 'ratingHigh' ? 'primary' : 'outline'
                      }
                      text="Highest Rating First"
                      grow={true}
                      onClick={() => setSortOption('ratingHigh')}
                    />
                    <NormalButton
                      variant={
                        sortOption === 'ratingLow' ? 'primary' : 'outline'
                      }
                      text="Lowest Rating First"
                      grow={true}
                      onClick={() => setSortOption('ratingLow')}
                    />
                  </View>
                </View>
              </View>
            )}

            <View className="gap-4 pb-10">
              {sortedReviews.length === 0 ? (
                <Text className="smallTextGray text-center">
                  No reviews yet.
                </Text>
              ) : (
                sortedReviews.map((rev) => {
                  const mechId = rev.mechanicId ?? rev.MechanicId
                  const mechanic = mechId ? mechanicsById[String(mechId)] : null
                  const imageUri = mechanic?.Image ?? null
                  const mechanicName =
                    rev.mechanicName ?? mechanic?.name ?? mechId
                
                  return (
                    <Pressable
                      key={rev.reviewId ?? rev.ReviewId}
                      onPress={() =>
                        router.push({
                          pathname: '/mechanic/[id]/viewReview',
                          params: {
                            id: mechId,
                            reviewId: rev.reviewId ?? rev.ReviewId,
                          },
                        })
                      }
                      className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
                    >
                      <View className="flex-row gap-3">
                        {/* 🔹 Left: mechanic image */}
                        {imageUri ? (
                          <Image
                            source={{ uri: imageUri }}
                            className="w-14 h-14 rounded-lg"
                          />
                        ) : (
                          <View className="w-14 h-14 rounded-lg bg-accountOrange items-center justify-center">
                            <Text className="text-white font-bold">
                              {String(mechanicName ?? '?')[0]?.toUpperCase()}
                            </Text>
                          </View>
                        )}
                
                        {/* 🔹 Right: existing text & rating */}
                        <View className="flex-1">
                          <Text className="smallTitle" numberOfLines={1}>
                            {mechanicName}
                          </Text>
                
                          <Text className="smallTextGray" numberOfLines={2}>
                            {rev.review ?? rev.Review}
                          </Text>
                
                          <View className="flex-row items-center mt-2">
                            <Text className="mr-1">Rating</Text>
                            <StarRatingDisplay
                              color="black"
                              starSize={16}
                              starStyle={{ width: 4 }}
                              rating={Number(rev.rating ?? rev.Rating ?? 0)}
                            />
                            <Text className="ml-2">
                              ({rev.rating ?? rev.Rating}/5)
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  )
                })                
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default account
