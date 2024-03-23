import { Button, Card, Col, Row } from 'antd'

import Tabs from '@Components/Tabs'
import { User } from '@invinciblezealorg/lms-common'

export default function AffiliateProducts() {
  const { data: tests } = User.Queries.useGetTests()
  const { data: events } = User.Queries.useGetEvents()
  const { data: courses } = User.Queries.useGetCourses()
  return (
    <Row>
      <Col span={24}>
        <Tabs
          tabPosition="left"
          items={[
            {
              label: 'Courses',
              key: 'courses',
              children: <AffiliateProductList type="course" />
            },
            {
              label: 'Tests',
              key: 'tests',
              children: <AffiliateProductList type="test" />
            },
            {
              label: 'Events',
              key: 'events',
              children: <AffiliateProductList type="event" />
            }
          ]}
        />
      </Col>
    </Row>
  )
}

interface AffiliateProductListPropsI {
  type: string;
}

export const AffiliateProductList = (props: AffiliateProductListPropsI) => {
  // const {} = User.Queries.usegetprod
  return (
    <Card
      style={{ minHeight: '100vh' }}
      extra={<Button type="primary">Add {props.type} </Button>}
    />
  )
}
