const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.validateAndSaveDemoRequest = functions
    .https.onCall(async (data, context) => {
      const {name, studentClass, email, phone} = data;

      // --- 1. Validate Student Name ---
      const nameRegex = /^[A-Za-z\s'-]+$/;
      if (typeof name !== "string" || !name.trim() ||
      !nameRegex.test(name.trim())) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Student name can only contain letters, spaces, hyphens, and "+
            "apostrophes.No numbers or special characters, please!",
        );
      }

      // --- 2. Validate Student Class ---
      const parsedStudentClass = parseInt(studentClass);
      if (isNaN(parsedStudentClass) ||
       parsedStudentClass < 1 || parsedStudentClass > 12) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Student class must be a number between 1 and 12.",
        );
      }

      // --- 3. Validate Student Email ID ---
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (typeof email !== "string" || !email.trim() ||
       !emailRegex.test(email.trim())) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Please enter a valid email address (e.g., user@example.com).",
        );
      }

      // --- 4. Validate Phone Number ---
      const phoneRegex = /^\d{10}$/;
      if (typeof phone !== "string" || !phone.trim() ||
      !phoneRegex.test(phone.trim())) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Phone number must be exactly 10 digits long.",
        );
      }

      try {
        const emailQuerySnapshot = await db
            .collection("demoRequests")
            .where("email", "==", email.trim()).get();
        if (!emailQuerySnapshot.empty) {
          throw new functions.https.HttpsError(
              "already-exists",
              "This email address has already been used for a demo "+
              "request.Please use a different one or contact us.",
          );
        }

        const phoneQuerySnapshot = await db
            .collection("demoRequests")
            .where("phone", "==", phone.trim()).get();
        if (!phoneQuerySnapshot.empty) {
          throw new functions.https.HttpsError(
              "already-exists",
              "This phone number has already been used for a demo request."+
              "Please use a different one or contact us.",
          );
        }

        // All validations passed and unique! Save to Firestore.
        const newDemoRequest = {
          name: name.trim(),
          studentClass: parsedStudentClass,
          email: email.trim(),
          phone: phone.trim(),
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("demoRequests").add(newDemoRequest);

        console.log("New demo request saved:", newDemoRequest);

        return {success: true,
          message: "Your demo request has been received."+
          "We will contact you shortly!"};
      } catch (error) {
        if (error.code && error.details) {
          throw error;
        } else {
          console.error("Error during demo request processing:", error);
          throw new functions.https.HttpsError(
              "internal",
              "An unexpected server error occurred. Please try again later.",
              error.message,
          );
        }
      }
    });
