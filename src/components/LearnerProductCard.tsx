import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import Image from "next/image";
import {
  Constants,
  Enum,
  Learner,
  Types,
  User,
  Utils,
} from "@adewaskar/lms-common";
import { Text, Title } from "./Typography/Typography";
import MiniCard from "@Screens/post-authentication/Learner/Screens/StoreScreen/Cards/MiniCard";
import styled from "@emotion/styled";
import {
  BookOutlined,
  BookTwoTone,
  EditOutlined,
  ExportOutlined,
  FileTextTwoTone,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useModal } from "./ActionModal/ModalContext";
import ShowSyllabus from "./ShowSyllabus";
import { Link, useNavigate } from "@Router/index";
import { useMemo, useRef } from "react";
import { capitalize } from "lodash";

const CustomTag = styled(Text)`
  margin-top: 3px;
  font-size: 13px;
`;

interface LearnerProductCardPropsI {
  product: Types.Product;
  isTrial?: boolean;
  children?: React.ReactNode;
  isServer?: boolean;
  actions?: React.ReactNode[];
  onClick?: Function;
  mini?: boolean;
  onTry?: Function;
}

const LearnerProductCard = (props: LearnerProductCardPropsI) => {
  const hasBadge = useRef(null);
  const navigate = useNavigate();
  const {
    product: { data: product },
  } = props;
  const linkPrefix = useMemo(() => {
    let prefix = "test";
    switch (props.product.type) {
      case "test": {
        prefix = "test";
        break;
      }
      case "package": {
        prefix = "test-series";
        break;
      }

      case "course": {
        prefix = "course";
        break;
      }
      default: {
        prefix = "test";
      }
    }
    return prefix;
  }, [props]);
  const isFree = product?.plan?.type === "free";

  const DemoButton = (
    <Button
      onClick={() => {
        navigate(
          `${props.isServer ? "" : "/app"}/${linkPrefix}/${product.slug || product._id
          }`
        );
        props.onTry && props.onTry();
      }}
      type="primary"
      danger
      size="small"
    >
      Try Demo Test
    </Button>
  );

  const TryNowButton = props.isTrial ? (
    DemoButton
  ) : (
    <Button
      onClick={() => {
        navigate(
          `${props.isServer ? "" : "/app"}/${linkPrefix}/${product.slug || product._id
          }`
        );
        props.onTry && props.onTry();
      }}
      type="primary"
      size="small"
      icon={<ExportOutlined />}
    >
      Try {isFree ? "for Free" : "Now"}
    </Button>
  );
  const { openModal } = useModal();
  const Component = props.mini ? (
    <MiniCard className={`${props.product.type}-product-card`}
      accessoryLeft={
        product.thumbnailImage ? (
          <Image
            alt={product.title}
            src={product.thumbnailImage}
            width={80}
            height={80}
            style={{ borderRadius: 4 }}
          />
        ) : null
      }
      footer={
        <>
          {product?.languages?.length ? (
            <Row justify={"space-between"} align={"middle"}>
              <Col>
                {/* {product?.topics?.length ? (
                  <>
                    <Button className="show-syllabus-button" type='dashed' icon={<BookOutlined />} onClick={() => {
                      openModal(<ShowSyllabus product={props.product} />, {
                        title: 'Test Syllabus'
                      })
                    }} size='small'>Show Syllabus</Button>
                  </>
                ) : null} */}
                {/* <Button
                  style={{ padding: 0, fontSize: 13 }}
                  type="link"
                // title={``}
                >
                  <FileTextTwoTone />
                  {product?.languages
                    .map(
                      (i) =>
                        Constants.LANGUAGES.find((l) => l.value === i)?.label
                    )
                    .join(", ")}
                </Button> */}
              </Col>
              <Divider type="vertical" />
              <Col>{TryNowButton}</Col>
            </Row>
          ) : null}
          {/* <Row justify={"space-between"}>
            <Col></Col>
            <Col>
              <Link
                to={
                  props.isServer
                    ? `/${linkPrefix}/${product._id}`
                    : `/app/${linkPrefix}/${product._id}`
                }
              >
                <Button type="primary" size="small" icon={<ExportOutlined />}>
                  Try Now
                </Button>
              </Link>
            </Col>
          </Row> */}
        </>
      }
    >
      <Title level={5} style={{ fontSize: 13, marginTop: hasBadge.current ? 15 : 0 }}>
        <Row justify={"space-between"}>
          <Col>
            <Text style={{ marginRight: 5 }}>{product.title}</Text>
            {product?.input?.type === "handwritten" ? (
              <Tag
                // style={{ margin: 5 }}
                icon={<EditOutlined />}
                color="orange-inverse"
              >
                Handwritten
              </Tag>
            ) : null}
          </Col>
          {/* {product?.languages?.length ? (
            <Col>
              <Tooltip
                title={`Language: ${product?.languages
                  .map(
                    (i) => Constants.LANGUAGES.find((l) => l.value === i)?.label
                  )
                  .join(", ")}`}
              >
                <InfoCircleTwoTone />
              </Tooltip>
            </Col>
          ) : null} */}
        </Row>
      </Title>
      {/* <Row>
        <Col span={24}>
          {product?.featured?.enabled ? (
            <Tag color="purple-inverse">Featured</Tag>
          ) : null}
        </Col>
      </Row> */}
      {props.children}
      {product.duration ||
        product?.stats?.score?.total ||
        product?.languages?.length ||
        product?.products?.test ||
        product?.question?.count ? (
        <Divider style={{ margin: "10px 0" }} />
      ) : null}

      {/* {product?.duration?.enabled ? ( */}
      {(product?.duration?.value) ? <CustomTag color="blue-inverse">
        <strong>{formatTime(product.duration.value)}</strong>
        <Divider type="vertical" />
      </CustomTag> : null}
      {/* ) : null} */}
      {product?.stats?.score?.total ? (
        <CustomTag color="orange">
          {product.stats.score.total} marks
          <Divider type="vertical" />
        </CustomTag>
      ) : null}
      {product?.products?.test ? (
        <Row justify={"space-between"}>
          <Col>
            <CustomTag color="purple">
              {Object.keys(product?.products).map(key => {
                return `${product?.products[key].length} ${capitalize(key)}s`
              })}
            </CustomTag>
          </Col>
          <Col>{TryNowButton}</Col>
        </Row>
      ) : null}

      {product?.stats?.question?.count ? (
        <CustomTag color="red">
          {product.stats.question.count} Questions
          {/* <Divider type="vertical" /> */}
        </CustomTag>
      ) : null}
    </MiniCard>
  ) : (
    <Card
      className={`${props.product.type}-product-card`}
      onClick={() => props.onClick && props.onClick()}
      // hoverable
      bodyStyle={{ padding: "20px 10px" }}
      // cover={
      //   <AppImage
      //     placeholder
      //     height={120}
      //     alt="example"
      //     src={product.thumbnailImage}
      //   />
      // }
      actions={props.actions}
    >
      <Card.Meta
        description={props.children}
        title={<Text>{product.title}</Text>}
      />
    </Card>
  );
  if (props.isTrial) {
    hasBadge.current = true;
    return (
      <div style={{ paddingLeft: 10 }} className={`${props.product.type}-product-card`}>
        <Badge.Ribbon color="red" placement="start" text="Free Demo">
          {Component}
        </Badge.Ribbon>
      </div>
    );
  }
  if (product?.featured?.enabled) {
    hasBadge.current = true;
    return (
      <div style={{ paddingLeft: 10 }} className={`${props.product.type}-product-card`}>
        <Badge.Ribbon
          color="purple"
          placement="start"
          text={
            <>
              <ThunderboltFilled /> Featured
            </>
          }
        >
          {Component}
        </Badge.Ribbon>
      </div>
    );
  } else {
    hasBadge.current = false;
    return Component;
  }
};

export default LearnerProductCard;


function formatTime(minutes: number) {
  if (minutes < 120) {
    return minutes;
  }
  const seconds = 60 * minutes;
  if (seconds < 3600) {
    return "< 1hr";
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours}hr+`;
  }
}