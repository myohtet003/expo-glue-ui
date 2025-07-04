import { Text } from 'react-native'
import {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import {base_url } from '@/constants/index';

type User = {
	id: string,
	name: string
};

const fetchUsers = async () => {
	const response = await fetch(base_url + "users")
	if(!response.ok) {
		throw new Error('Fail to load Users')
	}
	return response.json();
}
const Profile = () => {

	const [users, setUsers] = useState<User[] | null>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUsers = async () => {
			try{
				const data = await fetchUsers();
				setUsers(data)
			}catch(error){
				console.error('Error Fetching Users:' , error);
			}finally{
				setLoading(false)
			}
		}
		getUsers();
	}, []);
  return (
	<SafeAreaView>
		{loading ? ( 
			<Text> Loading.....</Text>
		) : (

			users?.map((user) => <Text key={user.id}>{user.name}</Text>)
		)}
	  <Text>Profile</Text> 
	</SafeAreaView>
  )
}

export default Profile