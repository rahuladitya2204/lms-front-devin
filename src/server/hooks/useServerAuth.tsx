import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { Common } from "@adewaskar/lms-common";
import { useCookies } from "react-cookie";

export interface ServerAuth {
  userType: string;
  isSignedIn: boolean;
  isLoading: boolean;
  setIsSignedIn: (value: boolean) => void;
  checkAuthentication: () => Promise<void>;
}

export const ServerAuthContext = createContext<ServerAuth>({
  userType: "",
  isSignedIn: false,
  isLoading: true,
  setIsSignedIn: () => {},
  checkAuthentication: async () => {},
});

export const ServerAuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "orgAlias",
    "userType",
  ]);
  const tokenCookie = `${cookies.userType}-auth-token`;
  const [authCookies, setAuthCookie, removeAuthCookie] = useCookies([
    tokenCookie,
  ]);

  const token = authCookies[tokenCookie];
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = useCallback(async () => {
    console.log("[ServerAuth]: userType", cookies.userType);
    if (cookies.userType) {
      console.log("[ServerAuth]: token", token);
      if (token) {
        try {
          const { validateUser } = Common.Queries.Definitions;
          const response = await validateUser(cookies.userType);
          console.log("[ServerAuth]: response", response);

          if (response?.token) {
            setIsSignedIn(true);
          } else {
            setIsSignedIn(false);
            removeAuthCookie(tokenCookie);
          }
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }
    }

    setIsLoading(false);
  }, [cookies.userType, removeAuthCookie, token, tokenCookie]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return (
    <ServerAuthContext.Provider
      value={{
        isSignedIn,
        isLoading,
        userType: cookies.userType,
        setIsSignedIn: setIsSignedIn,
        checkAuthentication,
      }}
    >
      {children}
    </ServerAuthContext.Provider>
  );
};

type UseServerAuthSelector<T> = (serverAuth: ServerAuth) => T;

const useServerAuth = <T,>(selector: UseServerAuthSelector<T>) => {
  const serverAuth = useContext(ServerAuthContext);
  return selector(serverAuth);
};

export default useServerAuth;
