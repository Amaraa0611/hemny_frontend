import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

const ImageWithFallback = (props: ImageProps) => {
  const { src, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('/images/default-logo.png'); // Fallback to a default image
  };

  return <Image src={imgSrc} alt={alt} onError={handleError} {...rest} />;
};

export default ImageWithFallback; 