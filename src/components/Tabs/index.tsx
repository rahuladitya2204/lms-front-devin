import { useEffect, useState } from "react";
import { Tabs as AppTabs, TabsProps } from "@Lib/index";
import { useLocation, useNavigate } from "@Router/index";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs({ navigateWithHash = false, ...props }: AppTabPropsI) {
  const [activeKey, setActiveKey] = useState(props.items?.[0]?.key || "");
  const location = useLocation();
  const navigate = useNavigate();

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
