import { getItemFromStorage, removeItemFromStorage } from '@Utils/storage'

import { Types } from '@adewaskar/lms-common'
import { ValidateUser } from '../screens/post-authentication/User/Api'
import create from 'zustand'

interface AuthenticationState {
  isSignedIn: boolean;
  user: Partial<Types.User>;
  userType: string;
  setIsSignedin: (isSignedIn: boolean) => void;
  setUser: (user: Types.User) => void;
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
