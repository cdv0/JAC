import NormalButton from "@/app/components/NormalButton";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1 justify-start">
        <View className="flex-1 mx-5 mt-6">
          {/* Banner */}
          <View
            style={{
              position: "relative",
              height: 200,
              backgroundColor: "#a1abb6ff",
              justifyContent: "start",
              alignItems: "center",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <View className="flex-row justify-start mt-4">
            <NormalButton text="< Back" onClick={() => router.back()} />
            </View>
            <Text className="mt-6 text-base">Settings</Text>
          </View>

          {/* Sign out */}
          <View className="flex-row justify-center mt-5">
            <NormalButton
              text="Sign Out"
              paddingHorizontal={10}
              variant="primary"
              onClick={async () => {
                try {
                  await signOut();
                  router.replace("/profile"); // go to your public/profile route
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
