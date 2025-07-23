import { useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function TestFirestore() {
  useEffect(() => {
    const testWrite = async () => {
      try {
        const docRef = await addDoc(collection(db, "testCollection"), {
          message: "Hello Sylvencia 🚀",
          timestamp: new Date(),
        });
        console.log("Doc ID:", docRef.id);
      } catch (err) {
        console.error("Erreur Firestore", err);
      }
    };

    testWrite();
  }, []);

  return <div>Test Firestore... regarde la console 🔥</div>;
}
