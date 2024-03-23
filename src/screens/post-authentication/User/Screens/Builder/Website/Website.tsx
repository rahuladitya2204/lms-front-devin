import { Button, Card, Space, Table, Tabs } from 'antd'

import Header from '@Components/Header'
import { User } from '@invinciblezealorg/lms-common'
import WebsitePages from './WebsitePages/WebsitePages'

interface WebsiteScreenPropsI {
  //   courseId: string;
}

function WebsiteScreen(props: WebsiteScreenPropsI) {
  const {
    data: { pages },
    isLoading: loading
  } = User.Queries.useGetWebsiteDetails()
  return (
    <Header title="Website">
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            { label: 'Website Pages', key: 'pages', children: <WebsitePages /> }
          ]}
          //   onChange={onChange}
        />
      </Card>
    </Header>
  )
}

export default WebsiteScreen
