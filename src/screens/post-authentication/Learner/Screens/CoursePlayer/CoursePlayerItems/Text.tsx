// @ts-nocheck

import React from "react";
import { Typography } from "@Components/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Card } from "antd";

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = (props) => {
  return (
    <Card
      bodyStyle={{ minHeight: 500, overflowY: "scroll" }}
      title={props?.item?.title}
    >
      <HtmlViewer content={props.item?.description} />
    </Card>
  );
};

export default CoursePlayerTextItem;
