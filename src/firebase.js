import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDHaZ7ToUDCb0qB02T9Tyc0w5P_38YLv8o",
  authDomain: "eventify-b3f6e.firebaseapp.com",
  projectId: "eventify-b3f6e",
  storageBucket: "eventify-b3f6e.appspot.com",
  messagingSenderId: "394889711891",
  appId: "1:394889711891:web:b8c53ef3025fd76ae6cae6"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { app, db }