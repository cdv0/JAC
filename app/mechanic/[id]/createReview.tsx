import { createReview } from '@/_backend/api/review';
import { getCurrentUser } from 'aws-amplify/auth';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from 'react-native-star-rating-widget';
import NormalButton from "../../components/NormalButton"; // adjust path if needed

export const account = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState<string>();


  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser()
        setUserId(userId);
        console.log('userid:', userId)
      } catch (e: any) {
        console.log('Account: Error loading user data:', e)
        console.log('Account: Error message:', e.message)
      }
    })()
  }, [])

  const handleSubmit = async () => {
  if (!rating || !reviewText.trim()) return;
  if (!userId) {
    console.error("User ID is not loaded yet");
    return;
  }

  try {
    console.log('mechanicid:', id, 'userid:', userId, 'rating:', rating, 'reviewText:', reviewText.trim());
    await createReview(id, userId, rating, reviewText.trim());
    
    router.replace({
      pathname: "/mechanic/[id]",
      params: {id},
    });
  } catch (err) {
    console.error(err);
  }
};

  return (
    // <SafeAreaView className="flex-1 bg-white" edges={["right", "top", "left"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        className="bg-secondary"
      >
        <View className=" bg-white border border-stroke rounded-xl mb-6 p-4">
        <View className="flex-row mb-6">
          <Text className="buttonTextBlack">Rate your experience  </Text>
          <StarRating
            rating={rating}
            onChange={setRating}
            color="black"
            starSize={26}
          />
        </View>
        <View className="mb-3">
          <TextInput
            className="border border-stroke rounded-xl p-3 min-h-[140px]"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Tell us about your experience..."
          />
        </View>
        </View>

        <NormalButton text="Submit" onClick={handleSubmit} />
      </ScrollView>
    // </SafeAreaView>
  );
}

export default account