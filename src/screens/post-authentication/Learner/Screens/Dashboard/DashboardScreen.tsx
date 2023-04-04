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
import ThemeProvider from 'screens/ThemeProvider'

const { Content } = Layout
const { Text } = Typography

const LearnerDashboard: React.FC = () => {
  return (
    <ThemeProvider type="learner">
      <Layout>
        <Layout className="site-layout">
          <DashboardHeader />
        </Layout>
      </Layout>
    </ThemeProvider>
  )
}

export default LearnerDashboard
