import { Col, Layout, Row, Typography, theme } from 'antd'
import { Common, Learner } from '@adewaskar/lms-common'

import OrgLogo from '@Components/OrgLogo'

const { Text } = Typography

export default function LearnerFooter () {
  const { data: organisation } = Learner.Queries.useGetOrgDetails()
  const { token } = theme.useToken()
  return (
    <Layout.Footer
      style={{
        textAlign: 'center',
        backgroundColor: token.colorBgBase,
        marginTop: 20
      }}
    >
      <Row>
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <OrgLogo width={25} />
          <Text style={{ marginLeft: 20 }} strong>
            {organisation.shortName}
            {/* Created by AD */}
          </Text>
          <Text strong style={{ marginLeft: 5 }}>
            ©2023
          </Text>
        </Col>
      </Row>
    </Layout.Footer>
  )
}
