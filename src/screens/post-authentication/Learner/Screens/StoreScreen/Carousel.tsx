import { Carousel, Col, Row } from 'antd'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import Section from '@Components/Section'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '460px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
}

function HomeCarousel() {
  return (
    <Carousel>
      <div>
        <h3 style={contentStyle}>1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
  )
}

export default HomeCarousel
