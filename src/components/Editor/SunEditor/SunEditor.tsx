import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import "katex/dist/katex.min.css";
import "./style.css";

import {
  AdvancedEditorOptions,
  BasicEditorOptions,
  IntermediateEditorOptions,
} from "./constant";
import { Button, Col, Form, Popconfirm, Row, Select, Spin, Tag } from "antd";
import { Common, Types, User } from "@adewaskar/lms-common";
import React, { Fragment, useEffect, useRef, useState } from "react";

import SunEditor from "suneditor-react";
import { uniqueId } from "lodash";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import ActionModal from "@Components/ActionModal/ActionModal";

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  uploadPrefixKey?: string;
  value?: string;
  mode?: string;
  readonly?: boolean;
  imageBase64?: boolean;
  onChange?: (d: string) => void;
  defaultValue?: string;
  level?: 1 | 2 | 3; // 1 = Minimal, 2 = Medium, 3 = High
}

const SunEditorComponent = (props: SunEditorPropsI) => {
  const level = props.level || 2;
  const form = Form.useFormInstance();
  const editorRef = useRef<any | null>();
  const { mutate: uploadFiles, isLoading: loading } =
    Common.Queries.useUploadFiles();

  // @ts-ignore
  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  let value = Form.useWatch(props.name + "", form);
  if (props.value) {
    value = props.value;
  }
  const previousValue = useRef<string | null | undefined>(props.value);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const currentContent = editor.getContents(false);
      if (props.value !== currentContent) {
        if (props.value === "" || props.value === null) {
          editor.setContents("");
        } else {
          editor.setContents(props.value);
        }
        if (
          previousValue.current &&
          (props.value === "" || props.value === null)
        ) {
          editor.core.focus();
        }
      }
      previousValue.current = props.value;
    }
  }, [props.value]);

  // Decide which options to use based on the level prop
  let options: any = BasicEditorOptions;
  if (level === 2) {
    options = IntermediateEditorOptions;
  } else if (level === 3) {
    options = AdvancedEditorOptions;
  }

  const handleUpload = (file: any) => {
    // if (file.type.includes('image')) {
    //   handleImageUploadBefore(file)
    // }
    if (file.type.includes("audio")) {
      handleAudioUploadBefore(file);
    }
    if (file.type.includes("video")) {
      handleVideoUploadBefore(file);
    }
  };

  const handleVideoUploadBefore = (file: any) => {
    const editorInstance = editorRef.current;
    // console.log(file,'files')
    if (level === 3) {
      if (file instanceof File) {
        // Insert a temporary video element with a loading video source
        uploadFiles({
          files: [{ file: file, prefixKey: props.uploadPrefixKey }],
          isProtected: false,
          onUploadProgress: (e) => {
            // console.log(e, 'e')
          },
          onSuccess: ([uploadFile]) => {
            const id = uniqueId();
            console.log(editorInstance, uploadFile, "kokokok");
            const videoHtml = `<video id=${id} data-id="${id}" data-type="userUpload" src="${uploadFile.url}" alt="Image" />`;
            // @ts-ignore
            editorInstance.insertHTML(videoHtml);
          },
        });

        // Cancel the default video uploading behavior
        return false;
      } else {
        console.log("The provided object is not a File");
        return false;
      }
    } else {
      console.log("Image upload is not allowed for this level");
      return false;
    }
  };

  const handleAudioUploadBefore = (file: any) => {
    const editorInstance = editorRef.current;
    // console.log(file,'files')
    if (level === 3) {
      if (file instanceof File) {
        // Insert a temporary audio element with a loading audio source
        uploadFiles({
          files: [{ file: file, prefixKey: props.uploadPrefixKey }],
          isProtected: false,
          onUploadProgress: (e) => {
            // console.log(e, 'e')
          },
          onSuccess: ([uploadFile]) => {
            const id = uniqueId();
            console.log(editorInstance, uploadFile, "kokokok");
            const audioHtml = `<audio id=${id} data-id="${id}" data-type="userUpload" src="${uploadFile.url}" alt="Image" />`;
            // @ts-ignore
            editorInstance.insertHTML(audioHtml);
          },
        });

        // Cancel the default audio uploading behavior
        return false;
      } else {
        console.log("The provided object is not a File");
        return false;
      }
    } else {
      console.log("Image upload is not allowed for this level");
      return false;
    }
  };
  const { mutate: rephraseText, isLoading: rephrasing } =
    User.Queries.useRephraseText();
  const [rephrasedText, setRephrasedText] = useState("");
  const handleImageUploadBefore = (file: any) => {
    const editorInstance = editorRef.current;
    // const file = files[0]
    if (level === 3) {
      if (props.imageBase64) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // @ts-ignore
          const base64Image = e.target.result;
          const id = uniqueId();
          const imageHtml = `<img id="${id}" data-id="${id}" data-type="userUpload" src="${base64Image}" alt="Image" />`;
          editorInstance.insertHTML(imageHtml);
        };

        reader.onerror = function (error) {
          console.error("Error occurred while reading file:", error);
        };
      } else {
        if (file instanceof File) {
          // Insert a temporary image element with a loading image source
          uploadFiles({
            files: [{ file: file, prefixKey: props.uploadPrefixKey }],
            isProtected: false,
            onUploadProgress: (e) => {
              // console.log(e, 'e')
            },
            onSuccess: ([uploadFile]) => {
              const id = uniqueId();
              console.log(editorInstance, uploadFile, "kokokok");
              const imageHtml = `<img id=${id} data-id="${id}" data-type="userUpload" src="${uploadFile.url}" alt="Image" />`;
              // @ts-ignore
              editorInstance.insertHTML(imageHtml);
            },
          });

          // Cancel the default image uploading behavior
          return false;
        } else {
          console.log("The provided object is not a File");
          return false;
        }
      }
    } else {
      console.log("Image upload is not allowed for this level");
      return false;
    }
  };
  const handleVariableChange = (value: any) => {
    const editorInstance = editorRef.current;
    if (editorInstance) {
      editorInstance.insertHTML(`{{${value}}}`);
    }
  };

  return (
    <Fragment>
      <Spin spinning={loading}>
        <Row gutter={[20, 10]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            {props?.variables?.map((v) => {
              return (
                <Tag
                  color="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleVariableChange(v.value)}
                >
                  {v.name}
                </Tag>
              );
            })}
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <ActionModal
              title="Rephrased Text"
              cta={
                <Button
                  loading={rephrasing}
                  type="primary"
                  size="small"
                  style={{ marginBottom: 10 }}
                  onClick={() =>
                    rephraseText(
                      {
                        html: true,
                        text: value,
                      },
                      {
                        onSuccess: (v) => {
                          console.log(v, "vv");
                          setRephrasedText(v);
                        },
                      }
                    )
                  }
                >
                  Rephrase Text
                </Button>
              }
              // onConfirm={() => {
              //   // @ts-ignore
              //   props.onChange(rephrasedText);
              //   setRephrasedText("");
              // }}
              onCancel={() => setRephrasedText("setRephrasedText")}
              okText="Replace Text"
              cancelText="No"
            >
              <Row gutter={[10, 10]}>
                {/* <Col span={24}>Rephrased Text</Col> */}
                <Spin tip="Rephrasing Text" spinning={rephrasing}>
                  <Col span={24}>
                    <Title level={4}>Old Text</Title>
                    <HtmlViewer content={value} />
                  </Col>
                  <Col style={{ minWidth: 400, minHeight: 250 }} span={24}>
                    <Title level={4}>Rephrased Text</Title>
                    <HtmlViewer content={rephrasedText} />
                  </Col>
                </Spin>
              </Row>
            </ActionModal>
          </Col>
        </Row>
        <SunEditor
          getSunEditorInstance={(editor) => (editorRef.current = editor)}
          // onFocus={props.onFocus}
          readOnly={props.readonly}
          setContents={value}
          onChange={(e) => {
            if (props.name) {
              form.setFieldValue(props.name, e);
            }
            props.onChange && props.onChange(e);
          }}
          height={`${props.height || 700}`}
          width={`${props.width}`}
          setOptions={{
            ...options,
            // plugins={defaultPlugins}
            // plugins: [variablePlugin(variables)],
            // attributesWhitelist: {
            //   // span: 'variable-value'
            // }
          }}
          // @ts-ignore
          onImageUploadBefore={(e) => handleImageUploadBefore(e[0])}
          // @ts-ignore
          onDrop={(e) => handleUpload(e.dataTransfer.files[0])}
        />
      </Spin>
    </Fragment>
  );
};

export default SunEditorComponent;
