import { Common, Store, User } from "@adewaskar/lms-common";
import "./screenshot-effect.css";
import { Text, Title } from "@Components/Typography/Typography";
import { CameraOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Tag, message } from "antd";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";
import TextArea from "@Components/Textarea";
import AppImage from "@Components/Image";
import { useIdleTimer } from "react-idle-timer";
import dayjs from "dayjs";
import { LiveTimer } from "./LiveTimer";
import ProtectedContent from "@Components/ProtectedComponent";

const IDLE_TIMEOUT_IN_MINS = 10;
const TIME_BETWEEN_SCREENSHOTS_IN_MIN = 60;
const CLOSE_WITHOUT_INPUT_IN_MIN = 1;
const LAST_SCREENSHOT_TIME_KEY = "lastScreenshotTime";
const CHECK_AFTER_MIN = 5;

interface MonitoringComponentPropsI {
  children: React.ReactNode;
}

export default function MonitoringComponent(props: MonitoringComponentPropsI) {
  const audioRef = useRef<any>(null);
  const [state, setState] = useState<string>("active");
  const [idleStartTime, setIdleStartTime] = useState<number | null>(null);

  const onIdle = () => {
    setState("idle");
    // Set the idle start time to now minus the initial idle timeout
    setIdleStartTime(Date.now() - IDLE_TIMEOUT_IN_MINS * 60 * 1000);
  };

  const onActive = () => {
    setState("active");
    setIdleStartTime(null);
  };

  const { start, pause } = useIdleTimer({
    startManually: true,
    timeout: IDLE_TIMEOUT_IN_MINS * 60 * 1000,
    onIdle,
    onActive,
    // Specify only user interaction events
    events: ["mousemove", "keydown", "mousedown", "touchstart"],
    // Add debounce to prevent rapid toggling
    debounce: 500,
  });

  const screenshotRef = useRef<any>(null);
  const { isSignedIn } = Store.useAuthentication((s) => s);
  const { data: user } = User.Queries.useGetUserDetails();
  const { data: userLog } = User.Queries.useGetUserLog(user?._id || "", "");
  const { openModal } = useModal();
  const { mutate: updateUserLog, isLoading: updatingScreenshot } =
    User.Queries.useUpdateUserLog();

  useEffect(() => {
    if (isSignedIn && user?.monitoring?.enabled) {
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
            if (state === "idle") {
              return;
            }
            const { file, url } = await captureScreenshot(screenshotRef);
            audioRef.current.play();
            message.success("Screenshot Captured");
            openModal(
              <ScreenshotForm
                file={file}
                currentTime={currentTime}
                image={url}
              />
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
    }
  }, [isSignedIn, state, user]);

  useEffect(() => {
    if (isSignedIn) {
      start();
    } else {
      pause();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (state === "idle") {
      updateUserLog({
        idleTime: IDLE_TIMEOUT_IN_MINS,
      });
    }
  }, [state]);

  // Function to calculate total idle time
  const calculateTotalIdleTime = () => {
    if (!idleStartTime) return IDLE_TIMEOUT_IN_MINS;
    const now = Date.now();
    const idleDurationMs = now - idleStartTime;
    const idleDurationMins = Math.floor(idleDurationMs / (60 * 1000));
    return idleDurationMins;
  };

  return (
    <ProtectedContent
      cta={
        <Alert
          type="error"
          message={
            <Title>
              System Idle for {calculateTotalIdleTime()} minutes
            </Title>
          }
        />
      }
      isVerified={state === "active"}
    >
      <div ref={screenshotRef}>
        <Alert
          style={{ borderRadius: 0 }}
          message={<Text strong> You are being monitored</Text>}
          type="error"
          showIcon
          icon={<CameraOutlined />}
          action={
            userLog?.startedAt ? (
              <div style={{ width: 160 }}>
                Time Logged{" "}
                <Tag color="blue">
                  <LiveTimer startedAt={userLog.startedAt} />
                </Tag>
              </div>
            ) : null
          }
        />
        {props.children}
      </div>
    </ProtectedContent>
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

  const { mutate: updateUserLog, isLoading: updatingScreenshot } =
    User.Queries.useUpdateUserLog();
  const [form] = Form.useForm();

  const submit = ({ url, text }) => {
    if (url && text) {
      updateUserLog(
        { url, text },
        {
          onSuccess: () => {
            message.success("Work status updated");
            closeModal && closeModal();
          },
        }
      );
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      submit({
        text: "No Input from user",
        url: image,
      });
    }, CLOSE_WITHOUT_INPUT_IN_MIN * 60 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const user = Store.useAuthentication((s) => s.user);
  return (
    <div>
      <AppImage style={{ maxHeight: 300, marginBottom: 20 }} src={image} />
      <Form
        layout="vertical"
        form={form}
        onFinish={({ text }) => {
          uploadFiles(
            {
              files: [
                {
                  file,
                  prefixKey: `${user._id}/monitoring/screenshots`,
                },
              ],
              onSuccess: () => { },
            },
            {
              onSuccess: ([{ url }]) => {
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

const calculateTimeLogged = (startedAt) => {
  const startTime = dayjs(startedAt);
  const currentTime = dayjs();
  const diffInSeconds = currentTime.diff(startTime, "second");

  const timeDuration = dayjs.duration(diffInSeconds, "seconds");

  const hours = String(timeDuration.hours()).padStart(2, "0");
  const minutes = String(timeDuration.minutes()).padStart(2, "0");
  const seconds = String(timeDuration.seconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
