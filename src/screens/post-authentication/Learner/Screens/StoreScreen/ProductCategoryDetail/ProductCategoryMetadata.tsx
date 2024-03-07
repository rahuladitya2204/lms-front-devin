import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined
} from '@ant-design/icons'
import { Constants, Enum, Learner, Types, Utils } from '@adewaskar/lms-common'
import { List, Tag } from 'antd'

import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

const { Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = {
  scheduledFor: {
    title: 'Date',
    icon: <CalendarOutlined />,
    value: ''
  },
  duration: {
    title: 'Duration',
    icon: <ClockCircleOutlined />,
    value: '43 Weeks'
  },
  mode: {
    title: 'ProductCategory Mode',
    icon: <EditOutlined />,
    value: null
  },
  language: {
    title: 'Language',
    icon: <FileTextOutlined />,
    value: null
  },
  enrolled: {
    title: 'Enrolled',
    icon: <SafetyCertificateOutlined />,
    value: '1'
  },
  expiresAt: {
    title: 'You can access till',
    icon: <ScheduleOutlined />,
    value: ''
  }
  // questions: {
  //   title: 'Questions',
  //   icon: <EditOutlined />,
  //   value: '-'
  // },
  // language: {
  //   title: 'Language',
  //   icon: <CheckCircleOutlined />,
  //   value: 'English'
  // },
  // skillLevel: {
  //   title: 'Skill Level',
  //   icon: <CheckCircleOutlined />,
  //   value: 'Beginner'
  // },
  // certificate: {
  //   title: 'Certificate',
  //   icon: <SafetyCertificateOutlined />,
  //   value: 'Yes'
  // }
}

interface ProductCategoryMetadataPropsI {
  productCategory: Types.ProductCategory;
}

function ProductCategoryMetadata(props: ProductCategoryMetadataPropsI) {
  const {
    data: enrolledDetails,
    isLoading: loadingEnrolledProductCategory
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'productCategory',
    id: props.productCategory._id + ''
  })

  if (enrolledDetails.plan.expiresAt) {
    data.expiresAt.value = dayjs(enrolledDetails.plan.expiresAt).format('LL')
  }

  // data.certificate.value = props.productCategory.certificate ? 'Yes' : ''
  // data.questions.value = useMemo(
  //   () => props.productCategory.sections.map(i => i.items).flat().length.toString(),
  //   [props.productCategory]
  // )
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource.filter(i => i.value)}
      renderItem={item => (
        <ListItem actions={[<Text>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default ProductCategoryMetadata

function formatTime(minute: number) {
  const seconds = minute * 60
  if (minute < 60) {
    return `${minute} mins`
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hr`
  }
}
