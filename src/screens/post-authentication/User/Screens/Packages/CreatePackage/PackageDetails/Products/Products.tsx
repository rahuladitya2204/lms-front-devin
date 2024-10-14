import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  FormListFieldData,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Enum, Types, User } from "@adewaskar/lms-common";
import { Fragment, useCallback } from "react";

import ProductCard from "@Components/UserProductCard";
import SearchUserProducts from "@Components/SearchUserProducts";
import { capitalize } from "lodash";

const PRODUCT_TYPES = [
  { title: "Test", value: Enum.ProductType.TEST },
  { title: "Events", value: Enum.ProductType.EVENT },
  { title: "Courses", value: Enum.ProductType.COURSE },
];
interface ProductsProps {
  category: string;
  // products: Types.Product[];
  // deleteItem: (index: number) => void;
  // submit: (index: number, d: { type: string, data: any }) => void;
}

export default function Products({ category }: ProductsProps) {
  return (
    <Fragment>
      <Collapse
        collapsible="header"
        defaultActiveKey={["1"]}
        items={PRODUCT_TYPES.map((product) => {
          const name = product.value;
          return {
            key: name,
            label: capitalize(name),
            children: (
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Form.List name={["products", name]}>
                    {(fields, { add, remove }) => {
                      return (
                        <ProductSection
                          category={category}
                          add={add}
                          remove={remove}
                          fields={fields}
                          productType={product.value}
                          name={name}
                        />
                      );
                    }}
                  </Form.List>
                </Col>
              </Row>
            ),
          };
        })}
      />
    </Fragment>
  );
}

interface ProductSectionPropsI {
  productType: Enum.ProductType;
  category: string;
  fields: FormListFieldData[];
  add: any;
  remove: any;
  name: string;
}

export const ProductSection = (props: ProductSectionPropsI) => {
  const form = Form.useFormInstance();
  return (
    <Fragment>
      <Row>
        <Col span={24}>
          <SearchUserProducts
            category={props.category}
            // @ts-ignore
            onSelect={(e) => props.add({ item: e, isTrial: false })}
            type={props.productType}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[20, 30]}>
            {props.fields.map((field, index) => {
              const fieldValue = form.getFieldValue([
                "products",
                props.name,
                field.name,
              ]);
              const itemId = fieldValue.item;
              return (
                <Col span={6}>
                  <ProductCard
                    // type={product.value}
                    product={{
                      type: props.productType,
                      id: itemId,
                    }}
                    actions={[
                      <Form.Item
                        name={[field.name, "isTrial"]}
                        valuePropName="checked"
                      >
                        <Checkbox>Is Trial</Checkbox>
                      </Form.Item>,
                      <Button
                        size="small"
                        onClick={() => props.remove(index)}
                        icon={<DeleteOutlined />}
                      >
                        {/* Delete */}
                      </Button>,
                    ]}
                  />
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};
