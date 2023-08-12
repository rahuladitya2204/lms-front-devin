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
import CreateLiveTest from '../CreateLiveTest'
import { Fragment } from 'react'
import Header from '@Components/Header'
import LiveTestCard from './LiveTestCard'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography

function LiveTestsList(props: { filter: Types.GetLiveTestssFilter }) {
  const { data, isLoading: loading } = User.Queries.useGetLiveTests(
    // props.filter
  )
  const CreateLiveTestCta = (
    <ActionModal cta={<Button type="primary">Create Live Test</Button>}>
      <CreateLiveTest />
    </ActionModal>
  )
  return (
    <Fragment>
      {data.length ? (
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
          renderItem={liveTest => (
            <div style={{ padding: 30 }}>
              <LiveTestCard liveTest={liveTest} />
            </div>
          )}
        />
      ) : (
        <Card>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={<span>Start Creating a new live test</span>}
          >
            {CreateLiveTestCta}
          </Empty>
        </Card>
      )}
    </Fragment>
  )
}
export default LiveTestsList
