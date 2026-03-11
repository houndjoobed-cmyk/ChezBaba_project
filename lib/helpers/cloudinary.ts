import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" | "auto" | "raw" = "auto"
): Promise<CloudinaryUploadResult> {
  // Convert file to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `ChezBaba/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result as CloudinaryUploadResult);
          console.log(`Cloudinary ---> Uploaded image: ${result?.public_id}`);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Cloudinary ---> Deleted ${resourceType}: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete ${resourceType} ${publicId}:`, error);
  }
}
