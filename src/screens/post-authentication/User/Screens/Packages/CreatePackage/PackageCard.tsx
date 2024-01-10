import { Avatar, Badge, Card, Space, Tag, Tooltip } from 'antd'
import {
  BarChartOutlined,
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface PackageCardProps {
  package: Types.Package;
}

const PackageCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function PackageCard({ package: productPackage }: PackageCardProps) {
  const navigate = useNavigate()
  const ThumbnailImage = (
    <Image height={200} alt="example" src={productPackage.thumbnailImage} />
  )
  return (
    <PackageCardHolder
      // onClick={() => navigate(``)}
      // bodyStyle={{ height: 115 }}
      hoverable
      cover={ThumbnailImage}
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${productPackage._id}/edit`)}
        />,
        // <Tooltip placement="bottom" title={'Go to Packages builder'}>
        //   <ToolOutlined
        //     onClick={() => navigate(`${productPackage._id}/builder`)}
        //   />
        // </Tooltip>,
        <Tooltip placement="bottom" title={'Analysis'}>
          <BarChartOutlined
            onClick={() => {
              navigate(`${productPackage._id}/status`)
            }}
          />
        </Tooltip>
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={
          <Space>
            <Tag color="blue">
              Enrolled: {productPackage.analytics?.enrolled?.count}
            </Tag>
          </Space>
        }
        // avatar={<Avatar src={user?.image} />}
        title={productPackage.title || ''}
      />
    </PackageCardHolder>
  )
}

export default PackageCard
