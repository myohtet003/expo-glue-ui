import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { CartItem, CartType } from "@/types";

type State = {
  carts: CartType[];
};

type Actions = {
  addToCart: (product: CartType) => void;
  // updateCart: (productId: number, itemId: number, quantity: number) => void;
  // removeFromCart: (productId: number, itemId: number) => void;
  // clearCart: () => void;
  getTotalItems: () => void;
  // getTotalPrice: () => void;
};

const initialState: State = {
  carts: [],
};

const userCartStore = create<State & Actions>()(
  immer((set, get) => ({
    ...initialState,
    addToCart: (product) => {
      set((state) => {
        const existingCartIndex = state.carts.findIndex(
          (cart) => cart.id === product.id
        );

        if (existingCartIndex > -1) {
          product.items.forEach((item) => {
            const existingItemIndex = state.carts[
              existingCartIndex
            ].items.findIndex(
              (existingItem) =>
                existingItem.color === item.color &&
                existingItem.size === item.size
            );

            if (existingItemIndex > -1) {
              state.carts[existingCartIndex].items[
                existingItemIndex
              ].quantity += item.quantity;
            } else {
              state.carts[existingCartIndex].items.push(item);
            }
          });
        } else state.carts.push(product);
      });
    },
    getTotalItems: () => {
      const { carts } = get();

      return carts.reduce(
        (total, cart) =>
          total + cart.items.reduce((total, item) => total + item.quantity, 0),
        0
      );
    },
  }))
);

export default userCartStore;
