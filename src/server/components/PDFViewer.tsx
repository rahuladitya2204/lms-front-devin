import { PDFViewerPropsI } from "@Components/PDFViewer";
import dynamic from "next/dynamic";

// This is our wrapper component which contains the PDF viewer
const PDFViewer = dynamic<PDFViewerPropsI>(import("@Components/PDFViewer"), {
  ssr: false,
});

export default PDFViewer;
