import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Common, Constants, Store, Types } from "@adewaskar/lms-common";
import { useCookies } from "react-cookie";

export interface ServerAuth
  extends Pick<
    Store.AuthenticationState<Types.User>,
    | "isLoading"
    | "isSignedIn"
    | "setIsSignedin"
    | "learner"
    | "user"
    | "userType"
    | "validateUser"
  > {
  checkAuthentication: () => Promise<void>;
}

export const ServerAuthContext = createContext<ServerAuth>({
  ...Store.defaultAuthenticationState,
  checkAuthentication: async () => {},
  setIsSignedin: () => {},
  validateUser: async () => {},
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
  const { setIsSignedin, validateUser, ...restStore } = Store.useAuthentication(
    (s) => s
  );

  const checkAuthentication = useCallback(async () => {
    console.log("[ServerAuth]: userType", cookies.userType);
    if (cookies.userType) {
      console.log("[ServerAuth]: token", token);
      if (token) {
        try {
          const response = await validateUser(cookies.userType);
          console.log("[ServerAuth]: response", response);
        } catch (error) {
          console.error("[ServerAuth]: Error validating token:", error);
          if (error?.response?.status === 403) {
            console.log("removing");
            setIsSignedin(false);
            removeAuthCookie(tokenCookie, {
              path: "/",
              domain: window.location.hostname,
            });
          }
        }
      }
    }
  }, [
    cookies.userType,
    removeAuthCookie,
    setIsSignedin,
    token,
    tokenCookie,
    validateUser,
  ]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return (
    <ServerAuthContext.Provider
      value={{
        setIsSignedin,
        validateUser,
        ...restStore,
        userType: cookies.userType,
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
