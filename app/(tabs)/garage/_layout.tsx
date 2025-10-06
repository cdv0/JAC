import NormalButton from "@/app/components/NormalButton";
import { icons } from "@/constants/icons";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const garage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

   if (isAuthenticated === false) {
      return (
        <SafeAreaView
          className="flex-1 items-center justify-center"
          edges={["top", "bottom"]}
        >
            <View className="flex-1 items-center justify-center gap-2.5 w-4/5">
              <icons.lock width={65} height={65} />
              <Text className="smallTitle text-center">Your garage is waiting</Text>
              <Text className="smallTextGray text-center">
                Sign in to view your saved vehicles and maintenance history.
              </Text>
              <NormalButton
                text="Log in"
                paddingHorizontal={20}
                variant="primary"
                onClick={() => router.replace("/profile")}
              />
            </View>
        </SafeAreaView>
      );
    }

    if (isAuthenticated === true) {
      router.replace("/garage/garageHome");
      return null;
    }
};

export default garage;
