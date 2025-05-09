import { AutoComplete, Avatar, Space } from "antd";
import { Learner, Types } from "@adewaskar/lms-common";

import Image from "./Image";
import Search from "antd/es/input/Search";
import { Title } from "./Typography/Typography";
import { Link, useNavigate } from "@Router/index";
import { useState } from "react";

export default function SearchLearnerCourses() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { data: seachedProducts, isFetching: loading } =
    Learner.Queries.useSearchProducts(
      {
        searchValue: text,
      },
      {
        enabled: !!text,
      }
    );
  const allProducts = Object.keys(seachedProducts)
    // @ts-ignore
    .map((k) => seachedProducts[k])
    .flat();
  const listItems = Object.keys(seachedProducts)
    .map((productType: string) => {
      // @ts-ignore
      const items = seachedProducts[productType];
      // @ts-ignore
      return items.map((c) => {
        return {
          label: (
            <Link to={`${productType}/${c._id}`}>
              <Space
                align="center"
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Avatar
                  shape="square"
                  style={{ background: "transparent" }}
                  size={45}
                  icon={<Image alt={c.title} src={c.thumbnailImage} />}
                />{" "}
                <Space direction="vertical" align="baseline">
                  <Title style={{ margin: 0 }} level={5}>
                    {c.title}
                  </Title>
                  {/* <Text style={{ margin: 0 }}>
                    Taught By: {user.name}
                  </Text> */}
                </Space>
              </Space>
            </Link>
          ),
          value: c.title,
        };
      });
    })
    .flat();
  return (
    <AutoComplete
      onChange={(e, a) => {
        const item = allProducts.find((o) => o.title === e);
        // console.log(item, 'item')
      }}
      popupClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      style={{ width: 300 }}
      options={listItems}
    >
      <Search
        placeholder="Search for tests.."
        allowClear
        value={text}
        loading={loading}
        onChange={(e: any) => setText(e.target.value)}
        onSearch={(e) => console.log(e, "eee")}
        style={{ width: 250 }}
      />
    </AutoComplete>
  );
}
