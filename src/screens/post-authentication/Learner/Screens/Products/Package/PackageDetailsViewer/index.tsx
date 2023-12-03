import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Rate,
  Row,
  Skeleton,
  Tag,
  Typography
} from 'antd';
import {
  AlertOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Constants, Store, Types, Utils } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal';
import Image from '@Components/Image'
import { Learner } from '@adewaskar/lms-common'
import LearnerLogin from '@Learner/Screens/Login';
import { LoginLearner } from '@adewaskar/lms-common/lib/cjs/types/Learner/Api';
import PackageDetails from './PackageDetails'
import PackageMetadata from './PackageMetadata'
import ProductCheckoutButton from '@Components/CheckoutButton';
import { formatAvgCount } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';
import image from './bg.svg'
import styled from '@emotion/styled'
import useMessage from '@Hooks/useMessage';

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
  // const instructor = bundle.instructor as unknown as Types.Instructor;
  const plan = bundle.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  const category = bundle?.category as unknown as Types.ProductCategory;
  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={24}>
          <Row gutter={[30,30]} style={{lineHeight: 0}} >
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
                      <Col lg={0}>
                        <PackageCard plan={plan} packageId={packageId+''} />
                        {/* Replace with card image */}
                    {/* <PackageMetadata package={package} /> */}
                    </Col>

              <Col span={24}>
                <PackageTitle className="package-title" level={3}>
                  {bundle.title}
                </PackageTitle>
                <Col span={24} />
                {/* <PackageSubTitle className="package-title">
                  {bundle.subtitle}
                </PackageSubTitle> */}
              </Col>
              <Col ></Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              {/* <Col xs={24} sm={18} md={16} lg={12}>
                <Row justify="start" align="middle" gutter={[20,20]}>
                  <Col>
                    <Avatar
                      size={64}
                      src={instructor?.image || <UserOutlined color="black" />}
                    />
                  </Col>
                  <Col>
                    <MetaText strong>Created By</MetaText> <br />
                    <MetaText>{instructor?.name}</MetaText>
                  </Col>
                </Row>
              </Col> */}
              <Col xs={0} sm={0} md={0} lg={6}>
                <MetaText strong>Categories</MetaText> <br />
                <MetaText>{category?.title}</MetaText>
              </Col>
              {/* <Col xs={24} sm={6} md={7} lg={6}>
                <MetaText strong>Review</MetaText> <br />
                <CustomRate
                  disabled
                  style={{ fontSize: 15 }}
                  value={bundle.analytics.reviews.count}
                />{' '}
                    {bundle.analytics.averageRating}
                    ({formatAvgCount(bundle.analytics.reviews.count)} reviews)
                <MetaText />
              </Col> */}
            </Row>
          </Col>
        </Row>}
      

          <Row>
            <Col style={{ marginTop: 15 }} span={24}>
              <PackageDetails package={bundle} />
            </Col>
          </Row>
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
  const isAddedToCart = items.find((cartItem:Types.CartItem) => cartItem.product.id === bundle._id);
  const {isSignedIn}= Store.useAuthentication(s => s);
  const { data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'package',
    id: '65656a12eff93f74224193e3'
  });
  console.log(ep, 'er');
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);

  const isLoading =  loadingPackage;
  return    <Card
  cover
  bordered hoverable
  style={{ padding: 0 }}
  bodyStyle={{ padding: 5 }}
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
        <Col span={24}>
          <Row justify="space-between" align='middle'>
        <Col>
            <Row align='middle' gutter={[5, 5]}>
              <Col><Text strong style={{ fontSize: 24 }}>{UnitTypeToStr(plan.finalPrice)}</Text></Col>
             <Col><Text style={{ textDecoration: 'line-through' }} type='secondary'>{UnitTypeToStr(plan.displayPrice)}</Text></Col>
          </Row>
        </Col>
        <Col>
          <Tag color="purple">{ Math.floor(Number(plan.discount))}% off</Tag>
        </Col>
      </Row>
    </Col>
      <Col span={24}>
        <Row gutter={[15, 15]}>
        {isSignedIn?<><Col span={24}>
          {!isEnrolled?<Button loading={addingToCart} disabled={!!isAddedToCart} onClick={()=>addItemToCart(bundle)} size="large" block>
            {isAddedToCart?`Added to cart`:`Add To Cart`}
          </Button>:null}
        </Col>
        <Col span={24}>
         {isEnrolled?   <Button onClick={()=>navigate(`player`)}size="large" type="primary" block>
            Go to Package
                  </Button> :
                      <ProductCheckoutButton plan={plan}
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
          //           <Button onClick={() => enrollForPackage(bundle._id)} size="large" type="primary" block>
          //   Enroll Now
          // </Button>
                  }
                </Col>{' '}</> :
                <Col span={24}>
                  <ActionModal width={300}
                    cta={<Button size="large" type="primary" block>
            Login to access this package
                </Button>}>
                  <LearnerLogin/>
          </ActionModal></Col>
            }
            {children? <Col span={24}>
          {children}
        </Col>:null}
       
      </Row>
    
    </Col>
  </Row></>}
      
  {/* </Card> */}
</Card>
}