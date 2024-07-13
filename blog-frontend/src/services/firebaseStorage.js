import { storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export const getImageUrl = async (imageName) => {
  try {
    const sanitizedImageName = imageName.replace(/\s+/g, '_');
    const storageRef = ref(storage, `images/${sanitizedImageName}`);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.error(`Image not found: images/${imageName}`);
      return './assets/blogshog-sq.png'; 
    } else {
      console.error('Error fetching image URL:', error);
      return null;
    }
  }
};
