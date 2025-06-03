import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  width = 200,
  height = 200,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/images/default-logo.png');
    }
  };

  return (
    <div className="relative">
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
      />
    </div>
  );
}; 