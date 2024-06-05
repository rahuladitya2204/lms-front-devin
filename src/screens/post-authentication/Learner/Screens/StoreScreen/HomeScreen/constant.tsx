import {
  BarChartOutlined,
  EditOutlined,
  HighlightOutlined,
} from "@ant-design/icons";

export const features = [
  {
    title: "Handwritten Answer Analysis",
    icon: <EditOutlined />,
    color: "#87d068",
    page: {
      title: "AI-Powered Handwritten Answer Analysis",
      list: {
        items: [
          "Advanced AI evaluates handwritten answers against ideal answers",
          "Identifies strengths and areas for improvement",
          "Provides consistent, personalized feedback at a lower cost",
        ],
      },
    },
  },
  {
    title: "Offline Test Kits",
    icon: <EditOutlined />,
    color: "#c631c6",
    page: {
      title: "Offline Test Kits",
      list: {
        items: [
          `Physical question papers and OMR sheets delivered to students' homes`,
          `Realistic offline exam experience from the comfort of home`,
          `Completed OMR sheets scanned using Testmint.ai mobile app`,
          `Instant evaluation and comprehensive performance analysis`,
          `Cost-effective alternative to expensive coaching center tests`,
        ],
      },
    },
  },
  {
    title: "Detailed Performance Metrics",
    icon: <BarChartOutlined />,
    color: "#754ebf",
  },
  {
    title: "Vernacular Exams",
    icon: <HighlightOutlined />,
    color: "#d69e1f",
  },
];
