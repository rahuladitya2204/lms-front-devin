import { Col, Collapse, List, Row, Skeleton, Tag } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import PackageProductsItem from './CurriculumItem'
import ProductCard from '@Components/ProductCard'
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
                return (
                  <Panel header={productTitle} key={key}>
                    <List
                      itemLayout="horizontal"
                      dataSource={products}
                      renderItem={item => {
                        // @ts-ignore
                        return <ProductCard product={item} />
                      }}
                    />
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
