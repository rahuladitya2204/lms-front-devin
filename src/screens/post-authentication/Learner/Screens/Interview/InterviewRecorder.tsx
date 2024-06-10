import React, { useRef, useState } from "react";
import { Button, message, Upload, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const InterviewRecorder = () => {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);

        // Upload the video blob to Azure Blob Storage
        setUploading(true);
        const formData = new FormData();
        formData.append("video", blob);

        try {
          await axios.post("http://localhost:5000/upload-video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              setProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            },
          });
          message.success("Video uploaded successfully");
        } catch (error) {
          message.error("Error uploading video");
        } finally {
          setUploading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      message.error("Error accessing media devices");
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", marginBottom: "20px" }}
      />
      <div>
        <Button
          type="primary"
          onClick={startRecording}
          disabled={recording}
          style={{ marginRight: "10px" }}
        >
          Start Recording
        </Button>
        <Button type="danger" onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </Button>
      </div>
      {videoURL && (
        <div style={{ marginTop: "20px" }}>
          <video src={videoURL} controls style={{ width: "100%" }} />
        </div>
      )}
      {uploading && (
        <div style={{ marginTop: "20px" }}>
          <Progress percent={progress} />
        </div>
      )}
    </div>
  );
};

export default InterviewRecorder;
