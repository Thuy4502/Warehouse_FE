import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary functions

const firebaseConfig = {
  apiKey: "AIzaSyBFA75DxSnNsBvarXXUo8EBxl2ucJkdTPI",
  authDomain: "warehouse-17769.firebaseapp.com",
  projectId: "warehouse-17769",
  storageBucket: "warehouse-17769.appspot.com",
  messagingSenderId: "663656244036",
  appId: "1:663656244036:web:6a61efa0d48ba43eefed11",
  measurementId: "G-E4VWB3C577"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadImageToFirebase = async (file) => {
  if (!file) {
    console.error("No file provided for upload.");
    return null;
  }

  const storageRef = ref(storage, `books/${file.name}`);
  
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const uploadStaffImageToFirebase = async (file) => {
  if (!file) {
    console.error("No file provided for upload.");
    return null;
  }

  const storageRef = ref(storage, `staffs/${file.name}`);
  
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};


export const uploadImageToFirebaseExcel = async (imageBuffer, imageExtension) => {
  const imageName = `books/${Date.now()}.${imageExtension}`;
  const imageRef = ref(storage, imageName);
  const blob = new Blob([imageBuffer], { type: `image/${imageExtension}` });

  try {
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw error; 
  }
};

export const uploadStaffImageToFirebaseExcel = async (imageBuffer, imageExtension) => {
  const imageName = `staffs/${Date.now()}.${imageExtension}`;
  const imageRef = ref(storage, imageName);
  const blob = new Blob([imageBuffer], { type: `image/${imageExtension}` });

  try {
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw error; 
  }
};
