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
  ({ width, height }: { width?: number | string; height?: number | string }) => `
    width: ${width ? `${typeof width === "number" ? width + "px" : width}` : "auto"};
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: ${height ? (typeof height === "number" ? height + "px" : height) : "auto"};
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
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(file || '', {
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
            width={Number(width) || 500}
            height={Number(height) || 300}
            alt={props.alt || `Image`}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={IMG_SRC}
          />
        )}
      </ImageHolder>
      {caption ? <p style={{ margin: 0 }}>{caption}</p> : null}
    </div>
  );
}

export default AppImage;


export function getCDNLink(s3Url: string): string {
  if (!s3Url || typeof s3Url !== 'string') {
    return '/images/not-found.png';
  }
  
  // Handle relative URLs
  if (s3Url.startsWith('/')) {
    return s3Url;
  }
  
  // Handle data URLs
  if (s3Url.startsWith('data:')) {
    return s3Url;
  }
  
  // Handle CDN URLs that are already correct
  if (s3Url.includes('assets.testmint.ai') || s3Url.includes('nimblebee-front-cdn.azureedge.net')) {
    return s3Url;
  }
  
  // Handle S3 URLs
  if (s3Url.includes('upload-junk')) {
    const cdnDomain = 'https://assets.testmint.ai';
    
    try {
      // Parse the original URL
      const url = new URL(s3Url);
      
      // Extract the pathname (includes leading '/')
      const path = url.pathname;
      
      // Construct the new URL using the CDN domain
      return `${cdnDomain}${path}`;
    } catch (error) {
      console.error('Invalid URL provided to getCDNLink:', s3Url, error);
    }
  }
  
  return s3Url;
}
