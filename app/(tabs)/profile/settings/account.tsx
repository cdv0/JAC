import { readUserProfile } from '@/_backend/api/profile'
import { icons } from '@/constants/icons'
import { confirmUserAttribute, fetchUserAttributes, getCurrentUser, updateUserAttribute } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import { Alert, Button, Modal, Pressable, Text, TextInput, View } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Account() {

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    
    const [updateEmailVisibile, setUpdateEmailVisible] = useState(false)
  
    useEffect(() => {
      ;(async () => {
        try {
          const { userId } = await getCurrentUser()
          const attrs = await fetchUserAttributes() 
          const email = attrs.email
          if (!email) {
            throw new Error(
              'No email on the Cognito profile (check pool/app-client readable attributes).'
            )
          }
          const userData = await readUserProfile(userId, email)
          setFirstName(userData.firstName ?? '')
          setLastName(userData.lastName ?? '')
          setEmail(attrs.email ?? '')
        } catch (e: any) {
          console.log('Account: Error loading user data:', e)
          console.log('Account: Error message:', e.message)
        }
      })()
    }, [firstName, lastName])

      const [newEmail, setNewEmail] = useState('');
      const [verificationCode, setVerificationCode] = useState('');
      const [isVerifying, setIsVerifying] = useState(false);

      const handleUpdateEmail = async () => {
        try {
          const output = await updateUserAttribute({
            userAttribute: {
              attributeKey: 'email',
              value: newEmail,
            },
          });
          console.log(output)
          handleUpdateUserAttributeNextSteps(output);
        } catch (error: any) {
          console.log('Error updating email:', error);
          Alert.alert('Error', error.message);
        }
      };

      const handleUpdateUserAttributeNextSteps = (output: any) => {
        const { nextStep } = output;
        switch (nextStep.updateAttributeStep) {
          case 'CONFIRM_ATTRIBUTE_WITH_CODE':
            setIsVerifying(true);
            Alert.alert(
              'Verification Required',
              'A code has been sent to your new email address to confirm the change.',
            );
            break;
          case 'DONE':
            Alert.alert('Success', 'Your email address has been updated!');
            // Optionally navigate away or reset state
            setIsVerifying(false);
            setNewEmail('');
            break;
        }
      };
    
      // Handle the verification code submission
      const handleVerifyEmail = async () => {
        try {
          await confirmUserAttribute({
            userAttributeKey: 'email',
            confirmationCode: verificationCode,
          });
          Alert.alert('Success', 'Your email address has been successfully updated!');
          // Reset state and potentially navigate the user back
          setIsVerifying(false);
          setNewEmail('');
          setVerificationCode('');
          setUpdateEmailVisible(!updateEmailVisibile)
        } catch (error: any) {
          console.log('Error confirming email:', error);
          Alert.alert('Error', error.message);
        }
      };

  return (
    <SafeAreaView className="flex-col" edges={['top', 'bottom']}>
      <View className="flex-col justify-start">
        <View className="h-full px-2 pt-3">
          
          <View className="bg-white rounded-xl">
            <Pressable className="flex-row justify-between px-5 pt-5 pb-3">
              <Text className="font-semibold text-textBlack">Name</Text>
              <View className="flex-row">
              <Text className="font-semibold text-textBlack">{firstName} {lastName}</Text>
              <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>

            
            <Pressable
              className="flex-row justify-between px-5 py-3"
              onPress={()=>{setUpdateEmailVisible(!updateEmailVisibile)}}
            >
              <Text className="font-semibold text-textBlack">Email</Text>
              <View className="flex-row">
                <Text className="flex-row font-semibold text-textBlack">{email}</Text>
              <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
            <Pressable
              className="flex-row justify-between px-5 py-3"
            >
              <Text className="font-semibold text-textBlack">Password</Text>
              <View className="flex-row">
                <Text className="font-semibold text-textBlack">*********</Text>
                <ChevronRightIcon size={28} color="#000" />
              </View>
            </Pressable>
          </View>
        </View>
        <Modal visible={updateEmailVisibile}>
          <SafeAreaView>
          <Pressable
              onPress={() => {setUpdateEmailVisible(!updateEmailVisibile)}}
              className="flex-row items-center px-2"
              hitSlop={2}
            >
              <icons.chevBack width={24} height={24} fill="#1B263B" />
              <Text className="ml-1 text-primaryBlue text-[15px] font-medium">
                Back
              </Text>
            </Pressable>
            <View>
              {!isVerifying ? (
                <View>
                  <Text className="largeTitle">Update Email</Text>
                  <TextInput
                    placeholder="New Email"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`border rounded-full px-4 py-2 smallTextGray`}
                  />
                  <Button title="Update Email" onPress={handleUpdateEmail} />
                </View>
              ) : (
                <View>
                  <Text>Verify New Email</Text>
                  <Text>Enter the verification code sent to {newEmail}.</Text>
                  <TextInput
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="numeric"
                    className={`border rounded-full px-4 py-2 smallTextGray`}
                  />
                  <Button title="Verify Code" onPress={handleVerifyEmail} />
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal> 
      </View>
    </SafeAreaView>
    )
  }

