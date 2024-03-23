import { Carousel } from 'antd'
import Image from '@Components/Image'
import { Learner } from '@invinciblezealorg/lms-common'

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '460px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79'
}

function HomeCarousel() {
  const { data: { tests } } = Learner.Queries.useGetRecommendedProducts()
  return (
    <Carousel>
      {tests.map(test => {
        return (
          <div style={{ width: 300, height: 300, ...contentStyle }}>
            {/* <Image src={test.thumbnailImage} /> */}
          </div>
        )
      })}
    </Carousel>
  )
}

export default HomeCarousel
