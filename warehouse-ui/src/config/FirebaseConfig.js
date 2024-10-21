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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// Function to upload image to Firebase and get the URL
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
