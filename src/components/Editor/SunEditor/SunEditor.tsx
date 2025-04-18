import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import "katex/dist/katex.min.css";
import "./style.css";

import {
  AdvancedEditorOptions,
  BasicEditorOptions,
  IntermediateEditorOptions,
} from "./constant";
import {
  Button,
  Col,
  Form,
  message,
  Popconfirm,
  Row,
  Select,
  Spin,
  Switch,
  Tag,
} from "antd";
import { Common, Types, User } from "@adewaskar/lms-common";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

import SunEditor from "suneditor-react";
import { debounce, uniqueId } from "lodash";
import ActionModal from "@Components/ActionModal/ActionModal";
import RephraseTextComponent from "./ModifyTextComponent";

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  uploadPrefixKey?: string;
  modifyCta?: boolean;
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
    if (editorRef.current) {
      editorRef.current.uploadFiles = uploadFiles;
    }
  }, [editorRef.current, uploadFiles])

  // === NEW: Copy image URL on click inside the editor, accounting for <figure> parents
  useEffect(() => {
    if (!editorRef.current) return;

    const editorCore = editorRef.current.core;
    if (!editorCore?.context?.element?.wysiwyg) return;

    const wysiwygArea = editorCore.context.element.wysiwyg;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target instanceof HTMLImageElement) {
        copyImageSrc(target.src);
      } else if (target.tagName.toLowerCase() === "figure") {
        const img = (target as HTMLElement).querySelector("img");
        if (img?.src) {
          copyImageSrc(img.src);
        }
      }
    };

    const copyImageSrc = async (src: string) => {
      // Check if modern async Clipboard API is available
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(src);
          console.log("Copied image URL:", src);
        } catch (err) {
          console.error("Failed to copy text (clipboard API):", err);
          // Fallback
          fallbackCopyTextToClipboard(src);
        }
      } else {
        // Fallback
        fallbackCopyTextToClipboard(src);
      }
    };

    // Old approach using <textarea> and document.execCommand("copy")
    const fallbackCopyTextToClipboard = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Position off-screen so it doesn't show
      textArea.style.position = "fixed";
      textArea.style.left = "-99999px";
      textArea.style.top = "-99999px";

      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        // console.log("Fallback: Copied image URL:", text);
        message.success('Image Link Copied')
      } catch (err) {
        console.error("Fallback: Failed to copy text:", err);
      }

      document.body.removeChild(textArea);
    };

    wysiwygArea.addEventListener("click", handleClick);
    return () => {
      wysiwygArea.removeEventListener("click", handleClick);
    };
  }, []);

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
    options = AdvancedEditorOptions(editorRef.current)
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
            // console.log(editorInstance, uploadFile, "kokokok");
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
            // console.log(editorInstance, uploadFile, "kokokok");
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
              // console.log(editorInstance, uploadFile, "kokokok");
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

  const addSpacesAroundTags = (html: string) => {
    return html
      .replace(/(?<! )(<(a|span)[^>]*>)/g, " $1")
      .replace(/(<\/(a|span)>)(?! )/g, "$1 ");
  };

  const onPasteHandler = (event, cleanData) => {
    const formattedData = addSpacesAroundTags(cleanData);
    return formattedData;
  };

  const onChange = props.onChange ? debounce(props.onChange, 500) : props.onChange;
  return (
    <Fragment>
      <Spin spinning={loading}>
        <Row gutter={[20, 10]} style={{ marginBottom: 0 }}>
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
        {props.modifyCta ? (
          <Row gutter={[10, 10]} justify="end">
            <Col>
              <ActionModal fullscreen
                keyboardClosable={false}
                width={1300}
                closable={false}
                title="Modify Text"
                cta={
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginBottom: 10 }}
                  >
                    Modify Text
                  </Button>
                }
              >
                <RephraseTextComponent
                  text={value}
                  onComplete={(modifiedText) => onChange && onChange(modifiedText)}
                />
              </ActionModal>
            </Col>
          </Row>
        ) : null}
        <SunEditor
          getSunEditorInstance={(editor) => {
            editorRef.current = editor;
            if (editorRef.current)
              editorRef.current.onCopy = async (Event, ClipboardData, Core) => {
                let copiedHTML
                const ClipboardContents = await navigator.clipboard.read()
                for (const ClipboardItem of ClipboardContents) {
                  if (ClipboardItem.types.includes('text/html')) {
                    const ItemAsBlob = await ClipboardItem.getType('text/html')
                    const ItemAsHTML = (await ItemAsBlob.text())
                      .replaceAll('<span>&nbsp;</span>', ' ')
                    copiedHTML = Core.cleanHTML(ItemAsHTML)
                    break
                  }
                }
                if (copiedHTML != null) {
                  const HTMLasBlob = new Blob([copiedHTML], { type: 'text/html' })
                  const HTMLItem = new ClipboardItem({ 'text/html': HTMLasBlob })
                  navigator.clipboard.write([HTMLItem])
                }
              }
          }}
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
            beforePaste: onPasteHandler,
            // pasteTagsWhitelist: "a|span",
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
