import { Button, Col, Row, Tabs, Typography } from 'antd'

import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import WebsitePages from './WebsitePages/WebsitePages'

interface WebsiteBuilderScreenPropsI {}

const { Title } = Typography

const WebsiteBuilderScreen = (props: WebsiteBuilderScreenPropsI) => {
  const { data: website } = User.Queries.useGetWebsiteDetails()
  console.log(website, 'website')
  return (
    <Header
      title="Website Builder"
      extra={[<Button type="primary">Save</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <WebsitePages />
        </Col>
      </Row>
    </Header>
  )
}

export default WebsiteBuilderScreen
