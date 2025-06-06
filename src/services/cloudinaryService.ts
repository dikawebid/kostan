interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!this.cloudName || !this.uploadPreset) {
      throw new Error(
        "Cloudinary configuration is missing. Please check your environment variables.",
      );
    }
  }

  async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<CloudinaryUploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", "Apps/kostan"); // Organize uploads in folders

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error("Failed to parse upload response"));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed due to network error"));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      );
      xhr.send(formData);
    });
  }

  async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onComplete?: (fileIndex: number, url: string) => void,
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      }).then((response) => {
        if (onComplete) {
          onComplete(index, response.secure_url);
        }
        return response.secure_url;
      }),
    );

    return Promise.all(uploadPromises);
  }

  // Delete image from Cloudinary (requires public_id)
  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires server-side implementation with API secret
    // This is a placeholder for future implementation
    console.warn("Image deletion requires server-side implementation");
  }

  // Get optimized image URL with transformations
  getOptimizedImageUrl(
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: "auto" | number;
      format?: "auto" | "webp" | "jpg" | "png";
    } = {},
  ): string {
    if (!url.includes("cloudinary.com")) {
      return url; // Return original URL if not a Cloudinary URL
    }

    const { width, height, quality = "auto", format = "auto" } = options;

    // Extract the base URL and public ID
    const urlParts = url.split("/upload/");
    if (urlParts.length !== 2) return url;

    const [baseUrl, publicIdWithExtension] = urlParts;

    // Build transformation string
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformationString =
      transformations.length > 0 ? transformations.join(",") + "/" : "";

    return `${baseUrl}/upload/${transformationString}${publicIdWithExtension}`;
  }

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Ukuran file terlalu besar. Maksimal 10MB.",
      };
    }

    return { valid: true };
  }
}

export const cloudinaryService = new CloudinaryService();
