import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface IS3Service {
  uploadFile(file: File): Promise<{ url: string | null; error: Error | null }>;
  uploadMultipleFiles(files: File[]): Promise<{ urls: string[]; errors: Error[] }>;
  deleteFile(fileKey: string): Promise<{ success: boolean; error: Error | null }>;
  downloadFile(fileKey: string): Promise<{ downloadUrl: string | null; error: Error | null }>;
}

export class S3Service implements IS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: import.meta.env.VITE_AWS_REGION || "ap-southeast-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ""
      }
    });
    this.bucketName = import.meta.env.VITE_S3_BUCKET || "";
  }

  async uploadFile(file: File): Promise<{ url: string | null; error: Error | null }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);
  
      const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
      const fileKey = `homeworks/${fileName}`;
  
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: 'public-read' as const
      };
  
      await this.s3Client.send(new PutObjectCommand(params));
  
      const url = `https://${this.bucketName}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;
      return { url, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  async uploadMultipleFiles(files: File[]): Promise<{ urls: string[]; errors: Error[] }> {
    const results = await Promise.allSettled(
      files.map(file => this.uploadFile(file))
    );
    
    const urls: string[] = [];
    const errors: Error[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        if (result.value.url) {
          urls.push(result.value.url);
        }
        if (result.value.error) {
          errors.push(result.value.error);
        }
      } else {
        errors.push(result.reason as Error);
      }
    });
    
    return { urls, errors };
  }

  async deleteFile(fileKey: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey
      };

      await this.s3Client.send(new DeleteObjectCommand(params));
      
      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      return { success: false, error: error as Error };
    }
  }

  async downloadFile(fileKey: string): Promise<{ downloadUrl: string | null; error: Error | null }> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey
      };

      const command = new GetObjectCommand(params);
      
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
      
      return { downloadUrl: signedUrl, error: null };
    } catch (error) {
      console.error("Error generating download URL from S3:", error);
      return { downloadUrl: null, error: error as Error };
    }
  }

  getFileKeyFromUrl(url: string): string {
    try {
      // Extract the file key from the URL
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Remove leading slash if present
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch (error) {
      console.error("Error extracting file key from URL:", error);
      return '';
    }
  }
}

export const s3Service = new S3Service();
