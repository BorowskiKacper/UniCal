import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCD7Cl22YxD42j3i4q3bK6-KXTE4d14P9M",
  authDomain: "unical-24566.firebaseapp.com",
  projectId: "unical-24566",
  storageBucket: "unical-24566.firebasestorage.app",
  messagingSenderId: "873536575300",
  appId: "1:873536575300:web:a97bf338a650bfe71be911",
  measurementId: "G-4PBFN0RLWZ",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Scope: allows the app to create new events and then read, update, or delete only the events (on the user's Google Calendar) it has created.
provider.addScope("https://www.googleapis.com/auth/calendar.events.owned");

export async function signInAndGetCalendarAccess() {
  try {
    console.log("Starting authentication...");

    const result = await signInWithPopup(auth, provider);
    console.log("Authentication successful");

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    const user = result.user;
    console.log("Firebase user:", user.displayName);

    if (accessToken) {
      return { user, accessToken };
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Authentication failed:", error);

    // Provide helpful error messages for common issues
    if (error.code === "auth/popup-blocked") {
      alert(error.code);
    } else if (error.code === "auth/popup-closed-by-user") {
      alert("Authentication was cancelled. Please try again.");
    } else if (error.code === "auth/network-request-failed") {
      alert("Network error. Please check your connection and try again.");
    } else {
      alert(`Authentication failed: ${error.message}`);
    }
    throw error;
  }
}
