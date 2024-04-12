// @ts-nocheck
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
  const Fn = isInRouterContext
    ? // @ts-ignore
      useReactRouterParams
    : // @ts-ignore
      useNextParams;

  return Fn();
};

export const useSearchParams = () => {
  const isInRouterContext = useInRouterContext();
  const Fn = isInRouterContext
    ? // @ts-ignore
      useReactRouterSearchParams
    : // @ts-ignore
      useNextSearchParams;
  return Fn();
};

export const useNavigate = () => {
  const isInRouterContext = useInRouterContext();
  const Fn = isInRouterContext
    ? // @ts-ignore
      useReactRouterNavigate
    : // @ts-ignore
      useNextNavigate;
  return Fn();
};

export const useLocation = () => {
  const isInRouterContext = useInRouterContext();
  const Fn = isInRouterContext
    ? // @ts-ignore
      useReactRouterLocation
    : // @ts-ignore
      useNextLocation;

  return Fn();
};

export const Link = (props: any) => {
  const isInRouterContext = useInRouterContext();
  if (props.anchor) {
    return <a href={props.to}>{props.children}</a>;
  }
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
