import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Compression error:', error);
    throw error;
  }
};