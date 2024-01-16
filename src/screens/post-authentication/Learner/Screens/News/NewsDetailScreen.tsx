import { Card, Col, DatePicker, Form, List, Row, Spin } from 'antd'
import { Text, Title } from '@Components/Typography/Typography'
import { useEffect, useState } from 'react'

import Header from '@Components/Header'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import { Learner } from '@adewaskar/lms-common'
import PDFViewer from '@Components/PDFViewer'
import Tabs from '@Components/Tabs'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

export default function NewsDetailScreen() {
  const [params, setParams]: any[] = useSearchParams();
  console.log(params, 'lsls;l')
  const paramsDate = params.get('date');
  useEffect(() => { 
    // console.log(params,'paor')
    if (paramsDate) {
      setDate(dayjs(paramsDate).startOf('day'))
    }
    else {
      setParams({
        // @ts-ignore
        date: dayjs().startOf('day').toISOString()
      })
    }
  }, [paramsDate])
  const { id } = useParams()
  const [date, setDate] = useState(dayjs().startOf('day'))
    const { data: newsItem,isLoading } = Learner.Queries.useGetNewsItem(date.toISOString());
  return (
    <Header title={`News: ${dayjs(newsItem.date).format('LL')}`}>
      <Row>
      <Col sm={1} md={2} xs={0}></Col>
      <Col xs={24} md={20} sm={22}>
        <Card bodyStyle={{minHeight:600}}>
        <Form.Item label="Select Date">
              {/* @ts-ignore */}
                <DatePicker value={date} style={{width:150}} onChange={e => setParams({
                  date: e?.toISOString()
              })} />
            </Form.Item>
        <Spin spinning={isLoading} >
      <Tabs items={[
        {
          label: 'Summary',
          key: 'summary',
          children: <Row>
          <Col span={24}>
          </Col>
        {newsItem?<>  <Col span={24}>
            {/* <Title>News Summary: {dayjs(newsItem.date).format('LL')}</Title> */}
          </Col>
          <Col span={24}>
            <Row gutter={[20, 20]}>
              {newsItem.summary.map(item => {
                return (
                  <Col span={24}>
                    <Card bodyStyle={{paddingTop:0}} title={item.title}>
                      <List
                        dataSource={item.items}
                        renderItem={r => <Title level={5}>{r}</Title>}
                      />
                    </Card>
                  </Col>
                )
              })}
            </Row>
                  </Col>
              </>:<Title>News not uploaded</Title>}
        </Row>
        }, {
          label: 'Read News Paper',
          key:'view-paper',
          children: <Row>
            <Col span={24}>
          <PDFViewer file={{_id:newsItem.file.file}} />
            </Col>
          </Row>
            }
          ]} />
          </Spin>
          
      </Card>
      </Col>
      <Col sm={1} md={2} xs={0}></Col>
      </Row>
      
    </Header>
  )
}
