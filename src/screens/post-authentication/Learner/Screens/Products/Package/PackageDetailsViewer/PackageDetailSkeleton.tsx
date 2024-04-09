"use client";

import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Skeleton,
  Tag,
  message,
} from "antd";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
import { Constants, Enum, Store, Types, Utils } from "@adewaskar/lms-common";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import Image from "@Components/Image";
import { Learner } from "@adewaskar/lms-common";
import LearnerLogin from "@Learner/Screens/Login";

import PriceCardContent from "@Learner/Screens/StoreScreen/Cards/PriceCardContent";
import ProductCheckoutButton from "@Components/CheckoutButton";

import useBreakpoint from "@Hooks/useBreakpoint";
import { useModal } from "@Components/ActionModal/ModalContext";
import Container from "@Components/Container";

interface PackageDetailViewerSkeletonPropsI {
  isServer?: boolean;
}

function PackageDetailViewerSkeleton(props: PackageDetailViewerSkeletonPropsI) {
  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30, 30]} style={{ lineHeight: 0 }}>
            <Col xs={0} sm={0} md={0} lg={24}>
              <Skeleton.Button
                active
                block
                style={{ height: 32, marginBottom: 15 }}
              />
              <Skeleton.Button active block style={{ height: 32 }} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row justify="space-between" align="top" gutter={[20, 20]}>
                <Col span={24}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
                {/* <Col span={8}>
                  <Skeleton avatar paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col> */}
              </Row>

              <Row>
                <Col style={{ marginTop: 15 }} span={24}>
                  <Skeleton.Button active style={{ height: 400 }} block />
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg={8}>
              <PackageCard />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PackageDetailViewerSkeleton;

const PackageCard = () => {
  const { isDesktop } = useBreakpoint();

  const isLoading = true;
  return (
    <Card
      cover
      bordered
      hoverable
      style={{ padding: 0 }}
      bodyStyle={{ padding: 5, paddingBottom: 15 }}
      title={
        !isDesktop ? (
          <Skeleton.Button active block style={{ height: 40 }} />
        ) : null
      }
    >
      <>
        <Row gutter={[20, 10]}>
          <Col span={24}>
            <Skeleton.Button
              active
              block
              style={{ height: 200 }}
              // preview={false}
            />
          </Col>
          <Col span={24}>
            <Skeleton.Button block />
          </Col>
          <Col span={24}>
            <Skeleton.Button block />
            <Skeleton active paragraph={{ rows: 10 }} />
          </Col>
        </Row>
      </>

      {/* </Card> */}
    </Card>
  );
};
