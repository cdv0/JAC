import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Contact() {
    return (
      <SafeAreaView className="bg-white flex-1" edges={['top', 'bottom']}>
        <View className="rounded-xl px-5 pt-3 pb-5 gap-3 mt-3 mx-3">
          <Text className="mediumTitle">Message received</Text>
          <Text className="smallText">We have received your message. We'll get back to you shortly.</Text>
        </View>
      </SafeAreaView>
    );
}