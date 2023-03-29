import { Button, Col, Row, Tabs, Typography } from 'antd'

import AppCustomizerScreen from './AppCustomizer/AppCustomizerScreen'
import Header from '@Components/Header'

interface AppBuilderScreenPropsI {}

const { Title } = Typography

const AppBuilderScreen = (props: AppBuilderScreenPropsI) => {
  return (
    <Header title="App Builder" extra={[<Button type="primary">Save</Button>]}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: 'App Customisations',
                key: '1',
                children: <AppCustomizerScreen />
              },
              {
                label: 'App Configurtion',
                key: '2',
                children: 'Tab 2'
              }
            ]}
          />
        </Col>
      </Row>
    </Header>
  )
}

export default AppBuilderScreen
