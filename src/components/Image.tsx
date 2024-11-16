"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { Common } from "@adewaskar/lms-common";
import { useModal } from "./ActionModal/ModalContext";

interface ImagePropsI {
  file?: string;
  alt?: string;
  src?: string;
  width?: number | string; // Adjusted to support Next.js `Image` component use cases
  height?: number | string;
  holderStyle?: React.CSSProperties;
  noLoadNoShowPlaceholder?: React.ReactNode;
  caption?: React.ReactNode;
  style?: any;
  preview?: boolean;
  priority?: boolean;
}

const ImageHolder = styled.div(
  ({ width, height }: { width?: number; height: number }) => `
    width: ${width ? `${typeof width === "number" ? width + "px" : width}` : "auto"
    };
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: ${height || "auto"}px;
    border-radius: 6px;
  `
);

const FALLBACK = "/images/not-found.png";

function AppImage({
  file,
  src,
  width,
  priority,
  height,
  holderStyle,
  noLoadNoShowPlaceholder,
  caption,
  preview,
  ...props
}: ImagePropsI) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(file, {
    enabled: !!file,
  });
  const imageUrl = src || url;

  useEffect(() => {
    setHasLoaded(false);
    // Use the global window object to reference the native Image constructor
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => setHasLoaded(true);
    // Handle the error state as well with `onerror`
    img.onerror = () => setHasLoaded(false);
  }, [imageUrl]);
  const { openModal } = useModal();
  const IMG_SRC = getCDNLink(imageUrl) || FALLBACK;
  return (
    <div>
      <ImageHolder style={holderStyle} width={width} height={height}>
        {noLoadNoShowPlaceholder && !hasLoaded ? (
          noLoadNoShowPlaceholder
        ) : (
          <Image
            onClick={() => {
              if (preview) {
                openModal(<AppImage src={src} />, {
                  width: 600
                });
              }
            }}
            priority={!!priority}
            style={{
              width: width ? width : "100%",
              height: height ? height : "100%",
              objectFit: "cover",
              ...(props.style || {}),
            }}
            width={10}
            height={10}
            // layout="fill"
            objectFit="cover"
            alt={props.alt || `Image`}
            // placeholder="blur"
            src={IMG_SRC}
            unoptimized
          />
        )}
      </ImageHolder>
      {caption ? <p style={{ margin: 0 }}>{caption}</p> : null}
    </div>
  );
}

export default AppImage;


export function getCDNLink(s3Url: string): string {
  if (!s3Url.includes('upload-junk')) {
    return s3Url;
  }
  const cdnDomain = 'https://assets.testmint.ai';

  try {
    // Parse the original URL
    const url = new URL(s3Url);

    // Extract the pathname (includes leading '/')
    const path = url.pathname;

    // Construct the new URL using the CDN domain
    const cdnUrl = `${cdnDomain}${path}`;

    return cdnUrl;
  } catch (error) {
    console.error('Invalid URL provided to getCDNLink:', s3Url, error);
    return s3Url; // Fallback to the original URL in case of error
  }
}