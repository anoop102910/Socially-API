const {initializeApp} = require('firebase/app')
const {getStorage} = require('firebase/storage')


const firebaseConfig = {
  apiKey: "AIzaSyCKLo4DzyiJfCFBvAUuKXKvf9W9eh89cp0",
  authDomain: "socially-69be5.firebaseapp.com",
  projectId: "socially-69be5",
  storageBucket: "socially-69be5.appspot.com",
  messagingSenderId: "199209366934",
  appId: "1:199209366934:web:28d741d25a30fceb3259b7",
  measurementId: "G-1920BFDPM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
module.exports = storage;
