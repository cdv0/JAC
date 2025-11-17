// app/mechanic/[id]/viewReview.tsx

import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";

import {
  getSingleReview,
  getSingleMechanic,
  type Review,
  type Mechanic,
} from "@/_backend/api/review";

const ViewReview = () => {
  const params = useLocalSearchParams<{
    id: string | string[];
    reviewId: string | string[];
  }>();

  // Normalize params to strings in case they come in as string[]
  const mechanicId =
    typeof params.id === "string" ? params.id : params.id?.[0];
  const reviewId =
    typeof params.reviewId === "string"
      ? params.reviewId
      : params.reviewId?.[0];

  const [review, setReview] = useState<Review | null>(null);
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!mechanicId || !reviewId) {
      console.warn("ViewReview: missing mechanicId or reviewId", {
        mechanicId,
        reviewId,
      });
      setErrorMsg("Missing review information.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { userId } = await getCurrentUser();
        console.log("ViewReview: userId, mechanicId, reviewId", {
          userId,
          mechanicId,
          reviewId,
        });

        // 1) Load review detail
        const reviewDetail = await getSingleReview(userId, reviewId);
        console.log("ViewReview: reviewDetail", reviewDetail);
        setReview(reviewDetail);

        // 2) Load mechanic banner info
        const mechDetail = await getSingleMechanic(mechanicId);
        console.log("ViewReview: mechDetail", mechDetail);
        setMechanic(mechDetail);
      } catch (err: any) {
        console.log("ViewReview: error loading review detail:", err);
        setErrorMsg(err?.message ?? "Unable to load review.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mechanicId, reviewId]);

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

  function renderStars(rating: number) {
    const rounded = Math.round(rating);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="smallTextGray">Loading review...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg || !review) {
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
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* MECHANIC BANNER */}
        <View className="flex-row items-center gap-3 bg-white rounded-2xl border border-stroke px-3 py-3 mb-4">
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
              {mechanic?.name ?? `Mechanic ${review.mechanicId}`}
            </Text>
            {mechanic?.address ? (
              <Text className="xsTextGray" numberOfLines={2}>
                {mechanic.address}
              </Text>
            ) : null}
          </View>
        </View>

        {/* REVIEW CARD */}
        <View className="bg-[#F5F7FB] rounded-2xl p-4">
          {/* Rating row */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-1">
              <Text className="xsTitle">Rating:</Text>
              <Text className="xsTitle">{renderStars(review.rating)}</Text>
            </View>
            <Text className="xsTextGray text-[11px]">
              {formatFullDate(review.createdAt)}
            </Text>
          </View>

          {/* Review text */}
          <Text className="smallTextGray leading-5">
            {review.description}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewReview;
