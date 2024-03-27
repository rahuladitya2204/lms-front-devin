import { Avatar, Card, Col, Row } from "antd";
import { RightOutlined, ThunderboltFilled } from "@ant-design/icons";
import { Types } from "@adewaskar/lms-common";
import Link from "next/link";

interface ProductCategoryCardPropsI {
  productCategory: Types.ProductCategory;
}

function ProductCategoryCard(props: ProductCategoryCardPropsI) {
  const { productCategory } = props;
  const CardComponent = (
    <Link href={`../category/${productCategory._id}`}>
      <Card
        hoverable
        style={{ display: "flex", alignItems: "center" }}
        bodyStyle={{ padding: 0, width: "100%" }}
      >
        <Row gutter={[20, 20]} justify={"space-between"} align={"middle"}>
          <Col>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt="example"
                src={productCategory.thumbnailImage}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "10px",
                }}
              />
              <p style={{ margin: 0, paddingLeft: "10px", fontWeight: "bold" }}>
                {productCategory.info.isUpcoming ? (
                  <ThunderboltFilled
                    style={{ color: "goldenrod", marginRight: 5 }}
                  />
                ) : null}
                {productCategory.title}
              </p>
            </div>
          </Col>
          <Col style={{ marginRight: 10 }}>
            <RightOutlined />
          </Col>
        </Row>
      </Card>
    </Link>
  );
  return CardComponent;
}

export default ProductCategoryCard;
