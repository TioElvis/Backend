import { v2 } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: '3zL92lG54fTgwer-0wtgy8XfS1M',
});

export const uploadImage = async (filePath: string) => {
  return await v2.uploader.upload(filePath);
};

export const deleteImage = async (id: string) => {
  return await v2.uploader.destroy(id);
};
