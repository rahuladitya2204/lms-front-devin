import { Alert, Avatar, Badge, Button, Card, Col, Collapse, Divider, List, Row, Skeleton, Space, Tag, Tooltip, message } from 'antd'
import { CalendarOutlined, InfoCircleFilled, InfoOutlined, NotificationOutlined, ThunderboltFilled, WalletOutlined, WalletTwoTone } from '@ant-design/icons'
import { Constants, Enum, Learner, Store, Types, User, Utils } from '@invinciblezealorg/lms-common'
import { Fragment, useMemo } from 'react'
import Icon, { HomeOutlined } from '@ant-design/icons';
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
import Tabs from '@Components/Tabs';
// import Tabs from '@Components/Tabs'
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
  const { isMobile,width } = useBreakpoint();
  const { data: productCategory, isLoading: loadingProductCategory } = Learner.Queries.useGetProductCategoryDetails(productCategoryId + '');
  const { data: packages, isFetching: loading } = Learner.Queries.useGetPackages(productCategory._id, {
    enabled: !!productCategory._id
  })
  const TABS = useMemo(() => {
    const i=[
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
    // if (packages.length) {
    //   i.push({
    //     label: `Test Series(${packages.length})`,
    //     key: 'tests',
    //     children: <Row gutter={[20,20]}>
    //       {packages.map(bundle => {
    //        return  <Col   sm={12} 
    //        md={8} xs={24}
    //          lg={8} xl={6} xxl={6}  >
    //          <PackageCard package={bundle} />
    //        </Col>
    //      })}
    //     </Row>
    //   })
    // }

    i.push(  ...productCategory.info.links.map(link => {
      return {
      label: link.title,
      key:link.title.split(' ').join(''),
      children:<HtmlViewer content={link.description} />
      }
    }))
    
    return i;
   },[packages,productCategory])
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
  // const TabInfoUpdates = <Card style={{minHeight:'auto'}}>
  //   <Tabs items={[
  //     {
  //       label: 'More Info',
  //       key: 'info',
  //       children: <ProductCategoryCard productCategoryId={productCategoryId + ''}>
  //         {productCategory.info?Metadata:null}
  //       </ProductCategoryCard>
  //     },
  //     {
  //       label: 'Latest Updates',
  //       key: 'latest-updates',
  //       children: <Row gutter={[20, 20]}>
  //         {productCategory.info.updates.map(item => {
  //         return <Col span={24}>
  //           <Alert action={<Row>
  //             <Col><Tag>{dayjs(item.date).format('L')}</Tag></Col>
  //             <Col>
  //               <Tooltip color='#fff' placement='left' title={<HtmlViewer content={item.description} /> }>
  //                 <InfoCircleFilled />
  //             </Tooltip></Col>
  //           </Row>} icon={<NotificationOutlined/>} showIcon message={item.title} />
  //         </Col>
  //       })}
  //       </Row>
  //     }
  //   ]} />
  // </Card>;
  const Banners = productCategory.info.updates.filter(i => i.displayAsBanner);
  return (
    <Row gutter={[20, 10]}>
    {loadingProductCategory ? null : <>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Row justify={'space-between'} align={'middle'}>
            <Col sm={isMobile?24:18} xs={24}>
            <Row align={'middle'}>
          <Col style={{margin:isMobile?'auto':0,marginBottom:isMobile?15:'auto'}}>
            <Avatar style={{width:100,height:100}} src={productCategory.thumbnailImage} />
          </Col>
          <Col flex={1} style={{marginLeft:15}}>
          <Title  style={{
          // fontSize: 16,
          whiteSpace: 'normal', // Ensures text wraps
                overflowWrap: 'break-word', // Breaks words to prevent overflow
          margin: 0,
          textAlign: isMobile ?'center':'left'
                  }} level={3}>{productCategory.title}{isMobile?<span>(<ThunderboltFilled style={{ color: 'goldenrod', fontSize: 25 }} />Upcoming)</span>:null}</Title>
          <Title  style={{
          // fontSize: 16,
          whiteSpace: 'normal', // Ensures text wraps
                overflowWrap: 'break-word', // Breaks words to prevent overflow
                    margin: isMobile ? 10 : 0,
                    textAlign: isMobile ?'center':'left'
        }} level={5} >
            {productCategory.subtitle}
              </Title>
              
            </Col>
          </Row>
            </Col>
          {productCategory.info.isUpcoming && !isMobile?  <Col style={{display:'flex',flexDirection:'row-reverse'}} sm={6}>
              <Row align={'middle'}>
                <Col>
                  <ThunderboltFilled style={{ color: 'goldenrod', fontSize: 30,marginRight: 5 }} />
                </Col><Col>
                  <Text style={{fontSize:22}} strong>Upcoming</Text>
                </Col>
              </Row>
            </Col>:null}
          </Row>
          <Row>
          <Col span={24} style={{marginTop:20}}>
              <Card>
                {Metadata}
            </Card>
            </Col>
          </Row>
          <Row style={{marginTop:20}} gutter={[20,20]}>
            <Col span={24}>
            {Banners.length?<Badge.Ribbon color='orange-inverse' placement='start' text={productCategory.title?`${productCategory.title} latest updates`:null}>
          <Card style={{paddingTop:20}}>
              {Banners.map(i => {
                return <Col span={24}>
                  <Alert type='error' action={<Tag color='orange-inverse'>{dayjs(i.date).format('L')}</Tag>} icon={<NotificationOutlined />} message={<strong>{i.title}</strong>} description={<HtmlViewer content={i.description} />}  />
                </Col>
              })}
            </Card>
         </Badge.Ribbon>:null}
          </Col>
          </Row>
        </Col>
      </>}
         
<Col span={24}>
        <Row gutter={[30, 30]}>
        {packages.length?<Col span={24}>
                        <Card title='Try our test series!'>
                        <Row gutter={[20,20]}>
                          {packages.map(bundle => {
                          return <Col   sm={12} 
                          md={8} xs={24}
                            lg={8} xl={6} xxl={6}  >
                            <PackageCard package={bundle} />
                          </Col>
                        })}
                        </Row>
                        </Card>
                      </Col>:null}
          <Col xs={24} sm={24} md={24} lg={24} >
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
                    <Row>
                      {/* <Col span={24}>
                        <Card title='Try our test series!'>
                        <Row gutter={[20,20]}>
                          {packages.map(bundle => {
                          return <Col   sm={12} 
                          md={8} xs={24}
                            lg={8} xl={6} xxl={6}  >
                            <PackageCard package={bundle} />
                          </Col>
                        })}
                        </Row>
                        </Card>
                      </Col> */}
                      <Col span={24}>
                        {/* {width}px */}
                        {TABS.length?<Tabs
                          style={{ width: isMobile ? (width - width*0.3) : 'auto' }}
                          navigateWithHash
                          tabPosition={isMobile ? 'top' : 'left'} 
                          items={TABS} />:null}
</Col></Row>}
                </Col>
                <Col span={24}>

                </Col>
            </Row>
          
              
            </Card>
            
 </Col>
         {(productCategory?.info?.faqs?.length)? <Col lg={24} md={24} sm={24} xs={24}>
            <Card title='FAQs'>
            {productCategory.info.faqs.map(faq => {
              return <Collapse expandIconPosition='end' style={{marginTop:10}} items={[
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