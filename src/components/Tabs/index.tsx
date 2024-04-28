import { useEffect, useState } from "react";
import { Tabs as AppTabs, TabsProps } from "@Lib/index";
import { useLocation, useNavigate } from "@Router/index";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs({ navigateWithHash, ...props }: AppTabPropsI) {
  const [activeKey, setActiveKey] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const updateHash = (pathname: string) => {
    if (navigateWithHash) {
      navigate(pathname, { scroll: false });
    }
  };

  // On component mount, set the active tab based on the URL hash
  useEffect(() => {
    if (!props.items?.length) return;
    const hash = location.hash?.slice(1);
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
