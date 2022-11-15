import { Course } from '@Types/Courses.types'
import create from 'zustand'

interface CartState {
  cartItems: Course[];
  addItemToCart: (item: Course) => void;
  resetCart: () => void;
  setCartItems: (items: Course[]) => void;
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
