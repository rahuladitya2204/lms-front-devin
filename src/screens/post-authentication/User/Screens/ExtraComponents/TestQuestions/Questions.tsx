import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { List, Modal, Table, Tag, Tooltip, Typography } from 'antd'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddQuestion from './AddQuestion'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'

const { confirm } = Modal

interface QuestionsProps {
  data: Types.TestQuestion[];
  deleteItem: (item: Types.TestQuestion, index: number) => void;
  onUpdate: (index: number, d: Types.TestQuestion) => void;
}

export default function Questions<T>({
  data,
  deleteItem,
  onUpdate
}: QuestionsProps) {
  return (
    <List
      bordered={false}
      dataSource={data}
      renderItem={(item: Types.TestQuestion, index: number) => (
        <List.Item
          style={{ cursor: 'pointer' }}
          extra={[
            <Typography.Text>
              {item.type === 'single' ? (
                <Tag color="magenta">Single Choice</Tag>
              ) : (
                <Tag color="volcano">Multiple Choice</Tag>
              )}
              <Tag color="blue">{item?.options?.length} Options</Tag>
              <Tooltip title="Delete Question">
                <DeleteOutlined
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      // icon: <ExclamationCircleOutlined />,
                      content: `You want to delete this question`,
                      onOk() {
                        deleteItem(item, index)
                      },
                      okText: 'Yes, Delete'
                    })
                  }}
                  style={{ marginLeft: 10 }}
                />
              </Tooltip>
            </Typography.Text>
          ]}
        >
          <ActionModal
            width={650}
            cta={<Typography.Text strong>{item.title}</Typography.Text>}
          >
            <AddQuestion
              submit={q => {
                onUpdate(index, q)
              }}
              data={item}
            />
          </ActionModal>
        </List.Item>
      )}
    />
  )
}
