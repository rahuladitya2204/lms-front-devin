"use client";
import { Title } from "@Components/Typography/Typography";
import { Learner } from "@adewaskar/lms-common";
import { Col, Row, Skeleton } from "antd";
import PackageCard from "../StoreScreen/Cards/PackageCard";
import { useParams } from "@Router/index";

export default function LearnerPackagesScreen(props: {
  isServer?: boolean;
  id?: string;
}) {
  const { id: bundleId } = useParams();
  const id = props.id || bundleId;
  const { data: bundles, isLoading: loadingPackages } =
    Learner.Queries.useGetPackages(id + "");
  return loadingPackages ? (
    <LearnerPackagesSKeletonScreen />
  ) : (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>Please check out our bundles</Title>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 30]}>
          {bundles.map((bundle) => (
            <Col lg={4} md={6} sm={12} xs={24}>
              <PackageCard isServer={props.isServer} package={bundle} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export function LearnerPackagesSKeletonScreen(props: { isServer?: boolean }) {
  const bundles = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Skeleton.Button active block style={{ height: 45 }} />
      </Col>
      <Col span={24}>
        <Row gutter={[20, 30]}>
          {bundles.map((bundle) => (
            <Col lg={4} md={6} sm={12} xs={24}>
              <Skeleton.Button active block style={{ height: 200 }} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
