import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FiAlertCircle,
  FiFile,
  FiLoader,
  FiUploadCloud,
  FiCamera,
} from "react-icons/fi";

// Declare the electron global for TypeScript
declare global {
  interface Window {
    electron?: {
      takeScreenshot: () => void;
      onScreenshotData: (callback: (imageData: string) => void) => () => void;
    };
  }
}

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  isLoading,
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isElectron, setIsElectron] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler for screenshot data
  const handleScreenshotData = useCallback(
    (imageData: string) => {
      console.log(
        "Screenshot data received in React component, length:",
        imageData.length
      );

      // Force a state update to trigger a re-render
      setPreview(null);
      setTimeout(() => {
        setPreview(imageData);
      }, 10);

      // Convert data URL to File object
      fetch(imageData)
        .then((res) => res.blob())
        .then((blob) => {
          console.log("Blob created:", blob.size, "bytes");
          const file = new File([blob], "screenshot.png", {
            type: "image/png",
          });
          console.log("File created:", file.name, file.size, "bytes");
          onImageUpload(file);
        })
        .catch((err) => {
          console.error("Error converting screenshot to file:", err);
        });
    },
    [onImageUpload]
  );

  // Check if running in Electron and set up screenshot listener
  useEffect(() => {
    if (window.electron) {
      console.log("Electron detected, setting up screenshot listener");
      setIsElectron(true);

      // Set up screenshot listener
      const cleanup = window.electron.onScreenshotData(handleScreenshotData);

      // Clean up listener when component unmounts
      return cleanup;
    }
  }, [handleScreenshotData, window.electron]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Send to parent for processing
    onImageUpload(file);
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleScreenshotClick = () => {
    if (window.electron) {
      console.log("Taking screenshot via Electron");
      window.electron.takeScreenshot();
    } else {
      console.warn("Electron not available");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full max-w-2xl rounded-lg border-2 border-dashed flex flex-col justify-center items-center p-5 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-900 bg-opacity-20"
            : error
            ? "border-red-500 bg-red-900 bg-opacity-10"
            : "border-gray-600 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ minHeight: "320px" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center py-12">
            <div className="relative">
              {preview && (
                <img
                  src={preview}
                  alt="Chart preview"
                  className="w-64 h-auto rounded opacity-30 mb-4"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <FiLoader className="h-16 w-16 text-blue-500 animate-spin" />
              </div>
            </div>
            <p className="text-lg mt-4">Analyzing your trading chart...</p>
            <p className="text-sm text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center py-4">
            <img
              src={preview}
              alt="Chart preview"
              className="max-h-48 w-auto rounded mb-4"
            />
            <p className="text-sm text-gray-400">
              Drag & drop another image or click below to select
            </p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={onButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              >
                <FiFile className="mr-2" /> Select Another Image
              </button>

              {isElectron && (
                <button
                  onClick={handleScreenshotClick}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
                  disabled
                >
                  <FiCamera className="mr-2" /> Take Screenshot
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <FiUploadCloud className="h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-xl font-semibold mb-2">Upload Trading Chart</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Drag and drop your chart image, or click to browse files
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <FiFile className="mr-2" /> Select Image
              </button>

              {isElectron && (
                <button
                  onClick={handleScreenshotClick}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center"
                  disabled
                >
                  <FiCamera className="mr-2" /> Take Screenshot
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              Supported formats: JPG, PNG, GIF • Maximum size: 10MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-md flex items-start w-full max-w-2xl">
          <FiAlertCircle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-400">Upload Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
