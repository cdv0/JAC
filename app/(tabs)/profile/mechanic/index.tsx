// import {JSX, useCallback, useEffect, useState} from "react";
// import {Pressable, Text, TextInput, View} from "react-native";
// import {useFocusEffect, useRouter} from "expo-router";
// import { useForm } from "react-hook-form";

// export interface FormData{
//     name: string,
//     email: string,
//     password: string,

// }

// const profile = () => {
//     const [profileStatus, setProfileStatus] = useState<string>("");
//     const {
//         control,
//         handleSubmit,
//         formState: {errors, isSubmitting},
//         getValues,
//         setError,
//         clearErrors,
//         reset
//     } = useForm<FormData>({
//         defaultValues: {
//             name: "",
//             email: "",
//             password: ""} });

//             const signupOnClick = async (data: FormData) => {
//                 const {nextStep, userId} = await registerHandler(
//                     data.name,
//                     data.email,
//                     data.password
//                 )
//         if (nextStep === "CONFIRM_SIGNUP") {
//             setProfileStatus("VerifyAccount");
//         }
//     }
//     const verifyAccountClick = async () =>{
//         const email: string = getValues("email");
//         const result = await verifyAccountHandler(verifyAccountHandler, email)

//         if(result === "success") {
//             setVerifyCode("");
//             reset()
//             setProfileStatus("SignIn")
//         }
//     }
//     const router = useRouter();

//     c
//     }
