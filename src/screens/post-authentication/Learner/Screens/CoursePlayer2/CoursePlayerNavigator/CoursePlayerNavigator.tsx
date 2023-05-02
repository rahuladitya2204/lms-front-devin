import { Card, Collapse, List, Progress, Space, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import CoursePlayerNavigatorItem from './CoursePlayerNavigatorItem'
import { Fragment } from 'react'
import styled from '@emotion/styled'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  margin-top: 10px;
  div.ant-collapse {
    border-radius: 0 !important;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-list-item {
    padding: 15px;
  }
`

const { Text, Title } = Typography

interface CoursePlayerNavigatorPropsI {
  courseId: string;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CoursePlayerNavigator(props: CoursePlayerNavigatorPropsI) {
  const { data: { course } } = Learner.Queries.useGetEnrolledCourseDetails(
    props.courseId,
    {
      enabled: !!props.courseId
    }
  )
  const sections = course.sections
  return (
    <Fragment>
      {sections.map((section, index) => {
        const itemsCompleted = section.items.filter(item => item.isCompleted)
        const sectionProgress = Math.ceil(
          itemsCompleted.length / section.items.length * 100
        )
        return (
          <Card
            bodyStyle={{ padding: 0 }}
            key={section._id}
            title={section.title}
            // extra={<a href="#">More</a>}
            style={{ marginBottom: 20 }}
          >
            <List
              dataSource={section.items}
              renderItem={(item, itemIndex) => (
                <CoursePlayerNavigatorItem
                  courseId={props.courseId}
                  section={section}
                  toggleItemCheck={props.toggleItemCheck}
                  item={item}
                  itemIndex={index + itemIndex + 1}
                />
              )}
            />
          </Card>
          // <CustomCollapse
          //   // bordered={false}
          //   expandIconPosition="end"
          //   defaultActiveKey={sections.map((s, i) => s._id)}
          // >
          //   <Panel
          //     header={
          //       <Space>
          //         <Progress
          //           format={() => <Text strong>{index + 1}</Text>}
          //           type="circle"
          //           percent={sectionProgress}
          //           size={35}
          //         />
          //         <Typography.Title level={5}>{section.title}</Typography.Title>
          //       </Space>
          //     }
          //     key={section._id}
          //   >
          // <List
          //   // itemLayout="horizontal"
          //   dataSource={section.items}
          //   renderItem={(item, itemIndex) => (
          //     <CoursePlayerNavigatorItem
          //       courseId={props.courseId}
          //       section={section}
          //       toggleItemCheck={props.toggleItemCheck}
          //       item={item}
          //       itemIndex={index + itemIndex + 1}
          //     />
          //   )}
          // />
          //   </Panel>
          // </CustomCollapse>
        )
      })}
      {/* {sections.map((section, sectionIndex) => {
        return (
          <CustomCollapse>
         
          </CustomCollapse>
        )
      })} */}
    </Fragment>
  )
}

export default CoursePlayerNavigator
