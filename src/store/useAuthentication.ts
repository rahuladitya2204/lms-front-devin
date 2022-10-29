import { getItemFromStorage, removeItemFromStorage } from '../utils/storage'

import { ValidateUser } from '../screens/authentication/api'
import create from 'zustand'

interface AuthenticationState {
    isSignedIn: boolean
    setIsSignedin: (isSignedIn: boolean) => void,
    validateUser: ()=>Promise<void>
  }

const useAuthentication = create<AuthenticationState>(set => ({
  isSignedIn: !!getItemFromStorage('token'),
  setIsSignedin: (isSignedIn) => set(state => ({ isSignedIn: isSignedIn })),
  validateUser: () => {
    const token = getItemFromStorage('token');
    if (token)
    {
      console.log('Validating')
      return ValidateUser()
      .then((data) => {
        console.log('failed not!',data)
        return set({ isSignedIn: true })
      })
      .catch(() => {
        console.log('failed!')
        removeItemFromStorage('token')
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
