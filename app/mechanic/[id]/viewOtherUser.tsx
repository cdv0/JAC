// app/mechanic/[id]/viewOtherUser.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { getUserById, getReviewsByUser, PublicUser } from "@/_backend/api/review";

type SortOption = "dateNewest" | "dateOldest" | "ratingHigh" | "ratingLow";

const ViewOtherUser = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("dateNewest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatMonthYear(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    });
    return fmt.format(d);
  }

  const loadUserAndReviews = useCallback(async () => {
    if (!userId) {
      setError("No userId provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [userData, reviewData] = await Promise.all([
        getUserById(String(userId)),
        getReviewsByUser(String(userId)),
      ]);

      setUser(userData);
      setReviews(reviewData ?? []);
    } catch (e: any) {
      console.log("viewOtherUser: error loading data:", e);
      setError(e?.message || "Failed to load user.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserAndReviews();
  }, [loadUserAndReviews]);

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const fullInitials =
    (firstName?.[0] ?? "").toUpperCase() + (lastName?.[0] ?? "").toUpperCase();
  const memberSince = formatMonthYear(user?.createdAt);
  const reviewCount = reviews.length;

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];

    const getDate = (rev: any) => {
      const raw = rev.createdAt ?? rev.CreatedAt;
      return raw ? new Date(raw).getTime() : 0;
    };

    const getRating = (rev: any) =>
      Number(rev.rating ?? rev.Rating ?? 0);

    switch (sortOption) {
      case "dateNewest":
        return copy.sort((a, b) => getDate(b) - getDate(a));
      case "dateOldest":
        return copy.sort((a, b) => getDate(a) - getDate(b));
      case "ratingHigh":
        return copy.sort((a, b) => getRating(b) - getRating(a));
      case "ratingLow":
        return copy.sort((a, b) => getRating(a) - getRating(b));
      default:
        return copy;
    }
  }, [reviews, sortOption]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>{error || "User not found."}</Text>
      </SafeAreaView>
    );
  }

  return (
    // <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView className="bg-white pt-6">
        <View className="flex-1 mt-5 gap-5 mb-5">
          {/* ACCOUNT BANNER */}
          <View className="flex-row items-center justify-center bg-white pb-12 gap-10 border-b border-secondary">
            {/* Default profile image (initials) */}
            <View className="h-20 w-20 bg-accountOrange rounded-full items-center justify-center">
              <Text className="text-4xl font-bold text-white">
                {fullInitials}
              </Text>
            </View>

            <View>
              <Text className="xsTitle">
                {firstName} {lastName}
              </Text>
              <Text className="xsTextGray">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </Text>
              <Text className="xsTextGray">
                Member since {memberSince || "-"}
              </Text>
            </View>
          </View>

          {/* REVIEW SECTION */}
          <View className="flex-1 mx-5 gap-6">
            {/* Title + Filter button */}
            <View className="flex-row justify-between">
              <Text className="mediumTitle">Reviews</Text>
              <NormalButton
                variant="primary"
                text="Filter"
                icon={<icons.filter height={24} width={24} />}
                paddingHorizontal={20}
                onClick={() => setFilterOpen((f) => !f)}
              />
            </View>

            {/* Filter panel */}
            {filterOpen && (
              <View className="mx-3 pt-4 pb-6 border-y border-stroke">
                <View className="flex-1 flex-row justify-between">
                  <Text className="xsTitle mb-3">Sort by</Text>
                  <Pressable onPress={() => setFilterOpen(false)}>
                    <icons.x height={24} width={24} />
                  </Pressable>
                </View>

                <View className="gap-3">
                  <View className="flex-row flex-1 gap-3">
                    <NormalButton
                      variant={
                        sortOption === 'dateNewest' ? 'primary' : 'outline'
                      }
                      text="Newest to Oldest"
                      grow={true}
                      onClick={() => setSortOption('dateNewest')}
                    />
                    <NormalButton
                      variant={
                        sortOption === 'dateOldest' ? 'primary' : 'outline'
                      }
                      text="Oldest to Newest"
                      grow={true}
                      onClick={() => setSortOption('dateOldest')}
                    />
                  </View>

                  <View className="flex-row flex-1 gap-3">
                    <NormalButton
                      variant={
                        sortOption === 'ratingHigh' ? 'primary' : 'outline'
                      }
                      text="Highest Rating"
                      grow={true}
                      onClick={() => setSortOption('ratingHigh')}
                    />
                    <NormalButton
                      variant={sortOption === 'ratingLow' ? 'primary' : 'outline'}
                      text="Lowest Rating"
                      grow={true}
                      onClick={() => setSortOption('ratingLow')}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Reviews list */}
            <View className="gap-4 pb-10">
              {sortedReviews.length === 0 ? (
                <Text className="smallTextGray text-center">
                  No reviews yet.
                </Text>
              ) : (
                sortedReviews.map((rev) => (
                  <View
                    key={rev.reviewId ?? rev.ReviewId}
                    className="border-b border-stroke p-4"
                  >
                    {/* Mechanic name or id */}
                    <Text className="smallTitle">
                      {rev.mechanicName ??
                        rev.mechanicId ??
                        rev.MechanicId}
                    </Text>

                    {/* Review text */}
                    <Text className="smallTextGray">
                      {rev.review ?? rev.Review}
                    </Text>

                    {/* Rating */}
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
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    // </SafeAreaView>
  );
};

export default ViewOtherUser;
