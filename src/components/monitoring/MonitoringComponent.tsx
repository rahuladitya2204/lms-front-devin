import { Common, User } from "@adewaskar/lms-common";
import "./screenshot-effect.css";
import { Title } from "@Components/Typography/Typography";
import { CameraOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, message } from "antd";
import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";
import TextArea from "@Components/Textarea";
import AppImage from "@Components/Image";

const TIME_BETWEEN_SCREENSHOTS_IN_MIN = 30;
const CLOSE_WITHOUT_INPUT_IN_MIN = 1;
const LAST_SCREENSHOT_TIME_KEY = "lastScreenshotTime";
const CHECK_AFTER_MIN = 2;
interface MonitoringComponentPropsI {
  children: React.ReactNode;
}

export default function MonitoringComponent(props: MonitoringComponentPropsI) {
  const audioRef = useRef<any>(null);
  const screenshotRef = useRef<any>(null);
  const { openModal } = useModal();
  useEffect(() => {
    audioRef.current = new Audio(`/screenshot-sound.mp3`);

    const captureScreenshotAsync = async () => {
      console.log("checking");
      try {
        const currentTime = Date.now();
        const lastScreenshotTime = localStorage.getItem(
          LAST_SCREENSHOT_TIME_KEY
        );

        if (
          !lastScreenshotTime ||
          currentTime - parseInt(lastScreenshotTime) >=
            TIME_BETWEEN_SCREENSHOTS_IN_MIN * 60 * 1000
        ) {
          const { file, url } = await captureScreenshot(screenshotRef);
          audioRef.current.play();
          message.success("Screenshot Captured");
          openModal(
            <ScreenshotForm file={file} currentTime={currentTime} image={url} />
          );
        }
      } catch (error) {
        // Handle any errors that occurred during the screenshot capture
        console.error("Screenshot capture error:", error);
      }
    };

    const checkScreenshotInterval = setInterval(() => {
      captureScreenshotAsync();
    }, CHECK_AFTER_MIN * 60 * 1000);

    // Check if lastScreenshotTime exists in localStorage
    const lastScreenshotTime = localStorage.getItem(LAST_SCREENSHOT_TIME_KEY);
    if (!lastScreenshotTime) {
      // If lastScreenshotTime doesn't exist, take a screenshot immediately
      captureScreenshotAsync();
    }

    return () => {
      clearInterval(checkScreenshotInterval);
    };
  }, []);

  return (
    <div ref={screenshotRef}>
      <Alert
        style={{ borderRadius: 0 }}
        message="You are being monitored"
        type="error"
        showIcon
        icon={<CameraOutlined />}
      />
      {props.children}
    </div>
  );
}

const captureScreenshot = (
  screenshotRef
): Promise<{ file: File; url: string }> => {
  return new Promise((resolve, reject) => {
    const element = document.body;
    html2canvas(element)
      .then((canvas) => {
        const screenshotDataURL = canvas.toDataURL("image/png");

        // Convert data URL to Blob
        const blob = dataURLToBlob(screenshotDataURL);

        // Create File object from Blob
        const file = new File([blob], "screenshot.png", { type: "image/png" });

        // Apply the screenshot effect
        screenshotRef.current.classList.add("screenshot-effect");
        setTimeout(() => {
          screenshotRef.current.classList.remove("screenshot-effect");
          resolve({ file, url: screenshotDataURL }); // Resolve the Promise with the File object
        }, 500);
      })
      .catch((error) => {
        reject(error); // Reject the Promise if an error occurs
      });
  });
};

// Helper function to convert data URL to Blob
const dataURLToBlob = (dataURL) => {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: contentType });
};

const ScreenshotForm = ({
  image,
  currentTime,
  closeModal,
  file,
}: {
  image: string;
  file: File;
  closeModal?: Function;
  currentTime: number;
}) => {
  const { mutate: uploadFiles, isLoading: uploadingScreenshot } =
    Common.Queries.useUploadFiles();

  const { mutate: takeScreenshot, isLoading: updatingScreenshot } =
    User.Queries.useUpdateUserScreenshot();
  const [form] = Form.useForm();

  const submit = ({ url, text }) => {
    takeScreenshot(
      { url, text },
      {
        onSuccess: () => {
          message.success("Work status updated");
          closeModal && closeModal();
        },
      }
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      submit({
        text: "No Input from user",
        url: image,
      });
    }, CLOSE_WITHOUT_INPUT_IN_MIN * 60 * 1000);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  return (
    <div>
      <AppImage style={{ maxHeight: 300 }} src={image} />
      <Form
        layout="vertical"
        form={form}
        onFinish={({ text }) => {
          uploadFiles(
            {
              files: [
                {
                  file,
                  prefixKey: "monitoring/screenshots",
                },
              ],
              onSuccess: () => {},
            },
            {
              onSuccess: (url: string) => {
                submit({ text, url });
                localStorage.setItem(
                  LAST_SCREENSHOT_TIME_KEY,
                  currentTime.toString()
                );
              },
            }
          );
        }}
      >
        <Form.Item label="What are you working on?" name="text">
          <TextArea rows={2} />
        </Form.Item>
        <Button
          loading={uploadingScreenshot || updatingScreenshot}
          onClick={form.submit}
          type="primary"
          block
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};
