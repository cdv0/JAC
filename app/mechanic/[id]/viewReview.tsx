// app/mechanic/[id]/viewReview.tsx

import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";

import { getSingleReview, getSingleMechanic,
  type Review,
  type Mechanic,
} from "@/_backend/api/review";
import { icons } from "@/constants/icons";

const ViewReview = () => {
  const params = useLocalSearchParams<{
    id: string | string[];
    reviewId: string | string[];
  }>();

  const navigation = useNavigation();
  const router = useRouter();

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
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState("");

  // Header 3-dot menu
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <Pressable
          onPress={() => setMenuVisible(true)}
          hitSlop={8}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
        >
          {/* Vertical three-dot icon */}
          <Text style={{ fontSize: 20, lineHeight: 20 }}>⋮</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

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
        setUserId(userId); 
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

  const handleUpdateReview = () => {
    setMenuVisible(false);
    if (!mechanicId || !reviewId) return;

    router.push({
      pathname: "/mechanic/[id]/updateReview",
      params: { 
        id: mechanicId,
        reviewId: reviewId,
        userId: userId
      },
    });
  };

  const handleDeleteReview = () => {
    setMenuVisible(false);
    console.log ("id", mechanicId, "reviewId", reviewId, "userid:", userId)
    router.push({
      pathname: "/mechanic/[id]/deleteReview",
      params: { id: mechanicId, reviewId, userId: userId },
    });
  };

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
      {/* Small popover menu near top-right */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "transparent" }}
          onPress={() => setMenuVisible(false)}
        >
          <View className="flex-1 items-end pt-12 pr-4">
            <View className="bg-white rounded-lg shadow-lg border border-stroke px-3 py-2">
              {/* Update review */}
              <Pressable
                className="flex-row items-center gap-2 py-2"
                onPress={handleUpdateReview}
              >
                {/* Use whatever icon you prefer; link/pencil etc. */}
                <icons.pencil width={16} height={16} />
                <Text className="smallTitle">Update reviews</Text>
              </Pressable>

              {/* Divider */}
              <View className="h-[1px] bg-stroke my-1" />

              {/* Delete review */}
              <Pressable
                className="flex-row items-center gap-2 py-2"
                onPress={handleDeleteReview}
              >
                <icons.trash width={16} height={16} />
                <Text className="smallTitle text-[#D32F2F]">
                  Delete review
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* MECHANIC BANNER */}
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
            {review.review}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewReview;
