import { Tabs as AppTabs, TabsProps } from "@Lib/index";
import { useEffect, useState } from "react";
import { useInRouterContext, useLocation, useNavigate } from "react-router-dom";
import { useRouter } from "next/router";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs({ navigateWithHash, ...props }: AppTabPropsI) {
  const isInRouterContext = useInRouterContext();
  const [activeKey, setActiveKey] = useState("");

  let location, navigate, router;

  if (!isInRouterContext) {
    // Using Next.js router
    router = useRouter();
    location = router;
    navigate = router.push;
  } else {
    // Using React Router
    location = useLocation();
    navigate = useNavigate();
  }

  const updateHash = (pathname: string) => {
    if (navigateWithHash) {
      navigate(pathname, undefined, { scroll: false });
    }
  };

  // On component mount, set the active tab based on the URL hash
  useEffect(() => {
    if (!props.items?.length) return;
    const hash = location.asPath?.split("#")[1] || location.hash.slice(1);
    const newActiveKey = navigateWithHash && hash ? hash : props.items[0]?.key;
    setActiveKey(newActiveKey);
    updateHash(`${location.pathname}#${newActiveKey}`);
    return () => {
      updateHash(location.pathname);
    };
  }, []);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    updateHash(`${location.pathname}#${activeKey}`);
  };

  return (
    <AppTabs
      destroyInactiveTabPane={false}
      {...props}
      activeKey={activeKey}
      onChange={onChange}
      items={props.items}
    />
  );
}

export default Tabs;
