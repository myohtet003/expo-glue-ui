import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { CartItem, CartType } from "@/types";
import { carts } from "@/data";

type State = {
  carts: CartType[];
};

type Actions = {
  addToCart: (product: CartType) => void;
  updateCart: (productId: number, itemId: number, quantity: number) => void;
  removeFromCart: (productId: number, itemId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
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
    updateCart: (productId,itemId, quantity) => {
      set((state) => {
        const existingCartIndex = state.carts.findIndex((cart) => cart.id === productId);

        if(existingCartIndex < 0) return;

        const existingItemIndex = state.carts[existingCartIndex].items.findIndex((item) => item.id === itemId);

        if(existingItemIndex < 0 ) return;

        state.carts[existingCartIndex].items[existingItemIndex].quantity = quantity;

        if(quantity <= 0) {
          state.carts[existingCartIndex].items.splice(existingItemIndex, 1);
          if (state.carts[existingCartIndex].items.length === 0) {
            state.carts.splice(existingCartIndex, 1);
          }
        }
      })
    },
    removeFromCart: (productId, itemId) => {
      set((state) => {
        const existingCartIndex = state.carts.findIndex((cart) => cart.id === productId);

        if(existingCartIndex < 0) return;

        const existingItemIndex = state.carts[existingCartIndex].items.findIndex((item) => item.id === itemId);

        if(existingItemIndex < 0 ) return;

        state.carts[existingCartIndex].items.splice(existingItemIndex, 1);

        if (state.carts[existingCartIndex].items.length === 0) {
            state.carts.splice(existingCartIndex, 1);
          }
      })
    },
    clearCart: () => {
      set({ carts: []});
    },
    getTotalItems: () => {
      const { carts } = get();

      return carts.reduce(
        (total, cart) =>
          total + cart.items.reduce((total, item) => total + item.quantity, 0),
        0
      );
    },
    getTotalPrice: () => {
       const { carts } = get();

      return carts.reduce(
        (total, cart) =>
          total + cart.items.reduce((itemTotal, item) => itemTotal + item.quantity * cart.price, 0),
        0
      );
    },
  }))
);

export default userCartStore;
