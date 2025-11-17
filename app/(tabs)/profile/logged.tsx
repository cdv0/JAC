import { readUserProfile } from '@/_backend/api/profile'
import NormalButton from '@/app/components/NormalButton'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons';
import { getReviewsByUser } from '@/_backend/api/review'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { images } from "@/constants/images"

export const account = () => {
  const router = useRouter()
  //const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<string>('')

  const [filterOpen, setFilterOpen] = useState(false);

  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser()
        const attrs = await fetchUserAttributes() 
        const email = attrs.email
        if (!email) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          )
        }
        console.log('userid:', userId, 'email:', email)
        const userData = await readUserProfile(userId, email)
        setFirstName(userData.firstName ?? '')
        setLastName(userData.lastName ?? '')
        setCreatedAt(userData.createdAt ?? '')

        const reviewData = await getReviewsByUser(userId)
        console.log("Reviews:", reviewData)
        setReviews(reviewData ?? [])

      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [])

  // Initials from user's full name. Avoid 'NaN' as initials upon render
  const fullInitials = (firstName?.[0] ?? '').toUpperCase() + (lastName?.[0] ?? '').toUpperCase();
  
  function formatMonthYear(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
    return fmt.format(d);
  }

  const memberSince = formatMonthYear(createdAt);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView>
        <View className="flex-1 mt-5 gap-5 mb-5">
          {/* TOP ACCOUNT BANNER */}
          <View className="flex-row items-center justify-center bg-white pb-12 gap-10 border-b border-secondary">
            {/* DEFAULT PROFILE IMAGE (INITIALS) */}
            <View className="h-20 w-20 bg-accountOrange rounded-full items-center justify-center">
              <Text className="text-4xl font-bold text-white">{fullInitials}</Text>
            </View>

            {/* ACCOUNT METADATA */}
            <View>
              <Text className="xsTitle">{firstName} {lastName}</Text>
              {/* TODO: ADD NUMBER OF REVIEWS LOGIC */}
              <Text className="xsTextGray">0 reviews</Text>
              <Text className="xsTextGray">Member since { memberSince || '-' }</Text>
            </View>
          </View>

          {/* REVIEW SECTION */}
          <View className="flex-1 mx-5 gap-6">
            {/* TITLE AND FILTER BUTTON */}
            <View className="flex-row justify-between">
              <Text className="mediumTitle">Reviews</Text>
              <NormalButton 
                variant="primary" 
                text="Filter" 
                icon={<icons.filter height={24} width={24}/>}
                paddingHorizontal={20}
                onClick={() =>{setFilterOpen(f => !f)}}
              />
            </View>

            {/* FILTER OPEN */}
            {filterOpen && (
              <View className="mx-3 pt-4 pb-6 border-y border-stroke">
                {/* TITLE AND CLOSE BUTTON */}
                <View className="flex-1 flex-row justify-between">
                  <Text className="xsTitle mb-3">Sort by</Text>
                  <Pressable onPress={() => setFilterOpen(false)}>
                    <icons.x height={24} width={24}/>
                  </Pressable>
                </View>
                {/* 2x2 BUTTON GRID */}
                <View className="gap-3">
                  {/* TODO: ADD FILTER BUTTON LOGIC */}
                  {/* TOP BUTTON ROW */}
                  <View className="flex-1 flex-row gap-3">
                    <NormalButton variant="outline" text="Relevance" grow={true} onClick={() => {}}/>
                    <NormalButton variant="outline" text="Open now" grow={true} onClick={() => {}}/>
                  </View>
                  {/* BOTTOM BUTTON ROW */}
                  <View className="flex-1 flex-row gap-3">
                    <NormalButton variant="outline" text="Popular" grow={true} onClick={() => {}}/>
                    <NormalButton variant="outline" text="Rating" grow={true} onClick={() => {}}/>
                  </View>
                </View>
              </View>
            )}

            {/* REVIEW LIST */}
            <View className="gap-4 pb-10">
              
              {reviews.length === 0 ? (
                <Text className="smallTextGray text-center">No reviews yet.</Text>
              ) : (
                reviews.map((rev) => (
                  <View 
                    key={rev.reviewId}
                    className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
                  >
                    <Text className="smallTitle">{rev.mechanicId}</Text>
                    {/* Description */}
                    <Text className="smallTextGray">
                      {rev.review}
                    </Text>
                    {/* Rating */}
                    <View className = "flex-row">
                      <Text>Rating</Text>
                    <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} rating={parseFloat(rev.rating)}/>
                    <Text>   ({rev.rating}/5)</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default account