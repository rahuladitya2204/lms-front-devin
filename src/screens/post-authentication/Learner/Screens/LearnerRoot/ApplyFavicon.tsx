import React, { useEffect } from 'react';

interface ApplyFaviconProps {
  faviconUrl: string;
  shortName: string; // New prop for the document title
}

const ApplyFavicon: React.FC<ApplyFaviconProps> = ({ faviconUrl, shortName }) => {
  useEffect(() => {
    // For favicon
    const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    const originalFaviconHref = existingLink ? existingLink.href : '';

    if (existingLink) {
      existingLink.href = faviconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = faviconUrl;
      document.head.appendChild(newLink);
    }

    // For title
    const originalTitle = document.title; // Store the current title
    if(shortName)
    document.title = shortName; // Update the title

    // Cleanup function to reset favicon and title when component unmounts
    return () => {
      if (existingLink) {
        existingLink.href = originalFaviconHref;
      }
      if (originalTitle) {
        document.title = originalTitle; // Reset the title
      }
    };
  }, [faviconUrl, shortName]); // Include shortName in the dependency array

  // Rest of your component...
  return (
    <div>
      {/* Component Markup */}
    </div>
  );
};

export default ApplyFavicon;
