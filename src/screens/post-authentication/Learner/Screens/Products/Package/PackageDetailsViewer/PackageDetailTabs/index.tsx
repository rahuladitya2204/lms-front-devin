"use client";
import { NavLink, useParams } from "@Router/index";
import PackageOverview from "./PackageOverview";
import PackageProducts from "./PackageProducts";
import Tabs from "@Components/Tabs";
import { Learner, Types } from "@adewaskar/lms-common";
import { Button, Divider, Skeleton } from "antd";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";

interface PackageDetailsTabsPropsI {
  id?: string;
  isServer?: boolean;
  type?: string;
}

function PackageDetailsTabs(props: PackageDetailsTabsPropsI) {
  const params = useParams();
  const id = props.id || params.id;
  const type = props.type || params.type || "overview";
  const { data: bundle, isLoading } = Learner.Queries.useGetPackageDetails(
    id + "",
    {
      enabled: !!id,
    }
  );

  const { data: category } = Learner.Queries.useGetProductCategoryDetails(
    // @ts-ignore
    bundle.category._id
  );

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
            title={tab.label}
            to={
              props.isServer
                ? `/test-series/${props.id}/${tab.key}`
                : `/app/test-series/${id}/${tab.key}`
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
      <Divider style={{ margin: "5px 0px 0px 0" }} />
      {TABS.find((tab) => tab.key === type)?.children}
    </>
  );
}

export default PackageDetailsTabs;
