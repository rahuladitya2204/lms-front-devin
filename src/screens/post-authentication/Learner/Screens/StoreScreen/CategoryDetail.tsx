import { Col, Row, Skeleton } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import AppImage from '@Components/Image'
import BackButton from '@Components/BackButton'
import CourseCard from './Cards/CourseCard'
import EventCard from './Cards/EventCard'
import Section from '@Components/Section'
import SkeletonImage from '@Components/SkeletonImage'
import TestCard from './Cards/TestCard'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import { useParams } from 'react-router'

interface CategoryDetailPropsI {}

const { Title, Text } = Typography

export default function CategoryDetail() {
  const { id: categoryId } = useParams()
  const {
    data: category,
    isLoading: loadingCategory
  } = Learner.Queries.useGetProductCategoryDetails(categoryId + '')
  const {
    data: products,
    isLoading: loadingProducts
  } = Learner.Queries.useGetCategoryProducts(categoryId + '')
  // console.log(products, 'popopo')
  const SkeletonCards = (
    <Row gutter={[20, 20]}>
      {[1, 1, 1, 1].map(() => {
        return (
          <Col sm={12} md={8} xs={24} lg={6} style={{ marginTop: 30 }}>
            <SkeletonImage active style={{ flex: 1, height: 200 }} />
          </Col>
        )
      })}
    </Row>
  )
  // const isLoading=
  return loadingCategory ? (
    <Row gutter={[20, 30]}>
      <Col span={24}>
        <Skeleton paragraph={{ rows: 1 }} active />
      </Col>
      <Col span={24}>
        <SkeletonImage style={{ flex: 1, height: 400 }} active />
      </Col>
      <Col span={24} style={{ marginTop: 50 }}>
        {SkeletonCards}
      </Col>
    </Row>
  ) : (
    <Row>
      <Col>
        <BackButton />
      </Col>
      <Col span={24}>
        <Row gutter={[20, 30]}>
          <Col span={24}>
            <Title>{category.title}</Title>
            <AppImage height={400} src={category.thumbnailImage} />
          </Col>
          <Col span={24}>
            <Title level={5}>{category.description}</Title>{' '}
          </Col>
          <Col span={24}>
            {Object.keys(products).map(key => {
              if (loadingProducts) {
                return (
                  <Row gutter={[20, 30]}>
                    <Col span={24}>{SkeletonCards}</Col>
                  </Row>
                )
              }
              /* @ts-ignore */
              return products[key]?.length ? (
                <Section title={capitalize(key)}>
                  <Row gutter={[20, 20]}>
                    {/* @ts-ignore */}
                    {products[key].map(product => {
                      return (
                        <Col sm={12} md={8} xs={24} lg={6}>
                          {key === 'courses' ? (
                            <CourseCard course={product} />
                          ) : null}
                          {key === 'events' ? (
                            <EventCard event={product} />
                          ) : null}
                          {key === 'tests' ? <TestCard test={product} /> : null}
                        </Col>
                      )
                    })}
                  </Row>
                </Section>
              ) : null
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
