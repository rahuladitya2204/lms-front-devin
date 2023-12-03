import { Col, Collapse, List, Row, Skeleton, Tag } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import LearnerProductCard from '@Components/LearnerProductCard'
import PackageProductsItem from './CurriculumItem'
import ProductCard from '@Components/UserProductCard'
import { capitalize } from 'lodash'

const { Panel } = Collapse

interface PackageProductsPropsI {
  package: Types.Package;
}

function PackageProducts(props: PackageProductsPropsI) {
  const packageId = props.package._id
  const {
    data: bundle,
    isFetching: loadingPackage
  } = Learner.Queries.useGetPackageDetails(packageId, {
    enabled: !!packageId
  })
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        {loadingPackage ? (
          <Skeleton active paragraph={{ rows: 20 }} />
        ) : (
          <Collapse
          // defaultActiveKey={bundle.sections.map((s, i) => i)}
          >
            {Object.keys(bundle.products)
              // @ts-ignore
              .filter(i => bundle.products[i].length)
              .map(key => {
                const productTitle = capitalize(key)
                // @ts-ignore
                const products = bundle.products[key]
                console.log(products, '12')
                return (
                  <Panel header={productTitle} key={key}>
                    <Row gutter={[20, 30]}>
                      {products.map((item: string) => (
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <LearnerProductCard product={{ id: item, type: key }} />
                        </Col>
                      ))}
                    </Row>
                  </Panel>
                )
              })}
          </Collapse>
        )
        // null
        }
      </Col>
    </Row>
  )
}

export default PackageProducts
