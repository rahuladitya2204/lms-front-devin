import React, { useState, useRef, useEffect } from "react";
import { Button, Typography } from "antd";
import styled from "@emotion/styled";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

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
    max-height: ${({ minHeight }) => minHeight}px;
  }

  .expanded {
    max-height: none;
  }

  .blur-overlay {
    position: absolute;
    bottom: 0;
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
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setIsOverflowing(contentHeight > minHeight);
      }
    };

    checkOverflow();
  }, [children, minHeight]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <ViewMoreDiv minHeight={minHeight}>
      <div
        ref={contentRef}
        className={`content ${showMore ? "expanded" : "minified"}`}
      >
        <Paragraph>{children}</Paragraph>
      </div>
      {isOverflowing && (
        <>
          {!showMore && (
            <div className="blur-overlay">
              <Button
                shape="round"
                type="primary"
                size="small"
                onClick={toggleShowMore}
              >
                Show More
                <ArrowDownOutlined />
              </Button>
            </div>
          )}
          {showMore && (
            <div className="show-less">
              <Button
                shape="round"
                type="primary"
                size="small"
                onClick={toggleShowMore}
              >
                Show Less
                <ArrowUpOutlined />
              </Button>
            </div>
          )}
        </>
      )}
    </ViewMoreDiv>
  );
};

export default ShowMore;
