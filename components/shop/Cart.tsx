
import { ShoppingCart } from "lucide-react-native";

import React from 'react'
import { Box } from '../ui/box'
import { VStack } from '../ui/vstack'
import { Badge, BadgeText } from '../ui/badge' 
import { Icon } from '../ui/icon' 

const Cart = () => {

	const totalItems = 2;

  return (
	<Box className="items-center">
      <VStack>
        <Badge
          className={`z-10 self-end ${totalItems > 9 ? "h-[28px] w-[28px]" : "h-[22px] w-[22px]"}  bg-red-600 rounded-full -mb-3.5 -mr-3.5`}
          variant="solid"
        >
          <BadgeText className="text-white font-bold">{totalItems}</BadgeText>
        </Badge>
        <Icon as={ShoppingCart} size="xl"/>
      </VStack>
    </Box>
  )
}

export default Cart