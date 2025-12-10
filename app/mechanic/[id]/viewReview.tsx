// app/mechanic/[id]/viewReview.tsx

import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
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

import {
  getSingleReview,
  getMechanicById,
  type Review,
  type Mechanic,
} from "@/_backend/api/review";
import { icons } from "@/constants/icons";

import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth"
import { readUserProfile } from "@/_backend/api/profile";

const loadData = useCallback(async () =>{
  const {userId} = await getCurrentUser();
  const attributes = await fetchUserAttributes();
  const email = attributes.email;
  if(!email){
    throw new Error("User email not found");
  }
  const userData = await readUserProfile(userId, email);
}, [])

// 🔹 Helper: turn imageKey into a full image URL
// Update this to match how you usually build S3 URLs in your app.
function getMechanicImageUri(mechanic: Mechanic | null): string | undefined {
  if (!mechanic) return undefined;

  // This matches what you're already using in Details.tsx
  const img =
    (mechanic as any).Image ??
    (mechanic as any).image ??
    (mechanic as any).imageUrl;

  if (typeof img === "string" && img.length > 0) {
    return img;
  }

  return undefined;
}


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

        // 2) Load mechanic info via getMechanicById
        try {
          const mechDetail = await getMechanicById(mechanicId);
          console.log(
            "ViewReview: mechDetail from getMechanicById",
            mechDetail, 
          );

          if (!mechDetail) {
            console.log(
              "ViewReview: No mechanic found for mechanicId:",
              mechanicId
            );
          }

          setMechanic(mechDetail);
        } catch (err: any) {
          console.log("ViewReview: getMechanicById error", err);
        }
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
        userId: userId,
      },
    });
  };

  const handleDeleteReview = () => {
    setMenuVisible(false);
    console.log("id", mechanicId, "reviewId", reviewId, "userid:", userId);
    router.push({
      pathname: "/mechanic/[id]/deleteReview",
      params: { id: mechanicId, reviewId, userId: userId },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="smallTextGray">Loading review...</Text>
        </View>
      </View>
    );
  }

  if (errorMsg || !review) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="smallTextGray text-center">
            {errorMsg ?? "Review not found."}
          </Text>
        </View>
      </View>
    );
  }

  const mechanicImageUri = getMechanicImageUri(mechanic);

  return (
    <View className="flex-1 bg-secondary">
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
            <View className="bg-white rounded-lg border border-stroke px-3 py-2">
              {/* Update review */}
              <Pressable
                className="flex-row items-center gap-2 py-2"
                onPress={handleUpdateReview}
              >
                <icons.pencil width={24} height={24} />
                <Text className="xsTitle">Update review</Text>
              </Pressable>

              {/* Divider */}
              <View className="h-[1px] bg-stroke my-1" />

              {/* Delete review */}
              <Pressable
                className="flex-row items-center gap-2 py-2"
                onPress={handleDeleteReview}
              >
                <icons.trash width={24} height={24} />
                <Text className="xsTitle text-[#D32F2F]">
                  Delete review
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
        {/* MECHANIC HEADER CARD: image + name + address */}
        {mechanic && (
          <View className="flex-row items-center bg-white px-4 py-3 mb-4">
            {/* Image */}
            {mechanicImageUri && (
              <Image
                source={{ uri: mechanicImageUri }}
                className="w-24 h-24 rounded-xl mr-3"
              />
            )}

            {/* Name + address */}
            <View className="flex-1">
              <Text className="smallTitle" numberOfLines={1}>
                {mechanic.name}
              </Text>
              <Text className="smallTextGray mt-1" numberOfLines={2}>
                {mechanic.address}
              </Text>
            </View>
          </View>
        )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* REVIEW CARD */}
        <View className="bg-white rounded-xl p-4">
          {/* Rating row */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-1">
              <Text className="xsTitle">Rating:</Text>
              <Text className="xsTitle">{renderStars(review.rating)}</Text>
            </View>
            <Text className="smallTextGray">
              {formatFullDate(review.createdAt)}
            </Text>
          </View>

          {/* Review text */}
          <Text className="smallTextGray leading-5">{review.review}</Text>
        </View>
      </ScrollView>
      </View>
  );
};

export default ViewReview;
