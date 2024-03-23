import {
  BarChartOutlined,
  EditOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Space, Table } from 'antd'

import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import MoreButton from '@Components/MoreButton'
import PackageCard from './CreatePackage/PackageCard'
import PackageStatusTag from './PackageStatusTag'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

function PackagesScreen() {
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
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table loading={loading} dataSource={data}>
            <Table.Column
              title="Title"
              dataIndex="title"
              key="title"
              render={(_: any, bundle: Types.Package) => (
                <Button
                  onClick={() => navigate(`${bundle._id}/edit`)}
                  type="link"
                  size="small"
                >
                  {bundle.title}
                </Button>
              )}
            />
            <Table.Column
              title="Analysis"
              dataIndex="analysis"
              key="analysis"
              render={(_: any, bundle: Types.Package) => (
                <Button
                  icon={<BarChartOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => navigate(`${bundle._id}/status`)}
                >
                  Show Analysis
                </Button>
              )}
            />
            {/* <Table.Column
              title="Questions"
              dataIndex="status"
              key="status"
              render={(_: any, bundle: Types.Package) =>
                bundle.sections.map(i => i.items).flat().length
              }
            /> */}
            <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              // @ts-ignore
              render={(_: any, bundle: Types.Package) => (
                // @ts-ignore
                <PackageStatusTag bundle={bundle} />
              )}
            />

            <Table.Column
              title="Enrolled"
              dataIndex="enrolled"
              key="enrolled"
              render={(_: any, bundle: Types.Package) =>
                bundle.analytics.enrolled.count
              }
            />
            {/* <Table.Column
              title="Duration"
              dataIndex="duration"
              key="duration"
              render={(_: any, bundle: Types.Package) =>
                bundle.duration.enabled ? bundle.duration.value + ' mins' : '-'
              }
            /> */}
            {/* <Table.Column
              title="Action"
              key="action"
              render={(_: any, bundle: Types.Package, index: number) => (
                <MoreButton
                  items={[
                    {
                      label: 'Open Test Builder',
                      key: 'bundle-builder',
                      icon: <SettingOutlined />,
                      onClick: () => {
                        window.open(
                          `/app/products/bundle/${bundle._id}/builder`
                        )
                      }
                    }
                  ]}
                />
              )}
            /> */}
          </Table>
        </Col>
      </Row>
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
