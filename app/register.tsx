import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";

import { useAuthStore } from "@/store/AuthStore";
import { HStack } from "@/components/ui/hstack";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading"; 
import { Button, ButtonText } from "@/components/ui/button"; 

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText, 
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
// import { Text, View, TextInput, Button, Alert } from "react-native"
import { useForm, Controller } from "react-hook-form";
import { authApi } from "@/api";

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { isAxiosError } from "axios";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Register() {
  const router = useRouter();
  const { setOtpScreen } = useAuthStore(); 
  const [isSubmitting, setIsSubmitting] = useState(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "", 
    },
  });

  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(title, description);
    }
  };
  const showNewToast = (title: string, description: string) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="error" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const onSubmit = async (formState: any) => {
    //console.log(formState);
    setIsSubmitting(true); 
    try {
      const response = await authApi.post("register", {
        phone:  formState.phone,
      });

      console.log("Sing Up successful:", response.data);
      const { phone, token } = response.data; 
      setOtpScreen(phone, token);
      router.navigate("/verify");
    } catch (error) {
      // console.error("Login failed:", error);
      if (isAxiosError(error)) {
        // Handle Axios error
        // console.error("Axios error:", error.response?.data);
        handleToast(
          "Registration failed!",
          error.response?.data.message || "An error occurred during Registration."
        );
      } else {
        // Handle other errors
        handleToast("Registration failed!", "An error occurred during Registration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className=" flex-1 bg-white">
      <View className=" flex-1 px-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          <HStack space="xs" className="mt-3 items-center justify-end">
            <Image
              style={{ width: 40, height: 40 }}
              source={require("@/assets/images/react-logo.png")}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
            <Text size="xl" bold>
              Fashion
            </Text>
          </HStack>
          <VStack space="4xl">
            <VStack space="lg">
              <Heading size="3xl" className=" leading-snug">
                Sign Up {"\n"}To create an Account
              </Heading>
              <Text size="lg" className=" text-gray-500 font-semibold">
                Already have an account ? {" "}
                <Link href="/login" className=" text-sky-600 underline">Sign In</Link>
              </Text>
            </VStack>
            <FormControl
              // isInvalid={isInvalid}
              size="lg"
              // isDisabled={false}
              // isReadOnly={false}
              // isRequired={false}
            >
              <VStack space="xs">
                <FormControlLabel>
                  <FormControlLabelText className=" text-lg text-gray-500 font-semibold">
                    Phone Number
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Phone Number is required!",
                    },
                    minLength: {
                      value: 7,
                      message: "This is not valid phone number!",
                    },
                    maxLength: {
                      value: 12,
                      message: "This is not valid phone number!",
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: "Please enter digits only!",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className=" h-16 rounded-lg border-gray-200"
                      size="xl"
                    >
                      <InputField
                        type="text"
                        placeholder="0976******2"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        inputMode="numeric"
                        maxLength={12}
                      />
                    </Input>
                  )}
                  name="phone"
                />
                {errors.phone && (
                  <Text size="md" className=" text-red-500">
                    {errors.phone.message}
                  </Text>
                )}
              </VStack>
               
            </FormControl>
            
            <Button
              className="h-16 rounded-lg bg-sky-600"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <ButtonText className=" text-lg font-bold">Sign Up</ButtonText>
              )}
            </Button>
          </VStack>
           
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
