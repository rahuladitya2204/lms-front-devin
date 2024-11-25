// @ts-nocheck

import React from "react";
import { Typography } from "@Components/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Card, Empty, message } from "antd";
import { useOutletContext, useParams } from "react-router";
import { htmlToText } from "html-to-text";
import SelectableContent from "@Components/SelectableContent/SelectableContent";
import { Learner, Types } from "@adewaskar/lms-common";

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = (props) => {
  const [, , language] = useOutletContext();
  const description = props.item?.description?.text[language];
  const { id: courseId, itemId } = useParams();
  const { data: highlights } = Learner.Queries.useGetCourseHighlights(courseId, itemId)
  const { mutate: createCourseHighlight } = Learner.Queries.useCreateHighlight(courseId, itemId);
  const onSaveHighlight = (data: Types.CourseHighlight) => {
    data.item = itemId
    createCourseHighlight({
      data: data
    }, {
      onSuccess(data) {
        message.success('Highlight Created')
      },
    })
  }
  return (
    <Card
      bodyStyle={{ minHeight: 500 }}
      title={props?.item?.title?.text[language]}
    >

      {htmlToText(description) ?
        <SelectableContent onSaveHighlight={onSaveHighlight}>
          <HtmlViewer highlights={highlights}
            // protected
            customStyles={`
        .html-viewer div.ant-typography {
        font-size: 16px;
        }

        .html-viewer figure img {
         width: 80% !important;
        }
        `}
            content={description} />
        </SelectableContent>
        : <Empty style={{ marginTop: 135 }} description='No Content Added' />}
    </Card>
  );
};

export default CoursePlayerTextItem;
