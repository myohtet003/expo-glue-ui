import { View, Text } from 'react-native'
import React from 'react'
import { OtpInput } from "react-native-otp-entry";

import { useAuthStore } from '@/store/AuthStore';
import { useRouter } from 'expo-router';

const OtpScreen = () => {
	const {setPasswordScreen} = useAuthStore();
	const router = useRouter();

	const handleOtpScreen = (otp: string) => {
		setPasswordScreen()
		router.navigate('/verify/password')
	}
  return (
	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	  <Text>OtpScreen</Text>
	  <View style={{width: "80%", marginTop: 20}}>

	  <OtpInput numberOfDigits={6}
	  focusColor="green"
	  type='numeric'
	  onFilled={handleOtpScreen}
	//   onTextChange={(text) => console.log(text)} 
	  />
	  </View>
	</View>
  )
}

export default OtpScreen