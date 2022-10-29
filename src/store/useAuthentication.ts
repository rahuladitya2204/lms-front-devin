import { ValidateUser } from '../screens/authentication/api'
import create from 'zustand'

interface AuthenticationState {
    isSignedIn: boolean
    setIsSignedin: (isSignedIn: boolean) => void,
    validateUser: ()=>Promise<void>
  }

const useAuthentication = create<AuthenticationState>(set => ({
  isSignedIn: false,
  setIsSignedin: (isSignedIn) => set(state => ({ isSignedIn: isSignedIn })),
  validateUser: () => {
    return ValidateUser()
      .then((data) => {
        console.log('failed not!',data)
        return set({ isSignedIn: true })
      })
      .catch(() => {
        console.log('failed!')
        set({ isSignedIn: false });
        return Promise.reject();
      })

  }
}))

export default useAuthentication
