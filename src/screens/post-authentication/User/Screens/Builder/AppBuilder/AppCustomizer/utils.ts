function getImageData(url: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas 2D context."));
          return;
        }
  
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  
  function getDominantColors(imageData: ImageData): string[] {
    const colors: Record<string, number> = {};
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const key = `${data[i]}-${data[i + 1]}-${data[i + 2]}`;
      colors[key] = (colors[key] || 0) + 1;
    }
  
    const sortedColors = Object.keys(colors).sort((a, b) => colors[b] - colors[a]).slice(0, 10);
    return sortedColors.map(key => {
      const [r, g, b] = key.split('-');
      return `rgb(${r}, ${g}, ${b})`;
    });
  }
  
  export async function getPaletteFromImage(url: string): Promise<string[]> {
    const imageData = await getImageData(url);
    return getDominantColors(imageData);
  }
  
  // Usage
//   getPaletteFromImage('https://example.com/path/to/image.jpg').then(palette => {
//     console.log(palette); // This should log the dominant colors from the image
//   });
  