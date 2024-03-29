import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Common } from "@adewaskar/lms-common";

export interface ServerAuth {
  userType: string | null | undefined;
  isSignedIn: boolean;
  isLoading: boolean;
}

export const ServerAuthContext = createContext<ServerAuth>({
  userType: null,
  isSignedIn: false,
  isLoading: true,
});

export const ServerAuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>();

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
    <ServerAuthContext.Provider value={{ isSignedIn, isLoading, userType }}>
      {children}
    </ServerAuthContext.Provider>
  );
};

const useServerAuth = () => {
  return useContext(ServerAuthContext);
};

export default useServerAuth;
