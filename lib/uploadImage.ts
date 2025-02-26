import cloudinary from "./cloudinary";

interface UploadResponse {
  secure_url: string;
  public_id: string;
}

export const UploadImage = async (file: File, folder: string): Promise<UploadResponse> => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadResponse); 
          }
        }
      )
      .end(bytes);
  });
};