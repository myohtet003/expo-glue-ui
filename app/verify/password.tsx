import { View, Text, Button } from "react-native";
import React from "react";

import { useAuthStore } from "@/store/AuthStore";

const Password = () => {
	const {login} = useAuthStore();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Password</Text>
	  <Button title="login" onPress={login}/>
    </View>
  );
};

export default Password;
