import { Tabs as AppTabs, TabsProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "@Router/index";
import { useRouter } from "next/navigation";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs({ navigateWithHash, ...props }: AppTabPropsI) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("");
  const router = useRouter();

  const updateHash = (pathname: string) => {
    if (navigateWithHash) {
      router.replace(pathname, { scroll: false });
    }
  };

  // On component mount, set the active tab based on the URL hash
  useEffect(() => {
    if (!props.items?.length) return;

    const hash = pathname.split("#")[1];
    const newActiveKey = navigateWithHash && hash ? hash : props.items[0]?.key;
    setActiveKey(newActiveKey);
    updateHash(`${pathname}#${newActiveKey}`);

    return () => {
      updateHash(pathname);
    };
  }, []);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    updateHash(`${pathname}#${activeKey}`);
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
