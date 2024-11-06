// Import necessary Firebase modules
npm run dev

import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref,uploadBytes, getDownloadURL } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_ppbA_-dmuttPv9jl9MI8uDZv6ALNn1Y",
  authDomain: "chidaddi-2364e.firebaseapp.com",
  projectId: "chidaddi-2364e",
  storageBucket: "chidaddi-2364e.appspot.com",
  messagingSenderId: "794510079018",
  appId: "1:794510079018:web:f2ce202ae97aa31084bf53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const uploadBox1=document.getElementById('upload-box-1');
const uploadBox2=document.getElementById('upload-box-2');
const uploadBox3=document.getElementById('upload-box-3');

const fileInput1=document.getElementById('fileInput1');
const fileInput2=document.getElementById('fileInput2');
const fileInput3=document.getElementById('fileInput3');

const uploadBtn1=document.getElementById('upload-btn-1');
const uploadBtn2=document.getElementById('upload-btn-2');
const uploadBtn3=document.getElementById('upload-btn-3');

const uploadAllButton=document.getElementById('upload-all-btn');

uploadBox1.addEventListener('click',()=>triggerFileInput('fileInput1'));
fileInput1.addEventListener('change',()=>previewFiles('fileInput1', 'preview1'));
uploadBtn1.addEventListener('click',()=>uploadFiles('fileInput1', 'booth'));

uploadBox2.addEventListener('click',()=>triggerFileInput('fileInput2'));
fileInput2.addEventListener('change',()=>previewFiles('fileInput2', 'preview2'));
uploadBtn2.addEventListener('click',()=>uploadFiles('fileInput2', 'eventdecor'));

uploadBox3.addEventListener('click',()=>triggerFileInput('fileInput3'));
fileInput3.addEventListener('change',()=>previewFiles('fileInput3', 'preview3'));
uploadBtn3.addEventListener('click',()=>uploadFiles('fileInput3', 'photo'));

uploadAllButton.addEventListener('click',()=>uploadAll());

// Function to upload a file and store its path in Firestore
 async function uploadPhoto(folderName, file) {
   try {
     const storageRef = ref(storage, `${folderName}/${file.name}`);

     // Upload the file to Firebase Storage
     await uploadBytes(storageRef, file);
     console.log("File uploaded successfully!");

     // Get the download URL of the uploaded file
     const downloadURL = await getDownloadURL(storageRef);

     // Store the download URL in Firestore
     await addDoc(collection(db, folderName), {
       storagePath: storageRef.fullPath,
       downloadURL: downloadURL,
       uploadedAt: new Date(),
     });

     alert(`File uploaded and stored in ${folderName}`);
   } catch (error) {
     console.error("Error uploading photo:", error);
   }

 }

 // Trigger file input when the upload box is clicked
 function triggerFileInput(inputId) {
    const fileInput = document.getElementById(inputId);
    fileInput.click();
  }

  // Preview selected files before upload
  function previewFiles(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const previewContainer = document.getElementById(previewId);
    previewContainer.innerHTML = ""; // Clear previous previews
    const files = fileInput.files;

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Function to upload files for each category separately
  function uploadFiles(inputId, folderName) {
    const fileInput = document.getElementById(inputId);
    const files = fileInput.files;

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        uploadPhoto(folderName, file);
      });
    } else {
      alert("No files selected");
    }
  }

  // Function to upload all files from all categories
  function uploadAll() {
    const fileInputs = [
      { id: "fileInput1", folder: "booth" },
      { id: "fileInput2", folder: "eventdecor" },
      { id: "fileInput3", folder: "photography" },
    ];

    fileInputs.forEach(({ id, folder }) => {
      const fileInput = document.getElementById(id);
      const files = fileInput.files;

      if (files.length > 0) {
        Array.from(files).forEach((file) => {
          uploadPhoto(folder, file);
        });
      } else {
        alert(`No files selected in ${folder}`);
      }
    });
  }