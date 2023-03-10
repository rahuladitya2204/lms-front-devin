import { Types } from '@adewaskar/lms-common'
import create from 'zustand'

interface CartState {
  cartItems: Types.Course[];
  addItemToCart: (item: Types.Course) => void;
  resetCart: () => void;
  setCartItems: (items: Types.Course[]) => void;
}

const useCart =
  create <
  CartState >
  (set => ({
    cartItems: [],
    addItemToCart: item =>
      set(state => ({ cartItems: [...state.cartItems, item] })),
    resetCart: () => set(state => ({ cartItems: [] })),
    setCartItems: items => set(state => ({ cartItems: items }))
  }))

export default useCart
