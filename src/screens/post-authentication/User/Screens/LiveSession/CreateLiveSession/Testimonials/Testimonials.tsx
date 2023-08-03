import { Table } from 'antd'
import { Types } from '@adewaskar/lms-common'
import MoreButton from '@Components/MoreButton'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import ActionModal from '@Components/ActionModal'
import AddTestimonial from './AddTestomonial'

interface LiveSessionTestimonialsProps {
  testimonials: Types.Testimonial[];
  deleteItem: (index: number) => void;
  liveSession: Types.LiveSession;
  submit: (index: number, d: Types.Testimonial) => void;
}

export default function LiveSessionTestimonials({
  testimonials,
  liveSession,
  deleteItem,
  submit
}: LiveSessionTestimonialsProps) {
  return (
    <Table dataSource={testimonials}>
      <Table.Column title="Name" dataIndex="name" key="title" />
      <Table.Column
        title="Designation"
        dataIndex="designation"
        key="description"
      />
      <Table.Column
        title="Testimonial"
        dataIndex="testimonial"
        key="testimonial"
      />
      <Table.Column
        title="Action"
        key="action"
        render={(_: any, record: Types.Testimonial, index: number) => (
          <MoreButton
            items={[
              {
                label: (
                  <ActionModal cta={<span>Edit</span>}>
                    <AddTestimonial
                      liveSession={liveSession}
                      submit={e => submit(index, e)}
                      data={record}
                    />
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
