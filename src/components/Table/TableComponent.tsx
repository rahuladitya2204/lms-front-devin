import { Col, Input, Table as LibTable, Row, TableProps } from 'antd'

import { useState } from 'react'

interface TablePropsI extends TableProps<any> {
  searchFields?: string[];
}

export default function Table(props: TablePropsI) {
  const [searchVal, setSearchVal] = useState('')

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  const filteredData =
    props.searchFields && props.searchFields.length
      ? props.dataSource?.filter(item => {
          return props.searchFields?.some(field => {
            const fieldValue = getNestedValue(item, field)
            return fieldValue && fieldValue.toString().includes(searchVal)
          })
        })
      : props.dataSource

  return (
    <Row gutter={[20, 30]}>
      {props?.searchFields?.length && props?.dataSource?.length ? (
        <Col span={24}>
          <Input
            style={{ width: 250 }}
            placeholder={`Search by ${props.searchFields?.join(', ')}..`}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
        </Col>
      ) : null}
      <Col span={24}>
        <LibTable {...props} dataSource={filteredData} />
      </Col>
    </Row>
  )
}

export const TableColumn = LibTable.Column
