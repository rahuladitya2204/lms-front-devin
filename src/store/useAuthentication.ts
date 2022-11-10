import { getItemFromStorage, removeItemFromStorage } from '@Utils/storage'
import create from 'zustand'
import { ValidateUser } from '../screens/post-authentication/User/Api';

interface AuthenticationState {
  isSignedIn: boolean
  userType: string;
    setIsSignedin: (isSignedIn: boolean) => void,
    validateUser: (type:string)=>Promise<void>
  }

const useAuthentication = create<AuthenticationState>(set => ({
  isSignedIn: false,
  userType:'',
  setIsSignedin: (isSignedIn) => set(state => ({ isSignedIn: isSignedIn })),
  validateUser: (type) => {
    const token = getItemFromStorage(type+'-auth-token');
    if (token)
    {
      return ValidateUser(type)
      .then((data:any) => {
        return set({ isSignedIn: true,userType:type })
      })
      .catch(() => {
        removeItemFromStorage(type + '-auth-token');
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
