import { Row, Col, Divider } from "antd";
import { ThunderboltFilled, ClockCircleOutlined } from "@ant-design/icons";
import { Typography as ANTDTypography } from "antd";
import Title from "antd/es/typography/Title";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import AppImage from "next/image";

const { Text } = Typography;

const ProductDetailRow = ({
    productCategory,
    isMobile,
    isDesktop
}) => {
    // Add null check for productCategory
    if (!productCategory) {
        return null;
    }

    return (
        <Row justify="space-between" align="middle">
            <Col lg={21}>
                <Row>
                    <Col
                        style={{
                            margin: isMobile ? "auto" : 0,
                            marginBottom: isMobile ? 15 : "auto",
                        }}
                        lg={3}
                    >
                        {productCategory.thumbnailImage && (
                            <AppImage
                                alt={productCategory.title || 'Product Image'}
                                width={100}
                                height={100}
                                style={{ borderRadius: "50%" }}
                                src={productCategory.thumbnailImage}
                            />
                        )}
                    </Col>
                    <Col lg={18} style={{ display: "flex", alignItems: "center" }}>
                        <Row>
                            <Col span={24}>
                                <Title
                                    style={{
                                        whiteSpace: "normal",
                                        overflowWrap: "break-word",
                                        margin: 0,
                                        textAlign: isMobile ? "center" : "left",
                                        fontSize: isMobile ? 18 : 25,
                                    }}
                                    level={5}
                                >
                                    {productCategory.subtitle}
                                    {isMobile && productCategory.info?.isUpcoming && (
                                        <span>
                                            (
                                            <ThunderboltFilled
                                                style={{ color: "goldenrod", fontSize: 25 }}
                                            />
                                            Upcoming)
                                        </span>
                                    )}
                                </Title>
                            </Col>
                            <Col span={24}>
                                <div suppressHydrationWarning>
                                    <Text
                                        style={{
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            margin: isMobile ? "auto" : 0,
                                            textAlign: isMobile ? "center" : "left",
                                            display: "block",
                                        }}
                                    >
                                        {/* <ClockCircleOutlined /> Last Updated on{" "} */}
                                        {productCategory.updatedAt && dayjs(productCategory.updatedAt).format("LL")}
                                        {isDesktop && (
                                            <>
                                                <Divider type="vertical" />{" "}
                                                <ANTDTypography.Link>
                                                    Authored by Rahul Sharma
                                                </ANTDTypography.Link>
                                            </>
                                        )}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            {productCategory.info?.isUpcoming && !isMobile && (
                <Col
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                    lg={3}
                >
                    <Row align="middle">
                        <Col>
                            <ThunderboltFilled
                                style={{
                                    color: "goldenrod",
                                    fontSize: 30,
                                    marginRight: 5,
                                }}
                            />
                        </Col>
                        <Col>
                            <Text style={{ fontSize: 22 }}>Upcoming</Text>
                        </Col>
                    </Row>
                </Col>
            )}
        </Row>
    );
};

export default ProductDetailRow;