import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Contact() {
    return (
      // <SafeAreaView className="bg-white flex-1" edges={['top', 'bottom']}>
        <View className=" bg-white rounded-xl h-full px-5 pt-3 pb-5 gap-1.5">
          <Text className="xsTitle">Message received</Text>
          <Text className="smallText">We have received your message. We'll get back to you shortly.</Text>
        </View>
      // </SafeAreaView>
    );
}