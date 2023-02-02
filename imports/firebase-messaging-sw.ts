

declare const self: ServiceWorkerGlobalScope;
self["zzz"] = "zzzzzzzzz"; 

// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// const firebaseConfig = {
//   apiKey: "AIzaSyAdW-DEUZuYcN-1snWNcL7QvtkNdibT_vY",
//   authDomain: "deep-97e93.firebaseapp.com",
//   projectId: "deep-97e93",
//   storageBucket: "deep-97e93.appspot.com",
//   messagingSenderId: "430972811028",
//   appId: "1:430972811028:web:7c43130f8166c437c03401",
//   measurementId: "G-NJ1R8HDWLK"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// const messaging = getMessaging(firebaseApp);

// onBackgroundMessage(messaging,  (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Messagae body.',
//     icon: '/firebase-logo.png'
//   };

//    self.registration.showNotification(notificationTitle,notificationOptions);
// });

export {};