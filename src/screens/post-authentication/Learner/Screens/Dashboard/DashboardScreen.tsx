// @ts-nocheck
import {
  AutoComplete,
  Badge,
  Button,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Typography
} from 'antd'
import { Outlet, useNavigate } from 'react-router'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import DashboardHeader from './DashboardHeader'
import Header from '@Components/Header'
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import { Link } from 'react-router-dom'
import Search from 'antd/es/input/Search'

const { Content } = Layout
const { Text } = Typography

const LearnerDashboard: React.FC = () => {
  return (
    <Layout>
      <Layout className="site-layout">
        <DashboardHeader />
      </Layout>
    </Layout>
  )
}

export default LearnerDashboard
