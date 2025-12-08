import NormalButton from '@/app/components/NormalButton';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { sendContactEmail } from '@/_backend/api/profile';

export default function Contact() {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitForm = async () => {
    setSubmitted(true);

    if (!Name.trim() || !Email.trim() || !Message.trim()) {
      return;
    }

    const formData = { Name, Email, Message };
    console.log('Contact form submitted (frontend):', formData);

    try {
      setLoading(true);
      const payload = {
        name: Name,
        email: Email,
        message: Message,
      };
      console.log('Sending payload to API:', payload);
      await sendContactEmail(payload);

      router.push('/(tabs)/profile/settings/contactConfirm');
    } catch (error: any) {
      console.error('Error sending contact email:', error);
      Alert.alert(
        'Error',
        error?.message || 'Something went wrong while sending your message.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isNameInvalid = submitted && !Name.trim();
  const isEmailInvalid = submitted && !Email.trim();
  const isMessageInvalid = submitted && !Message.trim();

  return (
    <View className="flex-1 bg-white">
      <View className="rounded-xl px-5 pt-3 pb-5 gap-3 mt-3 mx-3">
        {/* Name */}
        <View className="gap-2">
          <View className="flex-row">
            <Text style={{ fontWeight: '600', color: 'black' }}>Your name</Text>
            <Text style={{ color: '#FF4D4D' }}> *</Text>
          </View>
          <TextInput
            value={Name}
            placeholder="Name"
            keyboardType="default"
            onChangeText={setName}
            className={`border rounded-full px-4 py-2 ${
              isNameInvalid ? 'border-dangerBrightRed' : 'border-stroke'
            }`}
          />
          {isNameInvalid ? (
            <Text style={{ color: '#FF4D4D', marginLeft: 8 }}>Name is required</Text>
          ) : null}
        </View>

        {/* Email */}
        <View className="gap-2">
          <View className="flex-row">
            <Text style={{ fontWeight: '600', color: 'black' }}>Your email</Text>
            <Text style={{ color: '#FF4D4D' }}> *</Text>
          </View>
          <TextInput
            value={Email}
            placeholder="Email"
            keyboardType="default"
            onChangeText={setEmail}
            className={`border rounded-full px-4 py-2 ${
              isEmailInvalid ? 'border-dangerBrightRed' : 'border-stroke'
            }`}
          />
          {isEmailInvalid ? (
            <Text style={{ color: '#FF4D4D', marginLeft: 8 }}>Email is required</Text>
          ) : null}
        </View>

        {/* Message */}
        <View className="gap-2">
          <View className="flex-row">
            <Text style={{ fontWeight: '600', color: 'black' }}>Message</Text>
            <Text style={{ color: '#FF4D4D' }}> *</Text>
          </View>

          <TextInput
            value={Message}
            multiline
            numberOfLines={6}
            placeholder="Message"
            keyboardType="default"
            onChangeText={setMessage}
            className={`border rounded-xl px-4 py-2 h-32 ${
              isMessageInvalid ? 'border-dangerBrightRed' : 'border-stroke'
            }`}
          />
          {isMessageInvalid ? (
            <Text style={{ color: '#FF4D4D', marginLeft: 8 }}>Message is required</Text>
          ) : null}
        </View>

        {/* Submit */}
        <View className="pt-5">
          <NormalButton
            variant="primary"
            text={loading ? 'Sending...' : 'Submit'}
            onClick={submitForm}
          />
        </View>
      </View>
    </View>
  );
}