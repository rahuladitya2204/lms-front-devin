import {
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateTest from '../CreateTest'
import { Fragment } from 'react'
import Header from '@Components/Header'
import TestCard from './TestCard'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const { data, isLoading: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
  )
  const CreateTestCta = (
    <ActionModal cta={<Button type="primary">Create Tests</Button>}>
      <CreateTest />
    </ActionModal>
  )
  return (
    <Fragment>
      {!data.length ? (
        <Empty description={`No Tests found`} />
      ) : (
        <List
          grid={{ gutter: 20, column: 4 }}
          size="large"
          // pagination={{
          //   onChange: (page) => {
          //     console.log(page);
          //   },
          //   pageSize: 3,
          // }}
          dataSource={data}
          renderItem={test => (
            <div style={{ padding: 30 }}>
              <TestCard test={test} />
            </div>
          )}
        />
      )}
    </Fragment>
  )
}
export default TestsList
