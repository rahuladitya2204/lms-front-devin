import Next from "next";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL?: string;
      NEXT_PUBLIC_APP_ENV?: string;
      NEXT_PUBILC_API_URL?: string;
      NEXT_PUBLIC_CDN_URL?: string;
    }
  }
}
