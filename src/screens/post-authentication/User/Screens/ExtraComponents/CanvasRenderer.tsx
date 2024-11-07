// CanvasRenderer.tsx
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface CanvasRendererProps {
    children: React.ReactNode;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);

    useEffect(() => {
        const captureContent = async () => {
            if (containerRef.current) {
                try {
                    // Wait for fonts to load
                    await document.fonts.ready;

                    // Wait for images to load
                    const images = containerRef.current.getElementsByTagName('img');
                    await Promise.all(
                        Array.from(images).map(
                            (img) =>
                                new Promise<void>((resolve) => {
                                    if (img.complete) {
                                        resolve();
                                    } else {
                                        img.onload = () => resolve();
                                        img.onerror = () => resolve();
                                    }
                                })
                        )
                    );

                    // Allow the DOM to update
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    // Capture the content using html2canvas
                    const canvas = await html2canvas(containerRef.current, {
                        backgroundColor: null,
                        useCORS: true,
                        scrollX: 0,
                        scrollY: 0,
                    });

                    // Convert the canvas to a data URL
                    const dataUrl = canvas.toDataURL('image/png');

                    // Set the data URL to state
                    setCanvasDataUrl(dataUrl);

                    // Hide the container after capturing
                    containerRef.current.style.display = 'none';
                } catch (error) {
                    console.error('Error capturing canvas image:', error);
                }
            }
        };

        captureContent();
    }, [children]);

    return (
        <div style={{ width: '100%' }}>
            {/* Hidden container to render content and get accurate dimensions */}
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1,
                }}
            >
                {children}
            </div>

            {/* Display the captured image */}
            {canvasDataUrl ? (
                <img
                    src={canvasDataUrl}
                    alt="Rendered content"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            ) : (
                <div>Loading content...</div>
            )}
        </div>
    );
};

export default CanvasRenderer;
