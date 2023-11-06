import React, { useEffect } from 'react';

interface ApplyFaviconProps {
  faviconUrl: string;
}

const ApplyFavicon: React.FC<ApplyFaviconProps> = ({ faviconUrl }) => {
  useEffect(() => {
    // Find the existing favicon element by its `rel` attribute
    const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    // Store the current favicon if it exists to restore on unmount
    const originalFaviconHref = existingLink ? existingLink.href : '';

    if (existingLink) {
      existingLink.href = faviconUrl;
    } else {
      // Create a new link element for the favicon
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = faviconUrl;
      document.head.appendChild(newLink);
    }

    // Cleanup function to reset favicon when component unmounts
    return () => {
      if (existingLink) {
        existingLink.href = originalFaviconHref;
      }
    };
  }, [faviconUrl]);

  // Rest of your component...
  return (
    <div>
      {/* Component Markup */}
    </div>
  );
};

export default ApplyFavicon;
