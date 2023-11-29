import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { Learner, Types, Utils } from '@adewaskar/lms-common'
import { List, Skeleton, Typography } from 'antd'

import styled from '@emotion/styled'

const { Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = {
  // duration: {
  //   title: 'Duration',
  //   icon: <ClockCircleOutlined />,
  //   value: '43 Weeks'
  // },
  // lectures: {
  //   title: 'Lectures',
  //   icon: <ReadOutlined />,
  //   value: 1
  // },
  enrolled: {
    title: 'Enrolled',
    icon: <CheckCircleOutlined />,
    value: '1982 Students'
  },
  language: {
    title: 'Language',
    icon: <CheckCircleOutlined />,
    value: 'English'
  },
  skillLevel: {
    title: 'Skill Level',
    icon: <CheckCircleOutlined />,
    value: 'Beginner'
  },
  certificate: {
    title: 'Certificate',
    icon: <SafetyCertificateOutlined />,
    value: 'Yes'
  }
}

interface PackageMetadataPropsI {
  package: Types.Package;
}

function PackageMetadata(props: PackageMetadataPropsI) {
  const packageId = props.package._id
  const {
    data: bundle,
    isFetching: loadingPackage
  } = Learner.Queries.useGetPackageDetails(packageId, {
    enabled: !!packageId
  })
  // if (loadingPackage) {
  //   return <Skeleton paragraph={{ rows: 10 }} active />
  // }
  // data.duration.value = formatTime(bundle.totalDuration)
  // data.enrolled.value = `${bundle.analytics.enrolled.count} students`
  // data.lectures.value = bundle.totalItems
  // data.certificate.value = bundle.certificate ? 'Yes' : ''
  // data.language.value = bundle.language
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={item => (
        <ListItem actions={[<Text strong>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default PackageMetadata

function formatTime(seconds: number) {
  if (seconds < 3600) {
    return '< 1hr'
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours}hr+`
  }
}
