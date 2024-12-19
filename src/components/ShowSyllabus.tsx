import { Learner, Types, User, Utils } from "@adewaskar/lms-common";
import { Button, Col, List, Row, Skeleton, Tooltip } from "antd";
import { Text, Title } from "./Typography/Typography";
import { useModal } from "./ActionModal/ModalContext";
import { BookTwoTone } from "@ant-design/icons";
import { capitalize } from "lodash";

interface ShowSyllabusPropsI {
  product: Types.Product;
}

export default function ShowSyllabus(props: ShowSyllabusPropsI) {
  const { data: product, isLoading: loadingTest } =
    Learner.Queries.useGetProductDetail(props.product);
  const { data: treeData, isLoading: loadingTree } =
    Learner.Queries.useGetTopicTree(product.topics, 2);
  const language = product.languages.length < 2 ? product.languages[0] : 'eng'

  return <Row>
    <Col span={24}>
      <List loading={loadingTest || loadingTree}
        itemLayout="vertical"
        dataSource={treeData}
        renderItem={(item) => {
          return (
            <Col style={{ marginBottom: 8 }} span={24}>
              <Text>{item.title[language] || item.title['eng']}</Text>
            </Col>
          );
        }}
      />
    </Col>
  </Row>;
}
