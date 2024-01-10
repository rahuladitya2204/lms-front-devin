import { Avatar, Rate, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddTestimonial from './AddTestomonial'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'

interface TestimonialsProps {
  testimonials: Types.Testimonial[];
  deleteItem: (index: number) => void;
  submit: (index: number, d: Types.Testimonial) => void;
}

export default function Testimonials<T>({
  testimonials,
  deleteItem,
  submit
}: TestimonialsProps) {
  return (
    <Table dataSource={testimonials}>
      <Table.Column
        title="Image"
        dataIndex="image"
        key="image"
        render={(_, record: Types.Testimonial) => <Avatar src={record.image} />}
      />
      <Table.Column title="Name" dataIndex="name" key="title" />
      <Table.Column
        title="Designation"
        dataIndex="designation"
        key="description"
      />
      <Table.Column
        title="Rating"
        dataIndex="rating"
        key="rating"
        render={(_, record: Types.Testimonial) => (
          <Rate disabled value={record.rating} />
        )}
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
                  //   window.open(`users/${record._id}/editor`, '_blank')
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
