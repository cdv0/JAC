import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from 'react-native-star-rating-widget';
import NormalButton from "../../components/NormalButton"; // adjust path if needed

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      return;
    }

    // TODO: call backend
    // await createMechanicReview({ mechanicId: id, rating, text: reviewText.trim() });

    router.replace({
      pathname: "/mechanic/[id]",
      params: { id },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["right", "top", "left"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >

        <View className="flex-row mb-6">
          <Text className="buttonTextBlack mb-2">Rate your experience</Text>
          <StarRating
            rating={rating}
            onChange={setRating}
            color="black"
            starSize={26}
          />
        </View>

        <View className="mb-6">
          <TextInput
            className="border border-stroke rounded-xl p-3 min-h-[140px]"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Tell us about your experience..."
          />
        </View>

        <NormalButton text="Submit" onClick={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
