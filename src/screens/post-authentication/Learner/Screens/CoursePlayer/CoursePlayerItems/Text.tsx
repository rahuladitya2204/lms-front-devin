// @ts-nocheck

import React from "react";
import { Typography } from "@Components/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Card } from "antd";
import { useOutletContext } from "react-router";

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = (props) => {
  const [, , language] = useOutletContext();
  return (
    <Card
      // bodyStyle={{ minHeight: 500, overflowY: "scroll" }}
      title={props?.item?.title?.text[language]}
    >
      <HtmlViewer content={props.item?.description?.text[language]} />
    </Card>
  );
};

export default CoursePlayerTextItem;
