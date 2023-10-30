import { Table } from 'antd'
import { Types } from '@adewaskar/lms-common'
import MoreButton from '@Components/MoreButton'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import ActionModal from '@Components/ActionModal'
import AddProduct from './AddProduct'

interface ProductsProps {
  products: Types.Product[];
  deleteItem: (index: number) => void;
  submit: (index: number, d: { type: string, data: any }) => void;
}

export default function Products({
  products,
  deleteItem,
  submit
}: ProductsProps) {
  return (
    <Table dataSource={products}>
      <Table.Column title="Product Type" dataIndex="type" key="type" />{' '}
      <Table.Column title="Product Title" dataIndex="title" key="title" />
      <Table.Column
        title="Action"
        key="action"
        render={(_: any, record: Types.Product, index: number) => (
          <MoreButton
            items={[
              {
                label: (
                  <ActionModal cta={<span>Edit</span>}>
                    <AddProduct submit={e => submit(index, e)} data={record} />
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
