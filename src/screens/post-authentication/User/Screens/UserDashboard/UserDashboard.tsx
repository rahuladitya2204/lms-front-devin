import {
  Card,
  Col,
  Layout,
  Menu,
  Row,
  Segmented,
  Statistic,
  Tabs,
  TabsProps,
} from "antd";

import DashboardOverview from "./Overview/Overview";
import UserHeader from "../UserRoot/UserHeader";
import { useNavigate } from "@Router/index";

const { Content, Sider } = Layout;

const items: TabsProps["items"] = [
  {
    key: "overview",
    label: `Overview`,
    children: <DashboardOverview />,
  },
  {
    key: "sales",
    label: `Sales`,
    children: `Content of Tab Pane 2`,
  },
  // {
  //   key: '3',
  //   label: `Tab 3`,
  //   children: `Content of Tab Pane 3`,
  // },
];

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <UserHeader title="Dashboard">
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Tabs defaultActiveKey="1" items={items} />
        </Col>
      </Row>
    </UserHeader>
  );
};

export default UserDashboard;
