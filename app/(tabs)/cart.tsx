import { Alert, SafeAreaView, ScrollView } from "react-native";
import { Image } from "expo-image";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

import { carts } from "@/data";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon, Icon, RemoveIcon } from "@/components/ui/icon";
import { TrashIcon } from "lucide-react-native";
import { Fab, FabIcon } from "@/components/ui/fab";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog"
import { useState } from "react";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function CartScreen() {

   const [showAlertDialog, setShowAlertDialog] =  useState(false)
  const handleClose = () => setShowAlertDialog(false)

  const deleteAlerts = () =>
    Alert.alert(
      "Delete All Items",
      "Are you sure you want to remove all items from the cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("All Items Deleted!"),
        },
      ]
    );
  return (
    <SafeAreaView className=" flex-1 px-4 bg-white">
      {carts.length === 0 ? (
        <Text>Empty Cart!</Text>
      ) : (
        <Box className=" flex-1">
          <Heading className=" my-2 mb-6 text-center">Shopping Cart</Heading>
          <ScrollView>
            <VStack space="md">
              {carts.map((product) => (
                <HStack
                  key={product.id}
                  className=" justify-between border-gray-200 px-4 py-3 border-2 rounded-lg mx-4"
                >
                  <VStack className=" w-1/4">
                    <Image
                      style={{
                        width: "50%",
                        aspectRatio: 3 / 4,
                        borderRadius: 5,
                      }}
                      source={product.image}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={1000}
                    />
                    <Text className=" line-clamp-1">{product.title}</Text>
                  </VStack>
                  <VStack className="w-3/4 pl-4" space="md">
                    {product.items.map((item) => (
                      <HStack
                        key={item.id}
                        space="3xl"
                        className=" justify-center items-center"
                      >
                        <VStack>
                          <Text size="sm" className=" font-light">
                            {item.color} - {item.size}
                          </Text>
                          <Text className=" text-gray-500">
                            ${product.price} - {item.quantity}
                          </Text>
                        </VStack>
                        <HStack space="xs" className=" items-center">
                          <Button
                            size="xs"
                            variant="outline"
                            className=" border-gray-300"
                          >
                            <ButtonIcon as={AddIcon} />
                          </Button>
                          <Text size="lg">{item.quantity}</Text>
                          <Button
                            size="xs"
                            variant="outline"
                            className=" border-gray-300"
                          >
                            <ButtonIcon as={RemoveIcon} />
                          </Button>
                          <Button
                            size="xs"
                            variant="link"
                            className=" border-gray-300 ml-2"
                            onPress={() => setShowAlertDialog(true)}
                          >
                            <ButtonIcon as={TrashIcon} />
                          </Button>
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>
                </HStack>
              ))}
            </VStack>
            <VStack className="px-4 ">
              <HStack className="my-6 justify-between">
                <Text bold>Total Price:</Text>
                <Text bold>$2700</Text>
              </HStack>
              <Button size="lg" className=" bg-green-500">
                <ButtonText>Checkout</ButtonText>
              </Button>
            </VStack>
          </ScrollView>
          <Fab size="md" placement="bottom right" className="bg-red-500 mb-16" onPress={deleteAlerts}>
            <FabIcon as={TrashIcon}  />
          </Fab>
        </Box>
      )}
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="w-full max-w-[415px] gap-4 items-center">
          <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
            <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
          </Box>
          <AlertDialogHeader className="mb-2">
            <Heading size="md">Delete this item?</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm" className="text-center">
              Are you sure? This product will be deleted from shopping cart. This cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-5">
            <Button
              size="sm"
              action="negative"
              onPress={handleClose}
              className="px-[30px]"
            >
              <ButtonText>Delete</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
              className="px-[30px]"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
