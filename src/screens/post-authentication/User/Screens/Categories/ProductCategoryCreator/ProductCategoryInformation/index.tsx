import { Button, Card, Col, Form, Row, Spin } from 'antd'
import { Constants, Types } from '@invinciblezealorg/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import ProductCategoryDetailsEditor from './ProductCategoryDetailsEditor/ProductCategoryDetails'
import ProductCategoryFAQs from './ProductCategoryFAQs'
import ProductCategoryLandingPage from './ProductCategoryLandingPage'
import ProductCategoryLinks from './ProductCategoryLinks'
import ProductCategoryNotifications from './ProductCategoryNotifications'
import Tabs from '@Components/Tabs'
import { User } from '@invinciblezealorg/lms-common'
import useMessage from '@Hooks/useMessage'

function ProductCategoryInformationEditor(props: any) {
  const { id } = useParams()
  const testId = id + ''
  const [test, setProductCategory] = useState(Constants.INITIAL_TEST_DETAILS)

  const {
    data: testDetails,
    isFetching: loadingProductCategory
  } = User.Queries.useGetProductCategoryDetails(testId, {
    enabled: !!testId
  })

  const form = Form.useForm()
  return (
    <Spin spinning={loadingProductCategory}>
      <Tabs
        // navigateWithHash
        destroyInactiveTabPane={false}
        items={[
          {
            label: `Details`,
            active: true,
            key: 'details',
            children: (
              <ProductCategoryDetailsEditor
                saveProductCategory={props.saveProductCategory}
                productCategory={props.test}
                testId={props.testId}
              />
            )
          },
          {
            label: `Landing Page`,
            key: 'landing-page',
            children: <ProductCategoryLandingPage />
          },
          {
            label: `FAQs`,
            key: 'faqs',
            children: <ProductCategoryFAQs />
          },
          {
            label: `Notifications`,
            key: 'notifs',
            children: <ProductCategoryNotifications />
          },
          {
            label: `Important Links`,
            key: 'links',
            children: <ProductCategoryLinks />
          }
          // {
          //   label: `Advanced`,
          //   key: 'advanced',
          //   children: (
          //     <ProductCategoryAdvancedSettings
          //       saveProductCategory={props.saveProductCategory}
          //       test={props.test}
          //       testId={props.testId}
          //     />
          //   )
          // }
        ]}
      />

      <Outlet />
    </Spin>
  )
}

export default ProductCategoryInformationEditor
