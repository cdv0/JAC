// app/mechanic/[id]/updateReview.tsx

import {
  updateReview,
  getSingleReview,
  getSingleMechanic,
  type Review,
  type Mechanic,
} from "@/_backend/api/review";
import { getCurrentUser } from "aws-amplify/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";
import NormalButton from "../../components/NormalButton"; // adjust path if needed

const UpdateReview = () => {
  const { id, reviewId } = useLocalSearchParams<{
    id: string;
    reviewId: string;
  }>();

  const [userId, setUserId] = useState<string>();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [originalReview, setOriginalReview] = useState<Review | null>(null);
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Helper: format date + stars (same as viewReview)
  function formatFullDate(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return fmt.format(d);
  }

  function renderStars(value: number) {
    const rounded = Math.round(value);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }

  // Load userId, review + mechanic details
  useEffect(() => {
    if (!id || !reviewId) {
      setErrorMsg("Missing mechanic or review information.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { userId } = await getCurrentUser();
        setUserId(userId);

        console.log("UpdateReview: userId, mechanicId, reviewId", {
          userId,
          mechanicId: id,
          reviewId,
        });

        // 1) Load existing review
        const reviewDetail = await getSingleReview(userId, reviewId);
        console.log("UpdateReview: reviewDetail", reviewDetail);
        setOriginalReview(reviewDetail);
        setRating(reviewDetail.rating);
        setReviewText(reviewDetail.review);

        // 2) Load mechanic banner info
        const mechDetail = await getSingleMechanic(id);
        console.log("UpdateReview: mechDetail", mechDetail);
        setMechanic(mechDetail);
      } catch (err: any) {
        console.log("UpdateReview: error loading data:", err);
        setErrorMsg(err?.message ?? "Unable to load review.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reviewId]);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) return;
    if (!userId) {
      console.error("User ID is not loaded yet");
      return;
    }
    if (!reviewId) {
      console.error("Review ID is missing");
      return;
    }

    try {
      setSubmitting(true);
      console.log("UpdateReview submit:", {
        mechanicId: id,
        userId,
        rating,
        reviewText: reviewText.trim(),
      });
      console.log("Updating reviewId:", reviewId, "userId:", userId, "rating:", rating, "review", reviewText.trim());
      await updateReview(reviewId, userId, rating, reviewText.trim());

      router.replace({
        pathname: "/mechanic/[id]/viewReview",
        params: { id, reviewId },
      });
    } catch (err) {
      console.error("UpdateReview: submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="smallTextGray mt-2">Loading review...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg || !originalReview) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="smallTextGray text-center">
            {errorMsg ?? "Review not found."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["right", "top", "left"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MECHANIC BANNER (from viewReview) */}
        <View className="flex-row items-center gap-3 bg-white mb-4">
          {mechanic?.imageUri ? (
            <Image
              source={{ uri: mechanic.imageUri }}
              className="w-16 h-16 rounded-lg bg-secondary"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-lg bg-secondary" />
          )}

          <View className="flex-1">
            <Text className="xsTitle">
              {mechanic?.name ?? `Mechanic ${originalReview.mechanicId}`}
            </Text>
            {mechanic?.address ? (
              <Text className="xsTextGray" numberOfLines={2}>
                {mechanic.address}
              </Text>
            ) : null}
          </View>
        </View>

        {/* EDIT FORM */}
        <View className="border border-stroke rounded-xl mb-6 p-4">
          <View className="flex-row mb-4">
            <Text className="buttonTextBlack mb-2">Rate your experience</Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              color="black"
              starSize={26}
            />
          </View>

          <View className="mb-2">
            <TextInput
              className="border border-stroke rounded-xl p-3 min-h-[140px]"
              multiline
              value={reviewText}             
              onChangeText={setReviewText}
              placeholder=""
            />
          </View>

          <NormalButton
            text={submitting ? "Saving..." : "Save"}
            onClick={handleSubmit}
          />
        </View>

        {/* SPACER */}
        <View className="h-6" />

        {/* PREVIOUS REVIEW (viewReview-style card) */}
        <View className="bg-[#F5F7FB] rounded-2xl p-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-1">
              <Text className="xsTitle">Previous rating:</Text>
              <Text className="xsTitle">
                {renderStars(originalReview.rating)}
              </Text>
            </View>
            <Text className="xsTextGray text-[11px]">
              {formatFullDate(originalReview.createdAt)}
            </Text>
          </View>

          <Text className="smallTextGray leading-5">
            {originalReview.review}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateReview;
