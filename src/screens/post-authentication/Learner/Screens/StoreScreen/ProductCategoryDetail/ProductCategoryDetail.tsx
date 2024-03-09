import { Alert, Avatar, Badge, Button, Card, Col, Collapse, Divider, List, Row, Skeleton, Space, Tag, Tooltip, message } from 'antd'
import { CalendarOutlined, InfoCircleFilled, InfoOutlined, NotificationOutlined, WalletOutlined, WalletTwoTone } from '@ant-design/icons'
import { Constants, Enum, Learner, Store, Types, User, Utils } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal/ActionModal'
import Countdown from '@Components/Countdown'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import Image from '@Components/Image'
import LearnerLogin from '@Learner/Screens/Login'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import PackageCard from '../Cards/PackageCard'
import PriceCardContent from '@Learner/Screens/StoreScreen/Cards/PriceCardContent'
import ProductCategoryMetadata from './ProductCategoryMetadata'
import ProductCheckoutButton from '@Components/CheckoutButton'
import ProductWalletNudge from '@Components/ProductWalletNudge'
import SkeletonImage from '@Components/SkeletonImage'
import Tabs from '@Components/Tabs'
import Title from 'antd/es/typography/Title'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useQueryClient } from '@tanstack/react-query'

const { Text, Paragraph } = Typography
const { UnitTypeToStr } = Utils;

interface ProductCategoryDetailScreenPropsI {}

export default function ProductCategoryDetailScreen(
  props: ProductCategoryDetailScreenPropsI
) {
  const { id: productCategoryId } = useParams();
  const { isMobile } = useBreakpoint();
  const { data: productCategory, isLoading: loadingProductCategory } = Learner.Queries.useGetProductCategoryDetails(productCategoryId + '');
  const { data: packages, isFetching: loading } = Learner.Queries.useGetPackages(productCategory._id, {
    enabled: !!productCategory._id
  })
  const TABS = [
    {
      label: 'Overview',
      key: 'overview',
      children: <Paragraph style={{ fontSize: 16 }}>
        <HtmlViewer content={productCategory.landingPage.description} />
      </Paragraph>
    },
    // ...productCategory.info.links.map(link => {
    //   return {
    //     label: link.title,
    //     key:link.title,
    //     children:<HtmlViewer content={link.description} />
    //   }
    // })
  ];
  if (packages.length) {
    TABS.push({
      label: `Test Series(${packages.length})`,
      key: 'tests',
      children: <Row gutter={[20,20]}>
        {packages.map(bundle => {
         return  <Col   sm={12} 
         md={8} xs={24}
           lg={8}  >
           <PackageCard package={bundle} />
         </Col>
       })}
      </Row>
    })
  }
  // if (productCategory?.info?.faqs?.length) {
  //   TABS.push({
  //     label: 'FAQs',
  //     key: 'faqs',
  //     children: <Collapse items={productCategory.info.faqs.map(faq => {
  //       return {
  //         label: faq.title,
  //         children: <Paragraph>{faq.description}</Paragraph>
  //       }
  //     })} />
  //   })
  // }
  const Metadata = <ProductCategoryMetadata productCategory={productCategory} />
  const TabInfoUpdates = <Card style={{minHeight:400}}>
    <Tabs items={[
      {
        label: 'More Info',
        key: 'info',
        children: <ProductCategoryCard productCategoryId={productCategoryId + ''}>
          {productCategory.info?Metadata:null}
        </ProductCategoryCard>
      },
      {
        label: 'Latest Updates',
        key: 'latest-updates',
        children: <Row gutter={[20, 20]}>
          {productCategory.info.updates.map(item => {
          return <Col span={24}>
            <Alert action={<Row>
              <Col><Tag>{dayjs(item.date).format('L')}</Tag></Col>
              <Col>
                <Tooltip color='#fff' placement='left' title={<HtmlViewer content={item.description} /> }>
                  <InfoCircleFilled />
              </Tooltip></Col>
            </Row>} icon={<NotificationOutlined/>} showIcon message={item.title} />
          </Col>
        })}
        </Row>
      }
    ]} />
  </Card>;
  const Banners = productCategory.info.updates.filter(i => i.displayAsBanner);
  return (
    <Row gutter={[20, 30]}>
    {loadingProductCategory ? null : <>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Row align={'middle'}>
          <Col>
            <Avatar style={{width:100,height:100}} src={productCategory.thumbnailImage} />
          </Col>
          <Col flex={1} style={{marginLeft:15}}>
          <Title  style={{
          // fontSize: 16,
          whiteSpace: 'normal', // Ensures text wraps
                overflowWrap: 'break-word', // Breaks words to prevent overflow
          margin: 0
        }} level={3}>{productCategory.title}</Title>
          <Title  style={{
          // fontSize: 16,
          whiteSpace: 'normal', // Ensures text wraps
                overflowWrap: 'break-word', // Breaks words to prevent overflow
          margin: 0
        }} level={5} >
            {productCategory.subtitle}
          </Title>
          </Col>
         </Row>
          <Row style={{marginTop:20}} gutter={[20,20]}>
            <Col span={24}>
            {Banners.length?<Badge.Ribbon color='orange-inverse' placement='start' text={`${productCategory.title} latest updates`}>
          <Card style={{paddingTop:20}}>
              {Banners.map(i => {
                return <Col span={24}>
                  <Alert type='error' action={<Tag color='orange-inverse'>{dayjs(i.date).format('L')}</Tag>} icon={<NotificationOutlined />} showIcon message={<strong>{i.title}</strong>} description={<HtmlViewer content={i.description} />}  />
                </Col>
              })}
            </Card>
         </Badge.Ribbon>:null}
          </Col>
          </Row>
        </Col>
        <Col xs={24} md={24} sm={24} lg={0}>
          {TabInfoUpdates}
        </Col>
      </>}
         
<Col span={24}>
 <Row gutter={[30, 30]}>
          <Col xs={24} sm={24} md={24} lg={16} >
            {loadingProductCategory ?
              <Skeleton style={{ marginBottom: 30 }} active paragraph={{ rows: 1 }} /> : null}
            <Card style={{paddingTop:0,minHeight:400}}>

            <Row>
              {(productCategory.landingPage?.promoVideo?.url) ? (
                <Col span={24}>
                  <MediaPlayer thumbnail={productCategory.landingPage.promoVideo.thumbnailImage}
                      height={400}
                      url={productCategory.landingPage.promoVideo.url}
                    />
                                 <Divider/>
   </Col>
              ) : null}
                <Col span={24}>
                  
                {loadingProductCategory ? <Row>
                  <Col span={24}>
                  {/* <Skeleton active paragraph={{ rows: 1 }} /> */}
                  <SkeletonImage active style={{flex: 1,height:400}} />
                  <Skeleton active paragraph={{ rows: 20 }} />
                  </Col>
                </Row>:
                  <Tabs items={TABS} />
}
                </Col>
                <Col span={24}>

                </Col>
            </Row>
          
              
            </Card>
            
 </Col>
          <Col xs={0} sm={0} md={0} lg={8}>
          {TabInfoUpdates}
          </Col>
          <Col lg={24} md={24} sm={24} xs={24}>
          <Card title='Important Links'>
          <Row>
            <Col span={24}>
                  <Tabs activeKey={productCategory?.info?.links[0]?.title} tabPosition={isMobile ? 'top' : 'left'}
                    items={productCategory.info.links.map(link => {
                return {
                  label: link.title,
                  key:link.title,
                  children:<HtmlViewer content={link.description} />
                }
              })} />
            </Col>
          </Row>
       </Card>
          </Col>
         {(productCategory?.info?.faqs?.length)? <Col lg={24} md={24} sm={24} xs={24}>
            <Card title='FAQs'>
            {productCategory.info.faqs.map(faq => {
              return <Collapse expandIconPosition='end' ghost style={{marginTop:10}} items={[
                {
                  label: faq.title,
                  children: <Paragraph>{faq.description}</Paragraph>
          }
        ]} />
            })}
              
          </Card>
          </Col>:null}
        </Row>
      </Col>
    </Row>
  )
}


const ProductCategoryCard = ({ productCategoryId,children}: { productCategoryId: string,children?:React.ReactNode}) => {
  const product = { type: 'productCategory', id: productCategoryId };
  const { data: productCategory, isLoading: loadingProductCategory } = Learner.Queries.useGetProductCategoryDetails(productCategoryId + '');
  const { isMobile,isDesktop, isTablet } = useBreakpoint();
  const isLoading = loadingProductCategory;
  return   <> {isLoading ?
  <>
    <Row gutter={[20, 10]}>
          <Col span={24}>
        <SkeletonImage style={{flex: 1,height: 200}}  />
      </Col>
      <Col span={24}>
        <Skeleton active paragraph={{ rows: 6 }} />
        </Col>
        <Col span={24}>
        <Skeleton.Button size='large' active block />
        </Col>
    </Row>
  </>:<>    <Row gutter={[20, 40]} align="stretch">
    {/* <Col span={24}>
      <Image
        width={'100%'}
        height={200}
        preview={false}
        src={productCategory.thumbnailImage}
      />
    </Col> */}
    <Col span={24}>
        <Row gutter={[10, 10]}>
              <Col span={24}>
                {children}
          </Col>

        </Row>
      </Col>
    {/* {isEnrolled ? (
      <Col span={24}>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Button type="primary" block>
              Join ProductCategory
            </Button>
          </Col>
        </Row>
      </Col>
    ) : (
      <Col span={24}>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <ProductCategoryMetadata productCategory={productCategory} />
          </Col>
          <Col span={24}>
            <ProductCheckoutButton
              product={{ type: 'productCategory', id: productCategoryId + '' }}
              block
              type="primary"
            >
              Buy Now
            </ProductCheckoutButton>
          </Col>
        </Row>
      </Col>
    )} */}
  </Row></> }

</>
}