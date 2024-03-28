import { Tabs as AppTabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs(props: AppTabPropsI) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("");

  const updateHash = (pathname: string) => {
    if (props.navigateWithHash) {
      router.replace(pathname, { scroll: false });
    }
  };

  // On component mount, set the active tab based on the URL hash
  useEffect(() => {
    if (!props.items?.length) return;

    const hash = pathname.split("#")[1];
    const newActiveKey =
      props.navigateWithHash && hash ? hash : props.items[0]?.key;
    setActiveKey(newActiveKey);
    updateHash(`${pathname}#${newActiveKey}`);

    return () => {
      updateHash(pathname);
    };
  }, [pathname, props.navigateWithHash]);

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
