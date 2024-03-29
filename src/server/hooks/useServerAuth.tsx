import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Common } from "@adewaskar/lms-common";

export interface ServerAuth {
  userType: string;
  isSignedIn: boolean;
  isLoading: boolean;
  setIsSignedIn: (value: boolean) => void;
}

export const ServerAuthContext = createContext<ServerAuth>({
  userType: "",
  isSignedIn: false,
  isLoading: true,
  setIsSignedIn: () => {},
});

export const ServerAuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("");

  const wrapperSetIsSignedIn: ServerAuth['setIsSignedIn'] = (value) => {
    if(value === false) {
      const userType = Cookies.get("userType");
      const tokenCookie = `${userType}-auth-token`;
      Cookies.remove(tokenCookie);
    }
    setIsSignedIn(value);
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      const userType = Cookies.get("userType");
      // console.log("[ServerAuth]: userType", userType);
      if (userType) {
        setUserType(userType);
        const tokenCookie = `${userType}-auth-token`;
        const token = Cookies.get(tokenCookie);

        // console.log("[ServerAuth]: token", token);

        if (token) {
          try {
            const { validateUser } = Common.Queries.Definitions;
            const response = await validateUser(userType);
            // console.log("[ServerAuth]: response", response);

            if (response?.token) {
              setIsSignedIn(true);
            } else {
              Cookies.remove(tokenCookie);
            }
          } catch (error) {
            console.error("Error validating token:", error);
          }
        }
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  return (
    <ServerAuthContext.Provider value={{ isSignedIn, isLoading, userType, setIsSignedIn: wrapperSetIsSignedIn }}>
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
