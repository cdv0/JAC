Create expo-env.d-ts file with the given code
/// <reference types="expo/types" />

to ensure no errors when running expo

npx expo install @react-native-community/slider

npm expo install react-native-star-rating-widget

npx expo install react-native-maps

npx expo install expo-location

**Effects can only be see in respective device emulators**

# Android 

**Install android studios**

rmdir /s /q android

npx expo run:android

**If above command fails**

create a file called "local.properties" in android folder

in local properites enter "sdk.dir=[path to sdk]"

then run npx expo run:android again

**Check sdk manager in android studios**