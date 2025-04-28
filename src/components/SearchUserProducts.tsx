import { Enum, Learner, User } from "@adewaskar/lms-common";
import { Col, Empty, Form, Image, Input, Row, Select } from "antd";

import { Typography } from "./Typography";
import { useState } from "react";
import PackageCard from "@Screens/post-authentication/Learner/Screens/StoreScreen/Cards/PackageCard";
import { Title } from "./Typography/Typography";

const { Text } = Typography;
interface SearchUserProductsPropsI {
  onSelect: any;
  type: Enum.ProductType;
  category: string;
  width?: string;
  height?: string;
  placeholder?: string;
  label?: React.ReactNode | string;
}

export default function SearchUserProducts(props: SearchUserProductsPropsI) {
  const [text, setText] = useState('')
  const { data: products, isFetching: isLoading } = Learner.Queries.useGetProductList({
    category: props.category,
    searchValue: text
  }, {
    enabled: !!text
  });

  return (
    <Row>
      <Col span={24}>
        <Form layout='vertical'> <Form.Item label={<Title level={3}>100+ exams covered. Which one are you preparing for?</Title>}>
          <Input.Search size='large'
            loading={isLoading}
            value={text}
            onChange={e => setText(e.target.value)}
            // filterOption={filterOption}
            placeholder={props.placeholder || "Select to add product"}
            style={{ width: props.width || 300, height: props.height || '', marginBottom: 20 }}
          />
        </Form.Item></Form>
      </Col>
      {(text && (products.courses.length || products.bundles.length)) ? <Col span={24}>
        <Row>
          <Col span={24}>
            <Title level={4}>
              Found {products.bundles.length} bundles for "{text}"
            </Title>
            <Row gutter={[20, 20]}>
              {products.bundles.map(bundle => {
                return <Col span={8}>
                  <PackageCard mini package={bundle} />
                </Col>
              })}
            </Row>
          </Col>
        </Row>
      </Col> : (text && !isLoading ?
        <Row align='middle' justify={'center'}>
          <Col><Empty description={`Nothing found for "${text}"`} /></Col>
        </Row>
        : null)}
    </Row>
  );
}
