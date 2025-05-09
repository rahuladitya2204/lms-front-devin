import React, { useCallback } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from "next/navigation";
import {
  LinkProps,
  Location,
  NavLinkProps,
  NavigateFunction,
  NavigateOptions,
  useParams as useReactRouterParams,
} from "react-router-dom";
import { useInRouterContext } from "react-router";

export const useLocation = (): Location => {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const search = searchParams.toString();
  const hash = ""; // Next.js doesn't have built-in support for hash routes
  const state = undefined; // Next.js doesn't have built-in support for location state
  const key = ""; // Next.js doesn't have built-in support for location key

  return {
    pathname,
    search,
    hash,
    state,
    key,
  };
};

export const useNavigate = () => {
  const router = useRouter();

  const navigate: NavigateFunction = useCallback(
    (to, options: NavigateOptions = {}) => {
      const { replace = false, state = {} } = options;

      if (replace) {
        router.replace(to.toString(), { scroll: false });
      } else {
        router.push(to.toString(), { scroll: false });
      }
    },
    [router]
  );

  return navigate;
};

export const NavLink = ({
  to,
  children,
  caseSensitive = false,
  className,
  end = false,
  style,
  ...props
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = end
    ? pathname === to
    : caseSensitive
    ? pathname.startsWith(to as string)
    : pathname.toLowerCase().startsWith((to as string)?.toLowerCase());

  // console.log(pathname,to,isActive,'huhhaha')
  const renderProps = {
    isActive,
    isPending: false,
    isTransitioning: false,
  };

  const renderClassName =
    typeof className === "function" ? className(renderProps) : className;
  const renderStyle = typeof style === "function" ? style(renderProps) : style;

  return (
    <Link
      prefetch={false}
      href={to}
      className={renderClassName}
      style={renderStyle}
      {...props}
    >
      {typeof children === "function" ? children(renderProps) : children}
    </Link>
  );
};

// eslint-disable-next-line react/display-name
const ReactRouterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      to,
      replace,
      reloadDocument,
      state,
      preventScrollReset,
      relative,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname();
    // console.log(pathname, "pathname");
    const searchParams = useNextSearchParams();
    const hasAdditionalSearchParams =
      Array.from(searchParams.entries()).length > 0;

    const href =
      relative === "path" ? to : relative === "route" ? `${pathname}${to}` : to;

    const finalHref = hasAdditionalSearchParams
      ? `${href}?${searchParams}`
      : href;

    return (
      <Link
        href={finalHref || ""}
        ref={ref}
        replace={replace}
        // scroll={!preventScrollReset}
        scroll={false}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

const useSearchParams = (): [
  URLSearchParams,
  (params: Record<string, string>, options?: { replace?: boolean }) => void
] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const setSearchParams = (
    params: Record<string, string>,
    options?: { replace?: boolean }
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });

    const newSearch = newSearchParams.toString();
    const newUrl = `${pathname}?${newSearch}`;

    if (options?.replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  return [searchParams, setSearchParams];
};

const useParams = () => {
  const nextParams = useNextParams();
  const reactRouterParams = useReactRouterParams();

  // this checks if the route was loaded via the catch-all React application which loads the react router
  const isInRouterContext = useInRouterContext();

  return isInRouterContext ? reactRouterParams : nextParams;
};

export { ReactRouterLink as Link, useSearchParams, useParams };
