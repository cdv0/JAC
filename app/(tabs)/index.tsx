import { Text, View } from "react-native";
import SearchBar from "../components/SearchBar";


export default function Index() {
  return (
    <View
      className="flex-1 justify-center items-center"
    >
      <Text >Test</Text>
      <SearchBar placeholder1="Search" placeholder2="Location"/>
      <Text className="flex-1">Test</Text>
    </View>
  );
}
