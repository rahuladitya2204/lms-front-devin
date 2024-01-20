import { Col, Input, Table as LibTable, Row, TableProps } from 'antd'

import { useState } from 'react'

interface TablePropsI extends TableProps<any> {
  searchFields?: string[];
  extra?: React.ReactNode[];
}

export default function Table(props: TablePropsI) {
  const [searchVal, setSearchVal] = useState('')

  // Function to safely get nested values from an object
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // Filter data based on search fields and search value
  const filteredData =
    props.searchFields && searchVal
      ? props.dataSource?.filter(item => {
          // @ts-ignore
          return props.searchFields.some(field => {
            const fieldValue = getNestedValue(item, field)
            if (fieldValue == null) {
              return false
            }
            return fieldValue
              .toString()
              .toLowerCase()
              .includes(searchVal.toLowerCase())
          })
        })
      : props.dataSource

  return (
    <Row gutter={[20, 30]}>
      {props?.searchFields?.length && props?.dataSource?.length ? (
        <Col span={24}>
          <Row justify={'space-between'}>
            <Col>
              {' '}
              <Input
                style={{ width: 250 }}
                placeholder={`Search by ${props.searchFields?.join(', ')}..`}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </Col>
            {props.extra ? <Col>{props.extra}</Col> : null}
          </Row>
        </Col>
      ) : null}
      <Col span={24}>
        <LibTable {...props} dataSource={filteredData} />
      </Col>
    </Row>
  )
}

export const TableColumn = LibTable.Column
