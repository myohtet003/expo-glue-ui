import { View, Text, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { OtpInput } from "react-native-otp-entry";
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/store/AuthStore';
import { formatTime } from '@/app/utils'; 

const OTP_TIMEOUT_MS = 90 * 1000;

const OtpScreen = () => {
	const {setPasswordScreen} = useAuthStore();
	const router = useRouter();

	const EndTimeRef = useRef(Date.now() + OTP_TIMEOUT_MS);
	const [timeLeft, setTimeLeft] = useState(() => Math.ceil((EndTimeRef.current - Date.now())));

	useEffect(() => {
	  const id = setInterval(() => {
		const diff = EndTimeRef.current - Date.now();
		setTimeLeft(Math.max(0, Math.ceil(diff / 1000)))
	  }, 500)
	
	  return () => clearInterval(id)
	}, [])
	

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
		{timeLeft > 0 ? <Text>Time Remaining - {formatTime(timeLeft)}</Text> : 
		<Button title='Resend OTP'
		onPress={() => {
			EndTimeRef.current = Date.now() + OTP_TIMEOUT_MS; //reset the timer
			setTimeLeft(Math.ceil(OTP_TIMEOUT_MS / 1000)); //reset the time left
		}}/>}
	</View>
  )
}

export default OtpScreen