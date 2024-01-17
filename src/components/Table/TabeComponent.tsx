import { Col, Input, Table as LibTable, Row, TableProps } from 'antd'

interface TablePropsI extends TableProps<any> {}

export default function Table(props: TablePropsI) {
  return (
    <Row>
      <Col span={24}>
        <Input />
      </Col>
      <Col span={24}>
        <LibTable {...props} />
      </Col>
    </Row>
  )
}
