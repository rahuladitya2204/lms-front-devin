import { Button, Modal, Space, Spin } from "@Lib/index";
import { Common, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import { getVideoThumbnails } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useParams } from "@Router/index";
import { useState } from "react";

interface SelectThumbnailPropsI {
  fileId?: string;
  url?: string;
  onSelect: (file: Types.FileType) => void;
}

const { confirm } = Modal;

const SelectThumbnail = (props: SelectThumbnailPropsI) => {
  const [generating, setGenerating] = useState(false);
  const { url, fileId } = props;
  const { data: fileUrl } = Common.Queries.useGetPresignedUrlFromFile(
    fileId + "",
    {
      enabled: !!fileId,
    }
  );
  const { mutate: uploadFiles, isLoading: uploading } =
    Common.Queries.useUploadFiles();
  const Url = (fileUrl || url) + "";
  const { id: courseId, sectionId, itemId } = useParams();
  const [thumbnails, setThumbnails] = useState<{ url: string; file: File }[]>(
    []
  );

  const generateThumbnails = (url: string) => {
    setGenerating(true);
    getVideoThumbnails(url)
      .then((blobs) => {
        console.log(blobs, "blobs");
        const files = blobs.map((blob, index) => {
          return {
            file: new File([blob], `thumbnail-${index}.jpeg`, {
              type: "image/jpeg",
            }),
            url: URL.createObjectURL(blob),
          };
        });
        setThumbnails(files);
      })
      .catch(console.log)
      .finally(() => {
        setGenerating(false);
      });
    return () => {
      setThumbnails([]);
    };
  };
  const uploadThumbnail = (file: File) => {
    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: `You want to set this as thumbnail`,
      onOk() {
        uploadFiles({
          files: [
            {
              file: file,
              prefixKey: `courses/${courseId}/${sectionId}/${itemId}/lecture/thumbnail`,
              source: {
                type: "course.section.item.file",
                value: courseId + "",
              },
            },
          ],
          onUploadProgress: (e) => {
            // console.log(e, 'e')
          },
          onSuccess: ([uploadFile]) => {
            props.onSelect(uploadFile);
          },
        });
      },
      okText: "Set as thumbnail",
    });
  };

  const spinText = generating
    ? "Generating Thumbnails.."
    : uploading
    ? "Uploading Thumbnail.."
    : null;
  return Url ? (
    <>
      <Button
        size="small"
        loading={generating}
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => generateThumbnails(Url)}
      >
        Generate Thumbnails
      </Button>
      <Spin spinning={uploading} tip={spinText}>
        <Space size={[10, 20]}>
          {thumbnails.map(({ file, url }) => {
            return (
              <Space direction="vertical">
                <Image preview width={200} height={100} src={url} />
                <Button size="small" onClick={() => uploadThumbnail(file)}>
                  Select as thumbnail
                </Button>
              </Space>
            );
          })}
        </Space>
      </Spin>
    </>
  ) : null;
};

export default SelectThumbnail;
