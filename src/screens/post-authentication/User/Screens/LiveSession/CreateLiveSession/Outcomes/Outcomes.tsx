import { Table } from 'antd'
import AddOutcome, { Outcome } from './AddOutcome'
import { Types } from '@adewaskar/lms-common'
import MoreButton from '@Components/MoreButton'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import ActionModal from '@Components/ActionModal'

interface LiveSessionOutcomesProps {
  outcomes: Outcome[];
  deleteItem: (index: number) => void;
  submit: (index: number, d: Outcome) => void;
}

export default function LiveSessionOutcomes({
  outcomes,
  deleteItem,
  submit
}: LiveSessionOutcomesProps) {
  return (
    <Table dataSource={outcomes}>
      <Table.Column title="Title" dataIndex="title" key="title" />
      <Table.Column
        title="Description"
        dataIndex="description"
        key="description"
      />
      <Table.Column
        title="Action"
        key="action"
        render={(_: any, record: Outcome, index: number) => (
          <MoreButton
            items={[
              {
                label: (
                  <ActionModal cta={<span>Edit</span>}>
                    <AddOutcome submit={e => submit(index, e)} data={record} />
                  </ActionModal>
                ),
                key: 'edit',
                icon: <EditOutlined />
              },
              {
                label: 'Delete ',
                onClick: () => {
                  deleteItem(index)
                  //   window.open(`instructors/${record._id}/editor`, '_blank')
                },
                key: 'edit',
                icon: <DeleteOutlined />
              }
            ]}
          />
        )}
      />
    </Table>
  )
}
