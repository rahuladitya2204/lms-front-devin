import { Button, Card, Col, Row } from 'antd'
import { Types, User } from '@invinciblezealorg/lms-common'

import DripSection from './DripSection'

interface CourseDripPropsI {
  course: Types.Course;
  saveCourse: (course: Partial<Types.Course>) => void;
}

function CourseDrip(props: CourseDripPropsI) {
  const { course } = props
  const updateSection = (updatedSection: Types.CourseSection) => {
    const sections = [...course.sections]
    sections.forEach((section, index) => {
      if (section._id === updatedSection._id) {
        sections[index] = updatedSection
      }
    })
    props.saveCourse({
      sections: sections
    })
  }

  return (
    <Row gutter={[30, 30]}>
      {course.sections.map(section => {
        return (
          <Col span={24}>
            <DripSection updateSection={updateSection} section={section} />
          </Col>
        )
      })}
    </Row>
  )
}

export default CourseDrip
