import { getRequestHeaders } from "@ServerUtils/index";
import { Network, Store } from "@adewaskar/lms-common";
import { Utils } from "@adewaskar/lms-common";

export const getToken = (userType?: string) => {
  if (!userType) {
    userType = Utils.Storage.GetItem("userType");
  }
  const token = Utils.Storage.GetItem(`${userType}-auth-token`);
  return token;
};

const requestSuccessInterceptor = (config) => {
  config.baseURL = process.env.NEXT_PUBLIC_API_URL;
  // Any status code that lie within the range of 2xx cause this function to trigger
  return config;
};

const requestErrorInterceptor = (error) => Promise.reject(error);

const responseSuccessInterceptor = (response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  return response;
};
const responseErrorInterceptor = (error) => {
  const setIsSignedIn = Store.useAuthentication.getState().setIsSignedin;
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  if (error.response.status === 401) {
    setIsSignedIn(false);
    // Handle unauthorized access here
    // e.g., Redirect to login, update state, show message, etc.
  }
  return Promise.reject(error);
};

const requestTransformer = [
  (data, headers) => {
    const orgId = Utils.Storage.GetItem("orgId");
    if (orgId) {
      headers.set("x-org", orgId);
    }

    const { orgAlias, affiliateId, userType } = getRequestHeaders();

    const token = getToken(userType);
    if (orgAlias) {
      headers.set("x-org-alias", orgAlias);
    }

    if (affiliateId) {
      headers.set("x-affiliate-id", affiliateId);
    }

    headers.set("x-user-type", userType);

    if (token) {
      headers.set("x-auth", token);
    }
    const customType = headers.get("Content-Type-Custom");
    // console.log(customType, 'customType')
    if (customType) {
      headers.set(`Content-Type`, undefined);
    }
    // console.log(headers, data, 'hshshshsh')
    if (headers.get("x-req-type")) {
      return data;
    } else {
      return JSON.stringify(data);
    }
  },
];

export const initInterceptors = () => {
  Network.Axios.interceptors.request.use(
    requestSuccessInterceptor,
    requestErrorInterceptor
  );

  Network.Axios.defaults.transformRequest = requestTransformer;

  Network.Axios.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor
  );
};
