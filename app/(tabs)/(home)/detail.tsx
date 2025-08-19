import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { VStack } from "@/components/ui/vstack";
import ViewPager from "@/components/shop/ViewPager";
import { Pressable } from "@/components/ui/pressable";
import Cart from "@/components/shop/Cart";
import { Text } from "@/components/ui/text";
// import { products } from "@/data";
import { ScrollView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import {
  Icon,
  FavouriteIcon,
  StarIcon,
  CheckIcon,
  AddIcon,
  RemoveIcon,
  CloseCircleIcon,
} from "@/components/ui/icon";
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
} from "@/components/ui/toast";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import useCartStore from "@/store/CartStore";
import type { CartItem } from "@/types";
import { fetchProduct } from "@/api/fetch";
import { Skeleton } from "@/components/ui/skeleton";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: product,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(+id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [more, setMore] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  // const product = products.find((p) => p.id === +id);
  const { addToCart } = useCartStore();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const [quantity, setQuantity] = useState(1);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(false);
  const submitHandler = () => {
    setShowActionsheet(false);
    if (quantity === 0) {
      return;
    }
    colors.forEach((color) => {
      sizes.forEach((size) => {
        setCart((prev) => [
          { id: Math.random(), color, size, quantity },
          ...prev,
        ]);
      });
    });
    //Reset
    setColors([]);
    setSizes([]);
    setQuantity(1);
  };

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
          <Toast nativeID={uniqueToastId} action="info" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  if (isPending) {
    return (
      <Box className="justify-center">
        <Skeleton variant="sharp" className=" h-[270px] w-full" />

        {/* One line of skeleton text */}
        <Skeleton className="mt-2 h-4 w-1/2 rounded" />

        {/* Second line of skeleton text (optional) */}
        <Skeleton className="mt-2 h-4 w-1/3 rounded" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text className="mb-4">Error: {error?.message}</Text>
        <Button size="md" variant="solid" action="primary" onPress={refetch}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  const addCartToStore = () => {
    if (cart.length === 0) {
      handleToast("Cart is empty", "Please add items to your cart first");
      return;
    }

    const cartProduct = {
      id: product!.id,
      title: product!.title,
      image: product!.image,
      price: product!.price,
      items: cart,
    };

    addToCart(cartProduct);
    setCart([]);
    router.back();
  };

  return (
    <VStack className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Product Detail",
          headerBackTitle: "Home",
          headerRight: () => (
            <Pressable className="mr-4">
              <Cart />
            </Pressable>
          ),
        }}
      />
      <ViewPager />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="mt-4 px-5" space="sm">
          <HStack className="items-center justify-between">
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
                className={`mr-2 h-5 w-5 ${product!.users?.length > 0 && "fill-red-400"} text-red-400`}
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
            <Text className={`${!more && "line-clamp-3"}`}>
              {product?.description}
            </Text>
            <Pressable onPress={() => setMore((p) => !p)}>
              <Text italic>{more ? "See less" : "See more"}</Text>
            </Pressable>
          </VStack>
          <Text className="mb-1 mt-2 font-medium">Choose Colors</Text>
          <CheckboxGroup
            value={colors}
            onChange={(keys) => {
              setColors(keys);
            }}
          >
            <HStack space="xl">
              {product?.colors.map((item) => (
                <Checkbox
                  value={item.color.name}
                  key={item.color.id}
                  // isDisabled={!item.stock}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{item.color.name}</CheckboxLabel>
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
          <Text className="mb-1 mt-2 font-medium">Choose Sizes</Text>
          <CheckboxGroup
            value={sizes}
            onChange={(keys) => {
              setSizes(keys);
            }}
          >
            <HStack space="xl">
              {product?.sizes.map((item) => (
                <Checkbox
                  value={item.size.name}
                  key={item.size.id}
                  // isDisabled={!item.stock}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>{item.size.name}</CheckboxLabel>
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
          <Button
            size="lg"
            className="mt-6 self-start rounded-lg bg-sky-500"
            onPress={() => {
              if (colors.length > 0 && sizes.length > 0) {
                setShowActionsheet(true);
                return;
              }
              const title = `Must choose ${colors.length === 0 ? "color - " : ""} ${sizes.length === 0 ? "size" : ""}`;
              const description = "Please set quantity just after choosing";
              handleToast(title, description);
            }}
          >
            <ButtonText>Set Quantity</ButtonText>
          </Button>
          {totalItems > 0 && (
            <Text size="md" className="ml-2 font-semibold text-gray-500">
              Total Price - ${Number(product!.price.toFixed(2)) * totalItems}
            </Text>
          )}
          {cart.length > 0 && (
            <VStack space="sm">
              {cart.map((c) => (
                <HStack
                  key={c.id}
                  className="items-center justify-between rounded-md bg-slate-100 px-2 py-1"
                >
                  <HStack className="items-center" space="md">
                    <Icon as={AddIcon} size="sm" />
                    <Text>
                      {c.color} - {c.size} ( {c.quantity} )
                    </Text>
                  </HStack>
                  <Button
                    size="md"
                    className="mr-4"
                    variant="link"
                    onPress={() =>
                      setCart((prev) => prev.filter((item) => item.id !== c.id))
                    }
                  >
                    <ButtonIcon as={CloseCircleIcon} />
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
        <Box className="h-40" />
      </ScrollView>
      <Fab
        size="md"
        placement="bottom right"
        className="mb-24 bg-green-500"
        onPress={addCartToStore}
      >
        <FabIcon as={AddIcon} size="md" />
        <FabLabel bold>Add To Cart</FabLabel>
      </Fab>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full items-center justify-center pt-5">
            <Text bold>You chose colors and sizes</Text>
            <Text>
              {colors.join(", ")} - {sizes.join(", ")}
            </Text>
            <Text bold className="mt-8">
              Please set quantity
            </Text>
            <Text bold className="my-8" size="5xl">
              {quantity}
            </Text>
            <HStack className="w-full" space="lg">
              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <ButtonText>Increase</ButtonText>
                <ButtonIcon as={AddIcon} />
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => {
                  if (quantity === 1) {
                    return;
                  }
                  setQuantity((q) => q - 1);
                }}
              >
                <ButtonText>Decrease</ButtonText>
                <ButtonIcon as={RemoveIcon} />
              </Button>
            </HStack>
            <Button
              size="lg"
              className="mb-2 mt-6 bg-green-500"
              onPress={submitHandler}
            >
              <ButtonText className="flex-1 text-center font-bold">
                Confirm
              </ButtonText>
            </Button>
            <Button
              size="lg"
              className="mb-12 bg-gray-500"
              onPress={handleClose}
            >
              <ButtonText className="flex-1 text-center font-bold">
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
