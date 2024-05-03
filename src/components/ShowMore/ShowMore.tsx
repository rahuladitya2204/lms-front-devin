import React, { useState, useRef, useEffect } from "react";
import { Button, Typography } from "antd";
import styled from "@emotion/styled";

const { Paragraph } = Typography;

const ViewMoreDiv = styled.div`
  .view-more {
    position: relative;
  }

  .content {
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .minified {
    position: relative;
  }

  .expanded {
    max-height: none;
  }

  .blur-overlay {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .show-less {
    text-align: center;
  }
`;

interface ShowMoreProps {
  children: React.ReactNode;
  minHeight: number;
}

const ShowMore: React.FC<ShowMoreProps> = ({ children, minHeight }) => {
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = showMore ? "none" : `${minHeight}px`;
    }
  }, [showMore, minHeight]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <ViewMoreDiv>
      <div
        ref={contentRef}
        className={`content ${showMore ? "expanded" : "minified"}`}
      >
        <Paragraph>{children}</Paragraph>
      </div>
      {!showMore && (
        <div className="blur-overlay">
          <Button
            shape="round"
            type="primary"
            size="small"
            onClick={toggleShowMore}
          >
            Show More
          </Button>
        </div>
      )}
      {/* {showMore && (
        <div className="show-less">
          <Button
            className="show-less"
            shape="round"
            type="primary"
            size="small"
            onClick={toggleShowMore}
          >
            Show Less
          </Button>
        </div>
      )} */}
    </ViewMoreDiv>
  );
};

export default ShowMore;
