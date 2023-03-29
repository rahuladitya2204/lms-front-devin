import { Carousel } from 'antd'
import Image from '@Components/Image'

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
    <Carousel autoplay>
      <div>
        <Image src="https://i.imgur.com/oi5kvIS.png" />
        {/* </h3> */}
      </div>
      <div>
        <Image src="https://i.imgur.com/nPCIEnE.jpg" />
      </div>
      <div>
        <Image src="https://i.imgur.com/dlcgOtk.png" />
      </div>
      {/* <div>
        <h3 style={contentStyle}>4</h3>
      </div> */}
    </Carousel>
  )
}

export default HomeCarousel
