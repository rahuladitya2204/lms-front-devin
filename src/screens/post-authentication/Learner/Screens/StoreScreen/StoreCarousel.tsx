import { Button, Carousel, Col, Row } from 'antd'
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import { Title } from '@Components/Typography/Typography'
import styled from '@emotion/styled'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useNavigate } from '@Router/index'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '460px',
  width: '100%',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
}

const CustomCarousel = styled(Carousel)`
.dot-class button {
  background: #000 !important;
}
  .dot-class {
    margin: 0;
  position: relative;
  top: 0;
  }
`

function HomeCarousel() {
  const { data: { packages } } = Learner.Queries.useGetRecommendedProducts()
  const navigate = useNavigate();
  console.log(packages, 'packages')
  const { width } = useBreakpoint();
  return (
    <div style={{ width: width }}>
      <CustomCarousel autoplay dots={{ className: 'dot-class' }}>
        {packages.map(bundle => {
          return <div style={contentStyle}>
            <Row gutter={[10, 20]}>
              <Col xs={24} sm={24} md={8}>
                <div style={{ margin: 'auto' }}><Image height={180} width={300} src={bundle.thumbnailImage} /></div>
              </Col>
              <Col span={16}>
                <Row gutter={[10, 20]}>
                  <Col span={24}>
                    <Title style={{ fontSize: 30, margin: 0 }}>{bundle.title}</Title></Col>
                  <Col span={24}>
                    <Button onClick={() => {
                      navigate(`/app/test-series/${bundle.slug}`)
                    }} size='small' type='primary'>See More</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        })}
      </CustomCarousel>
    </div>
  )
}

export default HomeCarousel
