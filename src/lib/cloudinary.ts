import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
export const MAX_BYTES = 4 * 1024 * 1024;

export async function uploadImage(file: File, folder = "hellofaruk") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured. Set the CLOUDINARY_* environment variables.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Unsupported file type.");
  if (file.size > MAX_BYTES) throw new Error("File is larger than 4 MB.");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, res) => {
        if (err || !res) return reject(err ?? new Error("Upload failed"));
        resolve(res.secure_url);
      })
      .end(buffer);
  });
}
