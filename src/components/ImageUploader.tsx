import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Link,
  Check,
  AlertCircle,
} from "lucide-react";
import { cloudinaryService } from "../services/cloudinaryService";

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  uploading: boolean;
  progress: number;
  error?: string;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
  disabled = false,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() =>
    images.map((url, index) => ({
      id: `existing-${index}`,
      url,
      uploading: false,
      progress: 100,
    })),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent when images change
  React.useEffect(() => {
    const urls = uploadedImages
      .filter((img) => !img.uploading && !img.error)
      .map((img) => img.url);
    onChange(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    const currentCount = uploadedImages.filter((img) => !img.error).length;
    const availableSlots = maxImages - currentCount;
    const filesToUpload = files.slice(0, availableSlots);

    if (filesToUpload.length < files.length) {
      alert(
        `Hanya ${availableSlots} gambar yang dapat ditambahkan. Maksimal ${maxImages} gambar.`,
      );
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      const validation = cloudinaryService.validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        alert(`File ${file.name}: ${validation.error}`);
      }
    }

    if (validFiles.length === 0) return;

    // Add files to state with uploading status
    const newImages: UploadedImage[] = validFiles.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      url: URL.createObjectURL(file), // Temporary preview URL
      file,
      uploading: true,
      progress: 0,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);

    // Upload files
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const imageId = newImages[i].id;

      try {
        const response = await cloudinaryService.uploadImage(
          file,
          (progress) => {
            setUploadedImages((prev) =>
              prev.map((img) =>
                img.id === imageId
                  ? { ...img, progress: progress.percentage }
                  : img,
              ),
            );
          },
        );

        // Update with final URL
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  url: response.secure_url,
                  uploading: false,
                  progress: 100,
                  file: undefined, // Clear file reference
                }
              : img,
          ),
        );

        // Revoke temporary URL
        URL.revokeObjectURL(newImages[i].url);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  uploading: false,
                  error:
                    error instanceof Error ? error.message : "Upload gagal",
                  progress: 0,
                }
              : img,
          ),
        );
      }
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove?.file) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const retryUpload = async (id: string) => {
    const image = uploadedImages.find((img) => img.id === id);
    if (!image?.file) return;

    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, uploading: true, error: undefined, progress: 0 }
          : img,
      ),
    );

    try {
      const response = await cloudinaryService.uploadImage(
        image.file,
        (progress) => {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, progress: progress.percentage } : img,
            ),
          );
        },
      );

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                url: response.secure_url,
                uploading: false,
                progress: 100,
                file: undefined,
                error: undefined,
              }
            : img,
        ),
      );
    } catch (error) {
      console.error("Retry upload failed:", error);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload gagal",
                progress: 0,
              }
            : img,
        ),
      );
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL berhasil disalin!");
    });
  };

  const canAddMore =
    uploadedImages.filter((img) => !img.error).length < maxImages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Gambar Kamar ({uploadedImages.filter((img) => !img.error).length}/
          {maxImages})
        </label>
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Gambar</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      {uploadedImages.length === 0 && (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
          }`}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Klik untuk upload gambar atau drag & drop
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            JPG, PNG, WebP (Maks. 10MB per file)
          </p>
        </div>
      )}

      {/* Image Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square"
            >
              {/* Image Preview */}
              <img
                src={cloudinaryService.getOptimizedImageUrl(image.url, {
                  width: 300,
                  height: 300,
                })}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Upload Progress Overlay */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium">{image.progress}%</p>
                  </div>
                </div>
              )}

              {/* Error Overlay */}
              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white p-2">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs">{image.error}</p>
                    {image.file && (
                      <button
                        onClick={() => retryUpload(image.id)}
                        className="mt-2 bg-white text-red-500 px-2 py-1 rounded text-xs font-medium"
                      >
                        Coba Lagi
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Indicator */}
              {!image.uploading && !image.error && (
                <div className="absolute top-2 left-2">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {!image.uploading && !image.error && (
                  <button
                    onClick={() => copyUrl(image.url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                    title="Copy URL"
                  >
                    <Link className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(image.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                  title="Hapus"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* URL Display */}
              {!image.uploading && !image.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                  <p className="text-xs truncate" title={image.url}>
                    {image.url}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          {canAddMore && uploadedImages.length > 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tambah
                </p>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Upload Instructions */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>• Format yang didukung: JPG, PNG, WebP</p>
        <p>• Ukuran maksimal: 10MB per file</p>
        <p>• Maksimal {maxImages} gambar</p>
        <p>• Gambar akan dioptimasi secara otomatis</p>
      </div>
    </div>
  );
};

export default ImageUploader;
