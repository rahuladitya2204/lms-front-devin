import React, { ChangeEvent, useState } from 'react';

import { Button } from 'antd';
import { prominent } from 'color.js';

interface ColorPickerProps {
  onPrimaryColorSelected: (color: string) => void;
  onColorPaletteGenerated: (colors: string[]) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onPrimaryColorSelected, onColorPaletteGenerated }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const generateColorPalette = async () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result as string;
            const primaryColor = await prominent(imageUrl);
            // @ts-ignore
          onPrimaryColorSelected(primaryColor);

          const palette = await prominent(imageUrl, { amount: 5 });
            // @ts-ignore
            onColorPaletteGenerated(palette);
        }
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <Button onClick={generateColorPalette}>Generate Color Palette</Button>
    </div>
  );
};

export default ColorPicker;
