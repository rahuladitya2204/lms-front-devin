import {
  Button,
  Calendar,
  Carousel,
  Col,
  Divider,
  List,
  Row,
  Space
} from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import BGImage from './image.svg'
import CourseCard from './Cards/CourseCard'
import EventCard from './Cards/EventCard'
import { Fragment } from 'react'
import Image from '@Components/Image'
import { NavLink } from 'react-router-dom'
import PackageCard from './Cards/PackageCard'
import ProductCategoryCard from './Cards/ProductCategoryCard'
import Section from '@Components/Section'
import { Skeleton } from 'antd'
import SkeletonImage from '@Components/SkeletonImage'
import TestCard from './Cards/TestCard'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import useBreakpoint from '@Hooks/useBreakpoint'

const { Title, Paragraph, Text } = Typography

function LearnerHomeScreen () {
  const {
    data: products,
    isFetching
  } = Learner.Queries.useGetRecommendedProducts()
  const { data: categories } = Learner.Queries.useGetLearnerCategories()
  const { isTablet, isMobile } = useBreakpoint()
  const arr = [1, 1, 1, 1, 1, 1, 1, 1]
  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <HomeCarousel />
      </Col> */}
      {!isMobile ? (
        <Col span={24}>
          <Row align={'middle'} gutter={[20, 20]}>
            <Col span={12} flex={1}>
              <Title>
                One Destination for
                <br /> Complete Exam Preparation
              </Title>
              <Paragraph style={{ fontSize: 20 }}>
                🚀 Start your preparation for selections. For Free!
              </Paragraph>
              {/* <SearchLearnerCourses /> */}
            </Col>
            <Col span={12}>
              {/* <Calendar fullscreen={false} /> */}
              <Image preview={false} src={BGImage.src} />
            </Col>
          </Row>
        </Col>
      ) : null}

      {isFetching ? (
        <Col span={24}>
          <Row gutter={[50, 50]}>
            <Col
              span={24}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Skeleton.Button
                active
                style={{ width: 320, height: 45, marginTop: 25 }}
              />
            </Col>
            <Skeleton
              style={{ paddingLeft: 25 }}
              paragraph={{ rows: 1 }}
              active
            />
            {arr.map(i => {
              return (
                <Col lg={6} md={8} sm={12} xs={24}>
                  <SkeletonImage
                    style={{
                      flex: 1,
                      display: 'flex',
                      height: 140,
                      marginBottom: 10
                    }}
                  />
                  <Skeleton paragraph={{ rows: 1 }} active />
                  <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                  <Row justify={'space-between'}>
                    <Col>
                      <Skeleton.Button
                        active
                        style={{ width: 60, height: 22 }}
                      />
                    </Col>
                    <Col>
                      <Skeleton.Button
                        active
                        style={{ width: 60, height: 22 }}
                      />
                    </Col>
                  </Row>
                </Col>
              )
            })}
          </Row>
        </Col>
      ) : (
        <Col span={24}>
          <Title
            style={{ marginBottom: 20, textAlign: 'center', fontSize: 28 }}
            level={isMobile ? 2 : 1}
          >
            One Destination for Complete Exam Preparation
          </Title>
          <Row gutter={[30, 20]}>
            {categories.map(cat => {
              return (
                <Col sm={12} md={8} xs={24} lg={6}>
                  <ProductCategoryCard productCategory={cat} />
                </Col>
              )
            })}
          </Row>
        </Col>
      )}
    </Row>
  )
}

export default LearnerHomeScreen
