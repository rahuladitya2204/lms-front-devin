import { useCallback, useEffect } from "react";
import { Store } from "@adewaskar/lms-common";
import { useCookies } from "react-cookie";
import { useAppInit } from "@Hooks/CommonHooks";

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
    // console.log("[ServerAuth]: userType", cookies.userType);
    if (cookies.userType) {
      // console.log("[ServerAuth]: token", token);
      if (token) {
        try {
          const response = await validateUser(cookies.userType);
          // console.log("[ServerAuth]: response", response);
        } catch (error) {
          // console.error("[ServerAuth]: Error validating token:", error);
          if (error?.response?.status === 403) {
            // console.log("removing");
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

  useAppInit();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return <>{children}</>;
};
