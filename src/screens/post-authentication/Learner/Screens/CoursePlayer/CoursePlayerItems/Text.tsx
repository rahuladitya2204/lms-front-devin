// @ts-nocheck

import React from "react";
import { Typography } from "@Components/Typography";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Card, Empty, message, Modal, Spin } from "antd";
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
  const { mutate: deleteHighlight, isLoading: deletingHighlight } = Learner.Queries.useDeleteHighlight(courseId, itemId)
  return (
    <Card
      bodyStyle={{ minHeight: 500 }}
      title={props?.item?.title?.text[language]}
    >
      <Spin tip='Deleting Highlight..' spinning={deletingHighlight}>
        {htmlToText(description) ?
          <SelectableContent courseId={courseId} itemId={itemId}>
            <HtmlViewer onHighlightClick={e => {
              Modal.confirm({
                closable: false,
                confirmLoading: deletingHighlight,
                title: `Delete Highlight?`,
                // icon: <ExclamationCircleOutlined />,
                content: `Are you sure you want to delete this highlight?`,
                // footer: [

                // ],
                onOk() {
                  deleteHighlight({
                    highlightId: e._id
                  }, {
                    onSuccess: () => {
                      message.success('Highlight Deleted Successfully')
                    }
                  })
                },
                okText: "Delete Highlight",
              });
            }} highlights={highlights}
              // protected
              customStyles={`
        .html-viewer div.ant-typography, .html-viewer li.ant-list-item {
        font-size: 15px;
        }

        .html-viewer figure img {
         width: 80% !important;
        }
        `}
              content={description} />
          </SelectableContent>
          : <Empty style={{ marginTop: 135 }} description='No Content Added' />}
      </Spin>
    </Card>
  );
};

export default CoursePlayerTextItem;
