import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCw } from 'lucide-react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    const safeArea = Math.max(image.width, image.height) * 2;

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central point on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    // As Base64 string
    return canvas.toDataURL('image/jpeg');
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-stone-900">Adjust Your Photo</h3>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative flex-1 bg-stone-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-8 bg-white space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-stone-500 w-12">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-stone-500 w-12">Rotate</span>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1 h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <button 
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 bg-stone-50 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <RotateCw size={18} />
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
            >
              <Check size={20} />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
