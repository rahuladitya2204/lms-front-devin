import { useEffect, useState } from "react";
import { Tabs as AppTabs, TabsProps } from "antd";
import { useSearchParams } from "@Router/index";

interface AppTabPropsI extends TabsProps {
  tabKey: string;
}

function Tabs({ tabKey, ...props }: AppTabPropsI) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const tabActiveKey = searchParams.get(tabKey);
    const defaultKey = props.items?.[0]?.key || "";

    if (
      tabActiveKey &&
      props.items?.some((item) => item.key === tabActiveKey)
    ) {
      setActiveKey(tabActiveKey);
    } else {
      // If no valid key is found in query params, use the default key
      setActiveKey(defaultKey);
      // Update the URL to reflect the default tab key
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        [tabKey]: defaultKey,
      });
    }
  }, [searchParams, props.items, tabKey, setSearchParams]);

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
