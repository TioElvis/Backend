import { v2 } from 'cloudinary';

v2.config({
  cloud_name: 'drmj6uh5c',
  api_key: '415976253441118',
  api_secret: '3zL92lG54fTgwer-0wtgy8XfS1M',
});

export const uploadImage = async (filePath) => {
  return await v2.uploader.upload(filePath);
};

export const deleteImage = async (id) => {
  return await v2.uploader.destroy(id);
};
