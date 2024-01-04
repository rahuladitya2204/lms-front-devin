import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Skeleton,
  Tag,
} from 'antd';
import {
  AlertOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Constants, Enum, Store, Types, Utils } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal';
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import LearnerLogin from '@Learner/Screens/Login';
import { LoginLearner } from '@adewaskar/lms-common/lib/cjs/types/Learner/Api';
import PackageDetails from './PackageDetails'
import PackageMetadata from './PackageMetadata'
import PriceCardContent from '@Learner/Screens/StoreScreen/Cards/PriceCardContent';
import ProductCheckoutButton from '@Components/CheckoutButton';
import ProductWalletNudge from '@Components/ProductWalletNudge';
import { Typography } from '@Components/Typography';
import { formatAvgCount } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';
import image from './bg.svg'
import styled from '@emotion/styled'
import useBreakpoint from '@Hooks/useBreakpoint';
import useMessage from '@Hooks/useMessage';
import { useModal } from '@Components/ActionModal/ModalContext';

const { UnitTypeToStr } = Utils;

const { Title, Text, Paragraph } = Typography

const ThumbnailSkeleton = styled(Skeleton.Image)`
.ant-skeleton-image{
  width: 100%;
  height: 20px;
}
.ant-skeleton-active{
  display: block !important; 
}
`

const Container = styled.div`
  /* background-image: url(${image}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`

const MetaText = styled(Text)`
`

const PackageTitle = styled(Title)`

`

const PackageSubTitle = styled(Paragraph)`

  font-size: 20px;
`

function PackageDetailViewer () {
  const { id: packageId } = useParams();
  const { data: bundle,isFetching: loadingPackage } = Learner.Queries.useGetPackageDetails(packageId + '', {
    enabled: !!packageId
  });
  const plan = bundle.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30, 30]} style={{ lineHeight: 0 }} >
          <Col xs={0} sm={0} md={0} lg={24}>
                <PackageTitle className="course-title" level={3}>
                  {bundle.title}
                </PackageTitle>
                <Col span={24} />
                        <PackageSubTitle className="course-title">
                          {/* @ts-ignore */}
                  {bundle.subtitle}
                </PackageSubTitle>
              </Col>
            <Col xs={24} sm={24} md={24} lg={16} >

              {loadingPackage ? <Row justify="space-between" align="top" gutter={[20, 20]}>
                <Col span={24}>
                <Skeleton  paragraph={{ rows: 1 }} />

                </Col>
                <Col span={8}>
                  <Skeleton avatar paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
                <Col span={8}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </Col>
              </Row> :
                <Row justify="space-between" align="top" gutter={[20, 20]}>
          
          <Col span={24}>
                    <Row gutter={[30, 30]}>
                      <Col xs={24} lg={0}>
                        <PackageCard plan={plan} packageId={packageId+''} />
                    </Col>
              <Col ></Col>
            </Row>
          </Col>

        </Row>}
      

          <Row>
            <Col style={{ marginTop: 15 }} span={24}>
              <PackageDetails package={bundle} />
            </Col>
          </Row>
        
              {/* </Card> */}
            </Col>
        <Col xs={0} sm={0} md={0} lg={8}>
              <PackageCard plan={plan} packageId={packageId+''}>
                <PackageMetadata package={bundle} />
       </PackageCard>
            </Col></Row>
        </Col>
      </Row>
    </Container>
  )
}

export default PackageDetailViewer


const PackageCard = ({packageId,plan,children}: {
  packageId: string,
  plan: Types.Plan,
  children?:React.ReactNode
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const product = { type: 'package', id: packageId };
  const { data: bundle,isFetching: loadingPackage } = Learner.Queries.useGetPackageDetails(packageId + '', {
    enabled: !!packageId
  });
  const message = useMessage();
  const navigate = useNavigate();

  const { mutate: updateCart,isLoading: addingToCart } = Learner.Queries.useUpdateCartItems()
  const addItemToCart = (bundle:Types.Package) => {
    updateCart({ data: { product: product }, action: 'add' });
  }
  const { data: {items} } = Learner.Queries.useGetCartDetails();
  const { isSignedIn } = Store.useAuthentication(s => s);
  const {isDesktop } = useBreakpoint();
  const { data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'package',
    id: '65656a12eff93f74224193e3'
  });
  console.log(ep, 'er');
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);
  const { openModal } = useModal()

  const isLoading =  loadingPackage;
  return    <Card
  cover
  bordered hoverable
  style={{ padding: 0 }}
    bodyStyle={{ padding: 5, paddingBottom: 15 }}
    title={!isDesktop ? <Text>{ bundle.title}</Text>:null}
    >
      {isLoading ?
        <>
          <Row gutter={[20, 10]}>
            <Col span={24}>
            <Image  width={'100%'} height={200} preview={false} />
            </Col>
            <Col span={24}>
            <Skeleton.Button block/>
            </Col>
            <Col span={24}>
            <Skeleton.Button block/>
<Skeleton active paragraph={{ rows: 10 }} /> 
            </Col>
        </Row>
        </> : <>  <Row gutter={[20, 10]}>
      <Col span={24}>
        <Image  width={'100%'} height={200} preview={false} src={bundle.thumbnailImage} />
</Col>
{!isEnrolled?  <Col span={24} style={{padding:'0 20px'}}>
            <PriceCardContent plan={plan} /> 
           {!isMobile? <Divider style={{margin:10}} />:null}
    </Col>:null}
      <Col span={24} style={{padding:'0 20px'}}>
          <Row gutter={[15, 15]}>
          {children? <Col span={24}>
          {children}
        </Col>:null}
        {isSignedIn?<>
        <Col span={24}>
         {isEnrolled?   <Button onClick={()=>navigate(`enrolled-package`)}size="large" type="primary" block>
            Go to Package
                  </Button> :
                      <ProductCheckoutButton 
                      onSuccess={() => {
                        message.open({
                          type: 'success',
                          content: `You have enrolled successfully`,
                          particle: true
                        })
                      }}
                      product={{ type: 'package', id: packageId + '' }}
                      block
                      type="primary"
                    >
                      Enroll Now
                    </ProductCheckoutButton>
                  }
                </Col>{' '}</> :
              <Col span={24}>
                <Button onClick={() => {
                  openModal(<LearnerLogin />, {
                    width: 300
                  })
                }} size="large" type="primary" block>
            Login to access this package
                </Button>
                  {/* <ActionModal width={300}
                    cta={<Button size="large" type="primary" block>
            Login to access this package
                </Button>}>
                  <LearnerLogin/>
                </ActionModal> */}
              </Col>
            }
         
       
      </Row>
    
    </Col>
  </Row></>}
      
  {/* </Card> */}
</Card>
}