// app/(tabs)/favorites.tsx

import React, { useEffect, useState, useCallback } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { getCurrentUser } from "aws-amplify/auth";

import {
  listFavoriteMechanics,
  type FavoriteMechanic,
  deleteFavoriteMechanic,          
} from "@/_backend/api/profile";
import { getMechanicById, type Mechanic } from "@/_backend/api/review";
import { images } from "@/constants/images";        

// --- helper copied/adapted from viewReview ---
function getMechanicImageUri(
  mechanic: Mechanic | null | undefined,
  fav?: FavoriteMechanic
): string | undefined {
  if (mechanic) {
    const img =
      (mechanic as any).Image ??
      (mechanic as any).image ??
      (mechanic as any).imageUrl;

    if (typeof img === "string" && img.length > 0) {
      return img;
    }
  }

  // If you ever change imageId to store full URLs, this will start working
  if (fav?.imageId && fav.imageId.startsWith("http")) {
    return fav.imageId;
  }

  return undefined;
}

export const favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteMechanic[]>([]);
  const [mechanicsById, setMechanicsById] = useState<
    Record<string, Mechanic | null>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser();
        const items = await listFavoriteMechanics(userId);
        setFavorites(items);

        // Load mechanic details for all unique mechanicIds
        const mechanicIds = [
          ...new Set(
            items
              .map((f) => f.mechanicId)
              .filter((id): id is string => Boolean(id))
          ),
        ];

        if (mechanicIds.length === 0) {
          setMechanicsById({});
          return;
        }

        const entries = await Promise.all(
          mechanicIds.map(async (id) => {
            try {
              const mech = await getMechanicById(String(id));
              return [String(id), mech] as const;
            } catch (e) {
              console.log("Favorites: failed to load mechanic", id, e);
              return [String(id), null] as const;
            }
          })
        );

        setMechanicsById(Object.fromEntries(entries));
      } catch (e) {
        console.log("Favorites: failed to load favorites", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUnfavorite = useCallback(
    async (fav: FavoriteMechanic) => {
      try {
        await deleteFavoriteMechanic({
          userId: fav.userId,
          mechanicId: fav.mechanicId,
        });

        setFavorites((prev) =>
          prev.filter(
            (x) =>
              !(
                x.userId === fav.userId &&
                x.mechanicId === fav.mechanicId
              )
          )
        );
      } catch (e) {
        console.log("Favorites: failed to unfavorite", e);
      }
    },
    []
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="gap-4 p-5 pb-10">
        {favorites.length === 0 ? (
          <Text className="text-center smallTextGray">
            No favorite mechanics yet.
          </Text>
        ) : (
          favorites.map((fav) => {
            const mechId = fav.mechanicId;
            const mechanic = mechId ? mechanicsById[String(mechId)] : null;
            const imageUri = getMechanicImageUri(mechanic, fav);
            const mechanicName =
              mechanic?.name ?? fav.name ?? fav.mechanicId;

            return (
              <View
                key={`${fav.userId}-${fav.mechanicId}`}
                className="p-4 bg-white border-b border-stroke"
              >
                <View className="flex-row items-center gap-3">
                  {/* LEFT: tappable area → go to mechanic details */}
                  <Pressable
                    className="flex-row gap-3 flex-1"
                    onPress={() =>
                      router.push({
                        pathname: "/mechanic/[id]",
                        params: { id: fav.mechanicId },
                      })
                    }
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        className="w-24 h-24 rounded-lg"
                      />
                    ) : (
                      <View className="items-center justify-center w-20 h-20 rounded-lg bg-accountOrange">
                        <Text className="font-bold text-white">
                          {String(mechanicName ?? "?")[0]?.toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="smallTitle" numberOfLines={1}>
                        {mechanicName}
                      </Text>

                      {/* Rating + review text */}
                      <View className="mt-2">
                        <StarRatingDisplay
                          color="black"
                          starSize={16}
                          rating={Number(fav.ratings ?? 0)}
                        />
                        <Text className="mt-1 smallTextGray">
                          {fav.ratings?.toFixed?.(1) ?? "0.0"}/5 ·{" "}
                          {fav.reviews ?? 0}{" "}
                          {(fav.reviews ?? 0) === 1 ? "review" : "reviews"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>

                  {/* RIGHT: heart for unfavoriting */}
                  <Pressable
                    onPress={() => handleUnfavorite(fav)}
                    hitSlop={8}
                  >
                    <images.favoriteFilled width={24} height={24} />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default favorites;
