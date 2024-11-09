import AppImage, { getCDNLink } from '@Components/Image';
import axios from 'axios';
import React, { useEffect } from 'react';

interface Base64ImageProps {
    src: string;
    alt?: string;
    noPreviewImage?: boolean;
}

const Base64Image: React.FC<Base64ImageProps> = ({ src, alt, noPreviewImage }) => {
    const [dataSrc, setDataSrc] = React.useState<string>(src);
    const [error, setError] = React.useState<boolean>(false);
    const IMG_SRC = getCDNLink(src);
    useEffect(() => {
        let isMounted = true;

        getImageBase64(IMG_SRC)
            .then((base64Src) => {
                if (isMounted) {
                    setDataSrc(base64Src);
                }
            })
            .catch((error) => {
                console.warn('Failed to convert image to base64:', error);
                if (isMounted) {
                    setError(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [src]);

    if (error) {
        // Optionally render a fallback or placeholder
        return <div>Image failed to load</div>;
    }

    return (
        <AppImage
            src={dataSrc}
            alt={alt}
            preview={!noPreviewImage}
        />
    );
};

export default Base64Image;

const getImageBase64 = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        // Convert the arraybuffer to base64
        const base64 = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Get the image's MIME type from the response headers
        const mimeType = response.headers['content-type'];

        // Return the base64 data URL
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};
