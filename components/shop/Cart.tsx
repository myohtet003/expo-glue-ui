import { ShoppingCart } from "lucide-react-native";
import React from "react"; 

import { VStack } from "../ui/vstack";
import { Badge, BadgeText } from "../ui/badge";
import { Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import { useRouter } from "expo-router";

import userCartStore from "@/store/CartStore";

const Cart = () => {
  const router = useRouter();
  const totalItems = userCartStore((state) => state.getTotalItems());

  return (
    <Pressable
      className="items-center"
      onPress={() => router.navigate("/cart")}
    >
      <VStack>
        {totalItems > 0 && (
          <Badge
            className={`z-10 self-end ${totalItems > 9 ? "h-[28px] w-[28px]" : "h-[22px] w-[22px]"}  bg-red-600 rounded-full -mb-3.5 -mr-3.5`}
            variant="solid"
          >
            <BadgeText className="text-white font-bold">{totalItems}</BadgeText>
          </Badge>
        )}
        <Icon as={ShoppingCart} size="xl" />
      </VStack>
    </Pressable>
  );
};

export default Cart;
