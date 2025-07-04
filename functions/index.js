// functions/index.js

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");

setGlobalOptions({region: "us-central1"});
admin.initializeApp();

const db = admin.firestore();

exports.submitFormData = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    logger.warn("Received non-POST request to submitFormData", {
      method: req.method,
    });
    return res
        .status(405)
        .send("Method Not Allowed. This function only accepts POST requests.");
  }

  if (!req.body) {
    logger.warn("No data provided in the request body for submitFormData");
    return res.status(400).send("No data provided in the request body.");
  }

  try {
    const formData = req.body;
    formData.submissionTime = admin.firestore.FieldValue.serverTimestamp();

    const docRef = await db.collection("formSubmissions").add(formData);

    logger.info(`Form data submitted successfully with ID: ${docRef.id}`, {
      documentId: docRef.id,
      formData,
    });

    return res.status(200).json({
      message: "Form data successfully stored!",
      documentId: docRef.id,
    });
  } catch (error) {
    logger.error("Error submitting form data:", error, {
      requestBody: req.body,
    });
    return res.status(500).send("Error storing form data.");
  }
});
