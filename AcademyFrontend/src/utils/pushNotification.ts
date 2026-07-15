// src/utils/pushNotification.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { fetchApi } from '@/lib/api';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID 
};

export const initFcm = async () => {
  try {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // 1. Demander la permission au navigateur
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("Permission de notification refusée.");
      return;
    }

    // 2. Récupérer le Token FCM unique de cet appareil
    const token = await getToken(messaging, {
      vapidKey: process.env.GENERATE_KEY_PAIR
    });

    if (token) {
      console.log("FCM Token de l'utilisateur généré avec succès.");
      await fetchApi('/api/private/users/save-fcm-token/', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    }
  } catch (error) {
    console.error("Erreur lors de la configuration de FCM:", error);
  }
};