import { Text } from 'react-native' 
import { SafeAreaView } from 'react-native-safe-area-context' 
import { useAuthStore } from '@/store/AuthStore';

 
const Profile = () => {
	const { logout } = useAuthStore();

  return (
	<SafeAreaView>
		<Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          logout();
        }}>
        Sign Out
      </Text>
	</SafeAreaView>
  )
}

export default Profile