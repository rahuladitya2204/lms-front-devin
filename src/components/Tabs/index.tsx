import { useEffect, useState } from "react";
import { Tabs as AppTabs, TabsProps } from "@Lib/index";
import { useSearchParams } from "@Router/index";

interface AppTabPropsI extends TabsProps {
  tabKey: string;
}

function Tabs({ tabKey, ...props }: AppTabPropsI) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const tabActiveKey = searchParams.get(tabKey);
    if (
      tabActiveKey &&
      props.items?.some((item) => item.key === tabActiveKey)
    ) {
      setActiveKey(tabActiveKey);
    } else {
      setActiveKey(props.items?.[0]?.key || "");
    }
  }, [searchParams, props.items, tabKey]);

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey);
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      [tabKey]: activeKey,
    });
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
