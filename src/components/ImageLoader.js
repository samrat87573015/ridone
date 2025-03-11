import React, { useState } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

const ImageLoader = ({ src, alt, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className="relative w-full bg-gray-100 overflow-hidden"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Failed to load image</p>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className} ${isLoading || hasError ? 'invisible' : 'visible'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageLoader;