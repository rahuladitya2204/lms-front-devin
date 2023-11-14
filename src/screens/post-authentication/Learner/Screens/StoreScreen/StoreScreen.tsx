import { Calendar, Carousel, Col, Divider, List, Row, Typography } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import BGImage from './image.svg'
import CourseCard from './Cards/CourseCard'
import EventCard from './Cards/EventCard'
import HomeCarousel from './StoreCarousel'
import Image from '@Components/Image'
import Section from '@Components/Section'
import { Skeleton } from 'antd'
import TestCard from './Cards/TestCard'
import { capitalize } from 'lodash'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useParams } from 'react-router-dom'

const { Title, Paragraph,Text } = Typography

function StoreScreen () {
 const {
    data: products,
    isFetching
  } = Learner.Queries.useGetRecommendedProducts()
  const { data: categories } = Learner.Queries.useGetLearnerCategories()
  const { isTablet,isMobile} = useBreakpoint();
  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <HomeCarousel />
      </Col> */}
      {!isMobile?<Col span={24}>
        <Row align={'middle'} gutter={[20,20]}>
          <Col span={12} flex={1}>
            <Title>
              Find your Preferred <br /> Courses and Mock Tests & Improve Your Skills
            </Title>
            <Paragraph>
              Build skills with courses, certificates, and degrees online from{' '}
              <br />
              world-class universities and companies.
            </Paragraph>
            {/* <SearchLearnerCourses /> */}
          </Col>
          <Col span={12}>
          {/* <Calendar fullscreen={false} /> */}
          <Image preview={false} src={BGImage} />
          </Col>
        </Row>
      </Col>:null}
   
      {isFetching ? <Col span={24}>
   
        <Row gutter={[50, 50]}>
        <Col span={24}>
          <Skeleton paragraph={{rows: 1}}	 />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        </Row></Col> : <>
        <Divider>
        <Title level={isMobile?2:1}>Expore our products</Title>
        </Divider>
          
          {/* <Row gutter={[20,20]}> */}
          {Object.keys(products).map(key => {
            // @ts-ignore
            const productItems = products[key];
            return productItems.length?<Col span={24}><Section title={capitalize(key) }>
          {categories.map(category => {
        const categorizedProducts = productItems.filter(
                 // @ts-ignore
                 prod => prod.category === category._id
        )
        if (!categorizedProducts.length) {
          return null
        }
            console.log(categorizedProducts,'categorizedProducts')
        return (
          <Col span={24} style={{marginTop:20}}>
            <Section title={<Text style={{fontSize:20}} >{category.title}</Text>}
              // subtitle={category.description}
            >
              <Row gutter={[20,30]}>
              <Col span={24}>
                    <Row gutter={[30,20]} >
                      {categorizedProducts.map((product:any) => {
                        return  <Col  
                        sm={12} 
                        md={8} xs={24}
                        lg={6}  >
                          {key==='courses'?<CourseCard course={product} />:null}
                          {key==='events'?<EventCard event={product} />:null}
                          {key==='tests'?<TestCard test={product} />:null}
    </Col>
                      })}
                    </Row>
              </Col>
              </Row>
            </Section>
          </Col>
        )
      })}
       </Section> </Col>:null
     })}
          {/* </Row> */}
  
</>}
    </Row>
  )
}

export default StoreScreen
