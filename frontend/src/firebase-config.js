import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDNgPCDwc54nkEewPRCdaIuk_aM1ReNMeE",
  authDomain: "robofetch-428113.firebaseapp.com",
  databaseURL: "https://robofetch-428113-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "robofetch-428113",
  storageBucket: "robofetch-428113.appspot.com",
  messagingSenderId: "555643422257",
  appId: "1:555643422257:web:d1c45a43c63ea6c71d3710"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
