// @ts-nocheck

import React from "react";
import { Typography } from "@Components/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Card, Empty } from "antd";
import { useOutletContext } from "react-router";
import { htmlToText } from "html-to-text";

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = (props) => {
  const [, , language] = useOutletContext();
  const description = props.item?.description?.text[language];
  return (
    <Card
      bodyStyle={{ minHeight: 500 }}
      title={props?.item?.title?.text[language]}
    >
      {htmlToText(description) ? <HtmlViewer
        // customStyles={`.html-viewer ul {padding:0;} .html-viewer .ant-list-item {padding:0;}`}
        content={description} /> : <Empty style={{ marginTop: 135 }} description='No Content Added' />}
    </Card>
  );
};

export default CoursePlayerTextItem;
