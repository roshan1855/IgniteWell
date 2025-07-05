import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";

initializeApp();
// Firestore database reference
const db = getFirestore();

// Cloud Function to handle demo booking form submissions
export const submitDemoRequest = functions.https.onRequest(async (req, res) => {
  // CORS configuration (important for web apps accessing your function)
  res.set("Access-Control-Allow-Origin", "https://ignite-873b7.web.app"); // Allow requests from your Hosting URL
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle pre-flight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405)
        .json({message: "Method Not Allowed. Please use POST."});
  }

  // Ensure request body is present and in JSON format
  if (!req.body) {
    return res.status(400).json({message: "Request body is empty."});
  }

  const {studentName, studentClass, email, phone, timestamp} = req.body;

  // Basic validation (you'd want more robust validation for production)
  if (!studentName || !studentClass || !email) {
    return res.status(400)
        .json({message: "Student Name, Class, and Email are required."});
  }

  try {
    // Add data to a new collection called 'demoRequests'
    const docRef = await db.collection("demoRequests").add({
      studentName,
      studentClass,
      email,
      phone: phone || null, // Store phone or null if not provided
      clientTimestamp: timestamp || null, // Save client-provided timestamp
      submissionTime: FieldValue.serverTimestamp(),
    });

    console.log("Document written with ID: ", docRef.id);
    return res.status(200)
        .json({message: "Demo request successfully saved!.",
          documentId: docRef.id});
  } catch (error) {
    console.error("Error adding document:", error);
    return res.status(500)
        .json({message: "Failed to save demo request.",
          error: error.message});
  }
});
