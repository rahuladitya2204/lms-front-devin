import {
  useInRouterContext,
  useNavigate as useReactRouterNavigate,
} from "react-router";

import {
  useNavigate as useNextNavigate,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
  useLocation as useNextLocation,
  Link as NextLink,
  NavLink as NextNavLink,
} from "./next";
import {
  useSearchParams as useReactRouterSearchParams,
  useParams as useReactRouterParams,
  Link as ReactRouterLink,
  useLocation as useReactRouterLocation,
  NavLink as ReactRouterNavLink,
} from "react-router-dom";

export const useParams = () => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext
    ? // @ts-ignore
      useReactRouterParams()
    : // @ts-ignore
      useNextParams();
};

export const useSearchParams = (props: any) => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext
    ? // @ts-ignore
      useReactRouterSearchParams(...props)
    : // @ts-ignore
      useNextSearchParams(...props);
};

export const useNavigate = () => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext
    ? // @ts-ignore
      useReactRouterNavigate()
    : // @ts-ignore
      useNextNavigate();
};

export const useLocation = () => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext
    ? // @ts-ignore
      useReactRouterLocation()
    : // @ts-ignore
      useNextLocation();
};

export const Link = (props: any) => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext ? (
    // @ts-ignore
    <ReactRouterLink {...props} />
  ) : (
    // @ts-ignore
    <NextLink {...props} />
  );
};

export const NavLink = (props: any) => {
  const isInRouterContext = useInRouterContext();
  return isInRouterContext ? (
    // @ts-ignore
    <ReactRouterNavLink {...props} />
  ) : (
    // @ts-ignore
    <NextNavLink {...props} />
  );
};
