import { Card, Col, List, Row } from 'antd'
import { Text, Title } from '@Components/Typography/Typography'

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import { useState } from 'react'

export default function NewsDetailScreen () {
  const { id } = useParams()
  const [date, setDate] = useState(dayjs().startOf('day').toISOString())
  const { data: newsItem } = Learner.Queries.useGetNewsItem(date)
  return (
    <Row>
      <Col span={24}>
        <Title>News Summary: {dayjs(newsItem.date).format('LL')}</Title>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 20]}>
          {newsItem.summary.map(item => {
            return (
              <Col span={24}>
                <Card title={item.title}>
                  <List
                    dataSource={item.items}
                    renderItem={r => <Text>{r}</Text>}
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
