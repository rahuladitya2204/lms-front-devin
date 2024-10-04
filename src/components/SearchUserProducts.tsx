import { Enum, User } from "@adewaskar/lms-common";
import { Image, Select } from "antd";

import { Typography } from "./Typography";
import { useState } from "react";

const { Text } = Typography;
interface SearchUserProductsPropsI {
  onSelect: any;
  type: Enum.ProductType;
  category: string;
  label?: React.ReactNode | string;
}

export default function SearchUserProducts(props: SearchUserProductsPropsI) {
  const { data: products } = User.Queries.useGetProductList(props.type, {
    category: props.category,
    status: ["live"],
  });

  const filterOption = (inputValue: string, option: any) => {
    return option.label.props.children[2]
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  };

  return (
    <Select
      showSearch
      filterOption={filterOption}
      placeholder={props.label || "Select to add product"}
      style={{ width: 300, marginBottom: 20 }}
      onSelect={props.onSelect}
      options={products.map((e) => ({
        label: (
          <Text>
            <Image
              preview={false}
              style={{ width: 50, height: 50 }}
              src={e.thumbnailImage}
            />{" "}
            {e.title}
          </Text>
        ),
        value: e._id,
      }))}
    />
  );
}
