import { useEffect, useState } from "react";
import { Tabs as AppTabs, TabsProps } from "@Lib/index";
import { useLocation, useNavigate } from "@Router/index";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs({ navigateWithHash = false, ...props }: AppTabPropsI) {
  const [activeKey, setActiveKey] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // On component mount, set the active tab based on the URL hash or the first tab
  useEffect(() => {
    if (!props.items?.length) return;

    const hash = location.hash?.slice(1);
    const newActiveKey = hash || props.items[0]?.key;
    setActiveKey(newActiveKey);
  }, [location.hash, props.items]);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    if (navigateWithHash) {
      navigate(`${location.pathname}#${activeKey}`);
    }
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
