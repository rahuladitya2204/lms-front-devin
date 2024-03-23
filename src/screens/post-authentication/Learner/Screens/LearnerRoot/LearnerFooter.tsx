import { Col, Divider, Row, Skeleton, theme } from 'antd'
import { Common, Learner } from '@invinciblezealorg/lms-common'

import { Footer } from '@Components/Layout'
import { Fragment } from 'react'
import { LinkOutlined } from '@ant-design/icons'
import OrgLogo from '@Components/OrgLogo'
import { Typography } from '@Components/Typography'

const { Text } = Typography

export default function LearnerFooter () {
  const {
    data: organisation,
    isLoading: loading
  } = Learner.Queries.useGetOrgDetails()
  const { token } = theme.useToken()
  return (
    <Footer
      style={{
        textAlign: 'center',
        // backgroundColor: token.colorBgBase,
        marginTop: 20,
        padding: 15
      }}
    >
      <Divider style={{ marginBottom: 15 }} />
      <Row justify={'space-between'}>
        <Col>
          <LinkOutlined />
          <Text
            onClick={() => window.open('/app/policies')}
            style={{ marginLeft: 5, cursor: 'pointer' }}
            strong
          >
            View Policies
          </Text>
        </Col>
        <Col
          // span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {loading ? (
            <Fragment>
              <Skeleton.Avatar active style={{ width: 25, height: 25 }} />
              <Skeleton.Button
                active
                style={{ width: 100, height: 20, marginLeft: 20 }}
              />
            </Fragment>
          ) : (
            <Fragment>
              <OrgLogo width={25} />
              <Text style={{ marginLeft: 20 }} strong>
                {organisation.shortName}
                {/* Created by AD */}
              </Text>
              <Text strong style={{ marginLeft: 5 }}>
                © 2024
              </Text>
            </Fragment>
          )}
        </Col>
      </Row>
    </Footer>
  )
}
