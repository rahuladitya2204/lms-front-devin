import { Common, User } from "@adewaskar/lms-common";
import "./screenshot-effect.css";
import { Title } from "@Components/Typography/Typography";
import { CameraOutlined } from "@ant-design/icons";
import { Alert, message } from "antd";
import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";
const afterMin = 20;

interface MonitoringComponentPropsI {
  children: React.ReactNode;
}

export default function MonitoringComponent(props: MonitoringComponentPropsI) {
  const { mutate: uploadFiles } = Common.Queries.useUploadFiles();
  const { mutate: takeScrenshot } = User.Queries.useUpdateUserScreenshot();
  const audioRef = useRef(null);
  const screenshotRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio(`/screenshot-sound.mp3`);
    const captureScreenshotAsync = async () => {
      try {
        const file = await captureScreenshot(screenshotRef);
        audioRef.current.play();
        message.success("Screenshot Captured");
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
              takeScrenshot({
                url: url,
              });
            },
          }
        );
      } catch (error) {
        // Handle any errors that occurred during the screenshot capture
        console.error("Screenshot capture error:", error);
      }
    };

    const randomScreenshotInterval = setInterval(() => {
      captureScreenshotAsync();
    }, Math.floor(Math.random() * afterMin * 60 * 1000)); // Random interval between 0 and 10 minutes

    return () => {
      clearInterval(randomScreenshotInterval);
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

const captureScreenshot = (screenshotRef): Promise<File> => {
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
          resolve(file); // Resolve the Promise with the File object
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
