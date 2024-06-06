import {
  BarChartOutlined,
  EditOutlined,
  HighlightOutlined,
  HomeOutlined,
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
    icon: <HomeOutlined />,
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
    page: {
      title: "Detailed Performance Metrics",
      list: {
        items: [
          `Instant results and comprehensive performance analysis`,
          `Metrics include AIR (All India Rank), accuracy, percentile, and concept-wise breakdown`,
          `Identifies areas of strength and topics needing improvement`,
          `Enables data-driven adjustments to study plans`,
          `Tracks progress over time for targeted preparation`,
        ],
      },
    },
  },
  {
    title: "Vernacular Exams",
    icon: <HighlightOutlined />,
    color: "#d69e1f",
    page: {
      title: "Vernacular and Regional Exam Support",
      list: {
        items: [
          `Offers multilingual platform with objective and subjective questions`,
          `Provides expert-curated question banks tailored to regional exam syllabi and patterns`,
          `Eliminates language barriers, allowing students to express thoughts comfortably`,
          `Fills gap in exam preparation resources for diverse linguistic backgrounds`,
          `Contributes to a more inclusive and equitable educational ecosystem`,
        ],
      },
    },
  },
];
