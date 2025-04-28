"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Spin } from 'antd';

/**
 * OptimizedImage Component
 * 
 * A highly optimized image component that:
 * 1. Uses Next.js Image for automatic optimization
 * 2. Implements progressive loading with blur placeholders
 * 3. Handles errors gracefully
 * 4. Supports lazy loading for non-critical images
 * 5. Implements proper sizing and responsive behavior
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) => typeof window === 'undefined'
  ? Buffer.from(str).toString('base64')
  : window.btoa(str);

export default function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  priority = false,
  className = '',
  style = {},
  onClick
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const normalizedSrc = src?.startsWith('data:') 
    ? src 
    : src?.startsWith('/') 
      ? src 
      : src || '/images/placeholder.png';

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '6px',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        ...style
      }}
      onClick={onClick}
    >
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)'
        }}>
          <Spin size="small" />
        </div>
      )}
      
      {error ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          color: '#999'
        }}>
          Image not available
        </div>
      ) : (
        <Image
          src={normalizedSrc}
          alt={alt || 'Image'}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  );
}
