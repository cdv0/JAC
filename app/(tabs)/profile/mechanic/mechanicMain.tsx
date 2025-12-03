import { readUserProfile } from "@/_backend/api/profile";
import { icons } from "@/constants/icons";
import { Image } from "react-native-svg";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";

import { useEffect, useState } from "react";
import { ActivityIndicator, DimensionValue, FlatList, Image, KeyboardAvoidingView, Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {ReactNativeModal as Modal} from 'react-native-modal';
import {SafeAreaView} from "react-native-safe-area-context";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import NormalButton from "@/app/components/NormalButton";



