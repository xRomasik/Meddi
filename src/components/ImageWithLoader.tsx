import { useState } from "react";
import "./ImageWithLoader.css";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
}

const ImageWithLoader = ({ src, alt }: ImageWithLoaderProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="image-container">
      {loading && <div className="spinner" />}
      {!loading && error && <div className="error-placeholder">!</div>}
      <img
        src={src}
        alt={alt}
        style={{
          display: loading || error ? "none" : "block",
          borderRadius: "50%",
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageWithLoader;
