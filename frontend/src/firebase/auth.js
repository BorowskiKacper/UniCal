import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();

// Google auth with calendar scope for calendar operations
googleProvider.addScope(
  "https://www.googleapis.com/auth/calendar.events.owned"
);

// Basic Google auth without calendar scope for initial signup/login
const basicGoogleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    console.log("Starting Google authentication...");

    const result = await signInWithPopup(auth, basicGoogleProvider);
    console.log("Google authentication successful");

    const user = result.user;
    console.log("Firebase user:", user.displayName);

    return { user };
  } catch (error) {
    console.error("Google authentication failed:", error);

    if (error.code === "auth/popup-blocked") {
      alert("Popup blocked. Please allow popups for this site.");
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

export async function signInWithEmail(email, password) {
  try {
    console.log("Starting email authentication...");

    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email authentication successful");

    const user = result.user;
    console.log("Firebase user:", user.email);

    return { user };
  } catch (error) {
    console.error("Email authentication failed:", error);

    if (error.code === "auth/user-not-found") {
      alert("No account found with this email. Please sign up first.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email address.");
    } else if (error.code === "auth/user-disabled") {
      alert("This account has been disabled.");
    } else if (error.code === "auth/too-many-requests") {
      alert("Too many failed attempts. Please try again later.");
    } else {
      alert(`Authentication failed: ${error.message}`);
    }
    throw error;
  }
}

export async function signUpWithEmail(email, password) {
  try {
    console.log("Starting email registration...");

    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Email registration successful");

    const user = result.user;
    console.log("Firebase user:", user.email);

    return { user };
  } catch (error) {
    console.error("Email registration failed:", error);

    if (error.code === "auth/email-already-in-use") {
      alert(
        "An account with this email already exists. Please sign in instead."
      );
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please choose a stronger password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email address.");
    } else {
      alert(`Registration failed: ${error.message}`);
    }
    throw error;
  }
}

export async function signInWithGoogleAndGetCalendarAccess() {
  try {
    console.log("Starting Google authentication with calendar access...");

    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google authentication with calendar access successful");

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
    console.error("Google authentication with calendar access failed:", error);

    if (error.code === "auth/popup-blocked") {
      alert("Popup blocked. Please allow popups for this site.");
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

export async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    alert(`Error signing out: ${error.message}`);
    throw error;
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
