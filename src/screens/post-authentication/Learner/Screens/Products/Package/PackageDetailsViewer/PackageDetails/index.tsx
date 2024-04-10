import { NavLink, useParams } from "@Router/index";
import PackageOverview from "./PackageOverview";
import PackageProducts from "./PackageProducts";
import Tabs from "@Components/Tabs";
import { Learner, Types } from "@adewaskar/lms-common";
import { Button, Divider, Skeleton } from "@Lib/index";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";

interface PackageDetailsPropsI {
  id: string;
  isServer?: boolean;
  type?: string;
}

function PackageDetails(props: PackageDetailsPropsI) {
  const params = useParams();
  const { data: bundle, isLoading } = Learner.Queries.useGetPackageDetails(
    props.id
  );
  const id = props.id || params.id;
  const type = props.type || params.type || "overview";

  const TABS = [
    {
      key: "overview",
      label: `Overview`,
      children: <PackageOverview package={bundle} />,
    },
    {
      key: "products",
      label: `What's included`,
      children: <PackageProducts isServer={props.isServer} package={bundle} />,
    },
  ];
  return isLoading ? (
    <Skeleton.Button block active style={{ height: 400 }} />
  ) : (
    <>
      {TABS.map((tab) => {
        return (
          <NavLink
            to={
              props.isServer
                ? `/package/${props.id}/${tab.key}`
                : `/package/${id}/${tab.key}`
            }
          >
            <Button
              // type="text"
              size="small"
              type={tab.key === type ? "primary" : "default"}
              style={{ marginRight: 15, marginBottom: 10 }}
            >
              {tab.label}
            </Button>
          </NavLink>
        );
      })}
      <Divider />
      {TABS.find((tab) => tab.key === type)?.children}
    </>
  );
}

export default PackageDetails;
