// app/mechanic/[id]/deleteReview.tsx

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";

import { deleteReview } from "@/_backend/api/review";
import DeleteModal from "@/app/components/DeleteModal"; 

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
  const paramUserId =
    typeof params.userId === "string"
      ? params.userId
      : params.userId?.[0];

  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    try {
      if (!reviewId) {
        console.log("DeleteReview: missing reviewId, aborting.");
        setModalVisible(false);
        router.back();
        return;
      }

      setLoading(true);

      let userIdToUse = paramUserId;
      if (!userIdToUse) {
        const { userId } = await getCurrentUser();
        userIdToUse = userId;
      }

      console.log("DeleteReview: deleting", {
        userId: userIdToUse,
        reviewId,
        mechanicId,
      });

      await deleteReview(userIdToUse, reviewId);
      setModalVisible(false);
      router.replace("/profile/logged");
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
    <SafeAreaView className="flex-1 bg-transparent">
      <DeleteModal
        visible={modalVisible}
        setHide={(visible) => {
          setModalVisible(visible);
          if (!visible && !loading) {
            router.back();
          }
        }}
        type="review"
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};

export default DeleteReview;
