import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'
import { List, Modal, Table, Tag, Tooltip } from 'antd'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddQuestion from './AddQuizQuestion'
import MoreButton from '@Components/MoreButton'
import { Typography } from '@Components/Typography'

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
              {item.type === Enum.TestQuestionType.SINGLE ? (
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
            // @ts-ignore
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
