import { Color } from "@kurkle/color";
import { Utils } from "@adewaskar/lms-common";
import { getIsServer, getServerCookie } from "@ServerUtils/index";
import { parse, serialize } from "cookie";
import { initInterceptors } from "@Network/index";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

export const initStorage = () => {
  console.log("initializing storage");
  Utils.Storage.GetItem = (key: string) => {
    const cookieString = getIsServer() ? getServerCookie() : document.cookie;
    const cookies = parse(cookieString ?? "");
    return cookies[key];
  };

  Utils.Storage.SetItem = (key: string, value: string) => {
    if (!getIsServer()) {
      const cookieString = serialize(key, value, {
        path: "/",
        domain: window.location.hostname,
      });
      document.cookie = cookieString;
    }
  };

  Utils.Storage.RemoveItem = (key: string) => {
    if (!getIsServer()) {
      const cookieString = serialize(key, "", {
        expires: new Date(0),
        path: "/",
        domain: window.location.hostname,
      });
      document.cookie = cookieString;
    }
  };
};

const initDateFormats = () => {
  dayjs.extend(relativeTime);
  dayjs.extend(localizedFormat);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
};


export const initializeApp = () => {
  initInterceptors();
  initDateFormats();
  initStorage();
};

type GradientTypes = {
  type1: string[];
  type2: string[];
  type3: string[];
  type4: string[];
};

export function getSubdomainFromHost(host: string | null): string {
  if (!host) return "";

  const parts = host.split(".");
  // Assuming the format is always [subdomain].[domain].[tld]
  const subdomain = parts.slice(0, -2).join("-");
  return subdomain;
}

export function getHostnameFromHost(host: string | null): string {
  if (!host) return "";

  // Remove the port number if present
  const hostnameWithoutPort = host.split(":")[0];
  return hostnameWithoutPort;
}

export function generateGradients(primaryColor: string): GradientTypes {
  // Create a Color object
  const color = new Color(primaryColor);

  // Generate gradients by manipulating the color
  const gradientType1 = `linear-gradient(45deg, ${color.hexString()}, ${color
    .lighten(0.3)
    .hexString()})`;
  const gradientType2 = `linear-gradient(90deg, ${color.hexString()}, ${color
    .darken(0.3)
    .hexString()})`;
  const gradientType3 = `linear-gradient(135deg, ${color.hexString()}, ${color
    .alpha(0.5)
    .rgbString()})`; // semi-transparent
  const gradientType4 = `linear-gradient(180deg, ${color.hexString()}, ${color
    .rotate(180)
    .hexString()})`; // complementary color
  return {
    type1: [gradientType1],
    type2: [gradientType2],
    type3: [gradientType3],
    type4: [gradientType4],
  };
}

export function copyToClipboard(text: string): void {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Avoid scrolling to bottom
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.position = "fixed";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }

  document.body.removeChild(textarea);
}

export function parseCookies(cookieString: string): Record<string, string> {
  const cookieValues: Record<string, string> = {};

  if (cookieString) {
    const cookies = cookieString.split("; ");

    cookies.forEach((cookie) => {
      const [name, value] = cookie.split("=");
      cookieValues[name] = value;
    });
  }

  return cookieValues;
}
