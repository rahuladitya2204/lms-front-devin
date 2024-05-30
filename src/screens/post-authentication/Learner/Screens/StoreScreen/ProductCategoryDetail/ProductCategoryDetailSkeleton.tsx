"use client";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  message,
} from "@Lib/index";
import {
  CalendarOutlined,
  InfoCircleFilled,
  InfoOutlined,
  NotificationOutlined,
  ThunderboltFilled,
  WalletOutlined,
  WalletTwoTone,
} from "@ant-design/icons";
import {
  Constants,
  Enum,
  Learner,
  Store,
  Types,
  User,
  Utils,
} from "@adewaskar/lms-common";
import React, { Fragment, useMemo } from "react";
import Icon, { HomeOutlined } from "@ant-design/icons";
import { useParams } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import ActionModal from "@Components/ActionModal/ActionModal";
import Countdown from "@Components/Countdown";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import Image from "@Components/Image";
import LearnerLogin from "@Learner/Screens/Login";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import PackageCard from "../Cards/PackageCard";
import PriceCardContent from "@Learner/Screens/StoreScreen/Cards/PriceCardContent";
import ProductCategoryMetadata from "./ProductCategoryMetadata";
import ProductCheckoutButton from "@Components/CheckoutButton";
import ProductWalletNudge from "@Components/ProductWalletNudge";
import SkeletonImage from "@Components/SkeletonImage";
import Tabs from "@Components/Tabs";
// import Tabs from '@Components/Tabs'
import Title from "antd/es/typography/Title";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import ProductCategoryTabs, {
  ProductCategoryTabsSkeleton,
} from "./ProductCategoryTabs";

export default function ProductCategoryDetailSkeletonScreen() {
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Skeleton.Button active block style={{ height: 500 }} />
      </Col>
      <Col span={24}>
        <ProductCategoryTabsSkeleton />
      </Col>
    </Row>
  );
}
