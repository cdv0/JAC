import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";
import { icons } from "@/constants/icons";

import { deleteReview } from "@/_backend/api/review";

const DeleteReview = () => {
  const params = useLocalSearchParams<{
    id: string | string[];
    reviewId: string | string[];
    userId: string | string[];
  }>();
  const router = useRouter();

  const mechanicId =
    typeof params.id === "string" ? params.id : params.id?.[0];
  const reviewId =
    typeof params.reviewId === "string"
      ? params.reviewId
      : params.reviewId?.[0];

  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    try {
      setLoading(true);
      const { userId } = await getCurrentUser();
        console.log("user", userId, "reviewId", reviewId)
      await deleteReview(userId, reviewId);

      setModalVisible(false);

      // Go back to previous screen  
      router.back();
    } catch (err) {
      console.error("DeleteReview: error deleting review", err);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setModalVisible(false);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Grey overlay */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          {/* Popup box */}
          <View className="bg-white rounded-2xl w-[85%] p-6">
            <Text className="xsTitle mb-3">Delete confirmation</Text>

            <Text className="smallTextGray mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </Text>

            {/* Buttons */}
            <View className="flex-row justify-end gap-4">

              {/* Cancel */}
              <Pressable
                onPress={handleCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                <Text className="smallTitle">Cancel</Text>
              </Pressable>

              {/* Delete */}
              <Pressable
                onPress={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#D32F2F]"
              >
                <Text className="smallTitle text-white">
                  {loading ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeleteReview;
