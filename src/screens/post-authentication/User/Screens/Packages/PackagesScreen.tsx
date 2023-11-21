import { Button, Col, Row, Space, Table } from 'antd'

import Container from '@Components/Container'
import { EditOutlined } from '@ant-design/icons'
import Header from '@User/Screens/UserRoot/UserHeader'
import MoreButton from '@Components/MoreButton'
import PackageCard from './CreatePackage/PackageCard'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

function PackagesScreen () {
  const { data, isFetching: loading } = User.Queries.useGetPackages()
  const navigate = useNavigate()
  return (
    <Header
      title={'Packages'}
      extra={[
        <Button onClick={() => navigate(`create`)} type="primary">
          Create New Package
        </Button>
      ]}
    >
      <Container>
        <Row gutter={[20, 20]}>
          {data.map(productPackage => {
            return (
              <Col span={6}>
                <PackageCard package={productPackage} />
              </Col>
            )
          })}
        </Row>
      </Container>
      {/* <Card
        bodyStyle={{ padding: 0 }}
        title={'Packages'}
        extra={
          <ActionModal cta={<Button type="primary">Create New Package</Button>}>
            <AddPackage> </AddPackage>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>

          </Col>
        </Row>
      </Card> */}
    </Header>
  )
}

export default PackagesScreen
