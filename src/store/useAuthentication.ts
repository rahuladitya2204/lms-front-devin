import { User } from '@Types/User.types'
import { getItemFromStorage, removeItemFromStorage } from '@Utils/storage'
import create from 'zustand'
import { ValidateUser } from '../screens/post-authentication/User/Api'

interface AuthenticationState {
  isSignedIn: boolean;
  user: Partial<User>;
  userType: string;
  setIsSignedin: (isSignedIn: boolean) => void;
  setUser: (user: User) => void;
  validateUser: (type: string) => Promise<void>;
}

const useAuthentication =
  create <
  AuthenticationState >
  (set => ({
    isSignedIn: false,
    user: {},
    userType: '',
    setUser: user => set(state => ({ user: user })),
    setIsSignedin: isSignedIn => set(state => ({ isSignedIn: isSignedIn })),
    validateUser: type => {
      const token = getItemFromStorage(type + '-auth-token')
      if (token) {
        return ValidateUser(type)
          .then(d => d.data)
          .then((data: any) => {
            return set({ isSignedIn: true, userType: type })
          })
          .catch(() => {
            // removeItemFromStorage(type + '-auth-token')
            set({ isSignedIn: false })
            return Promise.reject()
          })
      } else {
        return Promise.reject()
      }
    }
  }))

export default useAuthentication
