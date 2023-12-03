// @ts-nocheck
import { Image as AntDImage, ImageProps, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { Common } from '@adewaskar/lms-common';
import { fabric } from 'fabric';
import styled from '@emotion/styled';

interface ImageVisual {
  shape: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text: string;
  color: string;
}

interface ImagePropsI extends ImageProps {
  file?: string;
  holderStyle?: React.CSSProperties;
  noLoadNoShowPlaceholder?: React.ReactNode;
  caption?: React.ReactNode;
  visuals?: ImageVisual[];
}
const ImageHolder = styled.div<{ style?: React.CSSProperties }>(
  (props) => `
    position: relative;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
  `
);

const ImageComponent = styled(AntDImage)`
  object-fit: cover !important;
`;

const SVGOverlay = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const FALLBACK = `/images/not-found.png`;

const AppImage: React.FC<ImagePropsI> = ({ visuals, ...props }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(props.file, {
    enabled: !!props.file,
  });
  const Url = props.src || url;

  useEffect(() => {
    if (!Url) return;
    
    const img = new Image();
    img.src = Url;
    img.onload = () => setHasLoaded(true);
  }, [Url]);

  return (
    <div>
      <ImageHolder style={{ ...props.holderStyle }}>
      <ImageComponent
          preview={true}
          {...props}
          src={Url || FALLBACK}
          fallback={<Skeleton.Image active />}
        />
        {hasLoaded && visuals && (
          <SVGOverlay>
            {visuals.map((visual, index) => {
              if (visual.shape === 'rectangle') {
                return (
                  <rect
                    key={index}
                    x={visual.coordinates.x}
                    y={visual.coordinates.y}
                    width={visual.coordinates.width}
                    height={visual.coordinates.height}
                    stroke={visual.color} // Red or any color provided in the 'color' property
                    strokeWidth="2" // This can be any number that represents the border width you want
                  fill='transparent'
                    />
                );
              }
              // Add other shapes handling here
              return null;
            })}
            {/* Add texts or other SVG elements here */}
          </SVGOverlay>
        )}
      </ImageHolder>
      {props.caption && <p style={{ margin: 0 }}>{props.caption}</p>}
    </div>
  );
};


export default AppImage