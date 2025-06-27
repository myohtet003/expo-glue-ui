import React, { useState } from "react";
import { Stack, useLocalSearchParams,useRouter } from "expo-router";
import { ScrollView } from "react-native";

import ViewPager from "@/components/shop/ViewPager";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import Cart from "@/components/shop/Cart";
import { products } from "@/data";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Icon, FavouriteIcon, StarIcon, CheckIcon, AddIcon, RemoveIcon, CloseCircleIcon } from "@/components/ui/icon";
import { CartItem } from "@/types";
import userCartStore from "@/store/CartStore";

import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckboxGroup,
} from "@/components/ui/checkbox";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast"

import {
  Actionsheet,
  ActionsheetContent, 
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet"  
import { Box } from "@/components/ui/box";

import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"

 
const Detail = () => {
  const [more, setMore] = useState(false);
  const {addToCart} = userCartStore();
  const router = useRouter();

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === +id);

  const [showActionsheet, setShowActionsheet] = useState(false)

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const handleClose = () => setShowActionsheet(false)
  const submitHandler = () => {
    setShowActionsheet(false)
    if(quantity === 0) {
      return;
    }
    colors.forEach((color) => {
      sizes.forEach((size) => {
        setCart((prev) => [{id:Math.random(), color, size, quantity} ,...prev])
      })
    })

    //reset
    setColors([]);
    setSizes([]);
    setQuantity(1);
  }

 
  const toast = useToast()
  const [toastId, setToastId] = useState(0)
  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(title, description)
    }
  }
  const showNewToast = (title: string, description: string) => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="info" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>
              {description}
            </ToastDescription>
          </Toast>
        )
      },
    }) 
  }

  const addCartToStore = () => {
    if(cart.length === 0) {
      handleToast("Cart is Empty!", "Please add items first to your cart!");
      return;
    }

    const cartProduct = {
      id: product!.id,
      title: product!.title,
      image: product!.image,
      price: product!.price,
      items: cart,
    }

    addToCart(cartProduct);
    setCart([]);
    router.back();
  }

  // console.log('first', product);
  return (
    <VStack className=" flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Product Title",
          headerBackTitle: "Home",
          headerRight: () => (
            <Pressable className=" mr-4">
              <Cart />
            </Pressable>
          ),
        }}
      />
      <ViewPager />
      <ScrollView>
        <VStack className="mt-4 px-5" space="sm">
          <HStack className=" items-center justify-between">
            <HStack space="sm" className="items-center">
              <Text className="font-semibold text-gray-500">
                {product?.brand}
              </Text>
              <Icon as={StarIcon} size="xs" className="text-orange-500" />
              <Text size="sm">{product?.star}</Text>
              <Text size="xs" className="text-gray-500">
                ({product?.quantity})
              </Text>
            </HStack>
            <Pressable>
              <Icon
                as={FavouriteIcon}
                className={`mr-2 h-5 w-5 ${product!.users?.length > 0 ? "fill-red-400" : ""} text-red-400`}
              />
            </Pressable>
          </HStack>
          <Text className="line-clamp-1 font-medium">{product?.title}</Text>
          <HStack space="sm">
            <Text className="font-medium text-green-700">
              ${product?.price.toFixed(2)}
            </Text>
            {product?.discount! > 0 && (
              <Text className="text-gray-500 line-through">
                ${product?.discount.toFixed(2)}
              </Text>
            )}
          </HStack>
          <VStack>
            <Text className={`${!more && " line-clamp-3"}`}>
              {product?.description}
            </Text>
            <Pressable onPress={() => setMore((p: boolean) => !p)}>
              <Text italic>{more ? "See less" : "See more"}</Text>
            </Pressable>
          </VStack>
          <Text className=" mb-1 mt-2 font-medium">Choose Colors</Text>
          <CheckboxGroup
            value={colors}
            onChange={(keys) => {
              setColors(keys);
            }}
          >
            <HStack space="xl">
              {product?.colors.map((item) => (
                <Checkbox
                  value={item.name}
                  key={item.id}
                  isDisabled={!item.stock}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{item.name}</CheckboxLabel>
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
          <Text className=" mb-1 mt-2 font-medium">Choose Sizes</Text>
          <CheckboxGroup
            value={sizes}
            onChange={(keys) => {
              setSizes(keys);
            }}
          >
            <HStack space="xl">
              {product?.sizes.map((item) => (
                <Checkbox
                  value={item.name}
                  key={item.id}
                  isDisabled={!item.stock}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{item.name}</CheckboxLabel>
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
          <Button size="lg" className="mt-6 rounded-lg self-start bg-sky-500" onPress={() => {
            if(colors.length > 0 && sizes.length > 0) {
              setShowActionsheet(true);
              return;
            }
            const title = `Must choose ${colors.length === 0 ? 'color -' : ''} ${sizes.length === 0 ? 'size' : ''}`;
            const description = 'Please set quantity just after choosing!';
            handleToast(title, description);
          }}>
            <ButtonText>Set Quantity</ButtonText>
          </Button>
          {totalItems > 0 && (
          <Text size="md" className="ml-2 font-semibold text-gray-500">
            Total Price - ${totalItems * Number(product?.price.toFixed(2))}
          </Text>
          )}
          {cart.length > 0 && (
            <VStack>
              {cart.map((c) => (
                <HStack key={c.id} space="sm" className=" items-center justify-between bg-slate-100 mb-2 px-2 py-1 rounded-md">
                  <HStack className=" items-center" space="md">
                    <Icon as={AddIcon} size="sm" />
                  <Text>{c.color} - {c.size} ( {c.quantity} )</Text>
                  </HStack>
                <Button className=" mr-5" size="lg" 
                variant="link"
                onPress={() => setCart((prev) => prev.filter((item) => item.id !== c.id))} //true or false
                >
                  <ButtonIcon as={CloseCircleIcon}/>
                </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
        <Box className=" h-40">
        </Box> 
      </ScrollView>
      <Fab
        size="md"
        placement="bottom right"
        className=" mb-24 bg-green-500"
        onPress={addCartToStore}
      >
        <FabIcon as={AddIcon} size="md"/>
        <FabLabel bold>Add to Cart</FabLabel>
      </Fab>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className=" w-full items-center justify-center pt-5">
            <Text bold>You chose colors and sizes</Text>
            <Text>{colors.join(", ")} - {sizes.join(", ")}</Text>
            <Text bold className=" mt-8">Please set quantity</Text>
            <Text className=" my-8 " bold size="5xl">{quantity}</Text>
            <HStack className=" w-full" space="lg">
              <Button size="lg" className=" flex-1 bg-sky-500" onPress={() => setQuantity(q => q + 1)}>
                <ButtonText>
                  Increase
                </ButtonText>
                <ButtonIcon as={AddIcon}/>
              </Button>
              <Button size="lg" className=" flex-1 bg-sky-500" onPress={() =>
                {if(quantity === 1) {
                  return;
                }
                setQuantity(q => q - 1)}}>
                <ButtonText>
                  Decrease
                </ButtonText>
                <ButtonIcon as={RemoveIcon}/>
              </Button>
            </HStack>
              <Button size="lg" className=" mb-2 mt-6 bg-green-500" onPress={submitHandler}>
                <ButtonText className=" font-bold flex-1 text-center">
                  Confirm
                </ButtonText> 
              </Button>
              <Button size="lg" className=" mb-12 bg-gray-500" onPress={handleClose}>
                <ButtonText className=" font-bold flex-1 text-center">
                  Cancel
                </ButtonText> 
              </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};

export default Detail;
