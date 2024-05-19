import { Col, Collapse, List, Row, Skeleton, Tag } from "@Lib/index";
import { Learner, Types } from "@adewaskar/lms-common";

import LearnerProductCard from "@Components/LearnerProductCard";
import PackageProductsItem from "./CurriculumItem";
import ProductCard from "@Components/UserProductCard";
import { Typography } from "@Components/Typography";
import { capitalize } from "lodash";

const { Panel } = Collapse;
const { Text } = Typography;
interface PackageProductsPropsI {
  package: Types.Package;
  isServer?: boolean;
}

function PackageProducts(props: PackageProductsPropsI) {
  const packageId = props.package.slug;
  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId, {
      enabled: !!packageId,
    });
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        {
          loadingPackage ? (
            <Skeleton active paragraph={{ rows: 20 }} />
          ) : (
            <Collapse
              // @ts-ignore
              defaultActiveKey={`test`}
            >
              {Object.keys(bundle.products)
                // @ts-ignore
                .filter((i) => bundle.products[i].length)
                .map((key) => {
                  const productTitle = capitalize(key);
                  // @ts-ignore
                  const products = bundle.products[key];
                  // console.log(products, "productsproducts");
                  return (
                    <Panel
                      extra={
                        <Text strong>
                          {/* @ts-ignore */}
                          {bundle.products[key].length} {capitalize(key)}s
                        </Text>
                      }
                      header={productTitle}
                      key={key}
                    >
                      <Row gutter={[20, 30]}>
                        {products.map((item: Types.Test) => (
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <LearnerProductCard
                              mini
                              onClick={() => {
                                // @ts-ignore
                                window.open(`/${key}/${item._id}`);
                              }}
                              product={{
                                id: item._id + "",
                                type: key,
                                data: item,
                              }}
                            >
                              {/* {item.duration.enabled ? (
                                <Tag
                                  style={{ fontSize: 12 }}
                                  color="blue-inverse"
                                >
                                  {item.duration.value} mins
                                </Tag>
                              ) : null}
                              {item?.stats?.score?.total ? (
                                <Tag
                                  style={{ fontSize: 12 }}
                                  color="orange-inverse"
                                >
                                  {item.stats.score.total} marks
                                </Tag>
                              ) : null}

                              {item?.stats?.question?.count ? (
                                <Tag
                                  style={{ fontSize: 12 }}
                                  color="red-inverse"
                                >
                                  {item.stats.question.count} Questions
                                </Tag>
                              ) : null} */}
                            </LearnerProductCard>
                          </Col>
                        ))}
                      </Row>
                    </Panel>
                  );
                })}
            </Collapse>
          )
          // null
        }
      </Col>
    </Row>
  );
}

export default PackageProducts;
