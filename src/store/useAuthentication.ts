import { getItemFromStorage, removeItemFromStorage } from '../utils/storage'

import { ValidateUser } from '../network/User/api'
import create from 'zustand'

interface AuthenticationState {
    isSignedIn: boolean
    setIsSignedin: (isSignedIn: boolean) => void,
    validateUser: ()=>Promise<void>
  }

const useAuthentication = create<AuthenticationState>(set => ({
  isSignedIn: !!getItemFromStorage('user-auth-token'),
  setIsSignedin: (isSignedIn) => set(state => ({ isSignedIn: isSignedIn })),
  validateUser: () => {
    const token = getItemFromStorage('user-auth-token');
    if (token)
    {
      return ValidateUser()
      .then((data) => {
        return set({ isSignedIn: true })
      })
      .catch(() => {
        removeItemFromStorage('user-auth-token')
        set({ isSignedIn: false });
        return Promise.reject();
      })
      }
    else {
      return Promise.reject();
    }

  }
}))

export default useAuthentication
