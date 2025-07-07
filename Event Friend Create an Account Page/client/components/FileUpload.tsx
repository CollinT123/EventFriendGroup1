import { useState, useRef, useEffect } from "react";

interface FileUploadProps {
  onFileChange?: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  onFileChange,
  className = "",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setError("");
      setPreviewUrl("");
      onFileChange?.(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    const fileExtension = file.name.toLowerCase().split(".").pop();

    if (
      !allowedTypes.includes(file.type) &&
      !["pdf", "jpeg", "jpg"].includes(fileExtension || "")
    ) {
      setError("Please select a PDF or JPEG file");
      setSelectedFile(null);
      setPreviewUrl("");
      onFileChange?.(null);
      return;
    }

    setError("");
    setSelectedFile(file);
    onFileChange?.(file);

    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="flex items-stretch border-4 border-black">
        {/* Blue preview box */}
        <div className="w-20 bg-blue-500 flex items-center justify-center overflow-hidden">
          {selectedFile && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : selectedFile && selectedFile.type === "application/pdf" ? (
            <div className="text-white text-xs text-center px-1">
              <span>PDF</span>
            </div>
          ) : (
            <span className="text-white text-xs">Preview</span>
          )}
        </div>

        {/* File input area - white background */}
        <div className="flex-1 bg-white px-4 py-4 flex items-center border-l-4 border-black">
          <span className="text-black font-medium text-lg">
            {selectedFile
              ? selectedFile.name
              : "Insert Profile Picture: (PDF, JPEG)"}
          </span>
        </div>

        {/* Gray upload button */}
        <button
          type="button"
          onClick={handleBoxClick}
          className="bg-gray-500 text-white px-4 py-4 border-l-4 border-black hover:bg-gray-600 transition-colors font-medium text-lg whitespace-nowrap"
        >
          Insert PDF, JPEG
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpeg,.jpg,application/pdf,image/jpeg"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
