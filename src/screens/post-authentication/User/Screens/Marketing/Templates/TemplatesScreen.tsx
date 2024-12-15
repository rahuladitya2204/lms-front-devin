// @ts-nocheck
import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import { Common, Types } from "@adewaskar/lms-common";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import ActionModal from "@Components/ActionModal/ActionModal";
import AddEmailTemplate from "./AddEmailTemplate";
import { EmailTemplateStatusMap } from "./Constant";
import EmailTemplatesScreen from "@User/Screens/Settings/EmailSetting/EmailTemplatesScreen";
import Header from "@User/Screens/UserRoot/UserHeader";
import { User } from "@adewaskar/lms-common";
import WhatsappTemplatesScreen from "./Whatsapp/WhatsappTemplatesScreen";
import { useNavigate } from "@Router/index";
import { useState } from "react";

function TemplatesScreen() {
  return (
    <Header>
      <Tabs style={{ fontSize: 30 }} size="middle">
        <Tabs.TabPane tab="Email" key="email">
          <EmailTemplatesScreen />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Whatsapp" key="whatsapp">
          <WhatsappTemplatesScreen />
        </Tabs.TabPane>
      </Tabs>
    </Header>
  );
}

export default TemplatesScreen;
