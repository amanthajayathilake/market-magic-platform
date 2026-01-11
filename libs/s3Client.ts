import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize S3 client with Supabase storage configuration
export const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.NEXT_PUBLIC_SUPABASE_REGION || "auto",
  endpoint: `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/s3`,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SUPABASE_SECRET_ACCESS_KEY || "",
  },
});

// Upload file to Supabase storage
export const uploadToSupabase = async (
  file: File,
  bucket: string = process.env.NEXT_PUBLIC_CHARTS_BUCKET_NAME || "charts"
): Promise<string> => {
  try {
    const fileName = `chart-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the public URL of the uploaded image
    return `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to Supabase:", error);
    throw error;
  }
};
