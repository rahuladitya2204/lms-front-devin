import React, { useCallback } from "react";
import Link, { LinkProps as NextLinkProps } from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import {
  LinkProps,
  Location,
  NavLinkProps,
  NavigateFunction,
  NavigateOptions,
} from "react-router-dom";

export const useLocation = (): Location => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

      router.replace(to.toString(), { scroll: replace, ...state });
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
    : pathname.toLowerCase().startsWith((to as string).toLowerCase());

  const renderProps = {
    isActive,
    isPending: false,
    isTransitioning: false,
  };

  const renderClassName =
    typeof className === "function" ? className(renderProps) : className;
  const renderStyle = typeof style === "function" ? style(renderProps) : style;

  return (
    <Link href={to} className={renderClassName} style={renderStyle} {...props}>
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
    const searchParams = useSearchParams();

    const href =
      relative === "path" ? to : relative === "route" ? `${pathname}${to}` : to;

    const finalHref = searchParams ? `${href}?${searchParams}` : href;

    return (
      <Link
        href={finalHref}
        ref={ref}
        replace={replace}
        scroll={!preventScrollReset}
        {...props}
      />
    );
  }
);

Link.displayName = "Link";

const useReactRouterSearchParams = (): [
  URLSearchParams,
  (params: Record<string, string>, options?: { replace?: boolean }) => void
] => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

export {
  ReactRouterLink as Link,
  useReactRouterSearchParams as useSearchParams,
  useParams,
};
