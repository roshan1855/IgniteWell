// demoFormHandler.js (This file runs in the user's browser)

document.addEventListener('DOMContentLoaded', () => {
    // Get references to the form and the message display area
    const demoBookingForm = document.getElementById('demoBookingForm');
    const formMessage = document.getElementById('formMessage'); // This is the div to display feedback

    // IMPORTANT: This URL is for your deployed HTTP Cloud Function.
    // Replace this placeholder with the actual URL you get after deploying your
    // `submitDemoRequest` function (from functions/src/demoPageValidation.js).
    // Example: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/submitDemoRequest
    const CLOUD_FUNCTION_ENDPOINT = 'https://us-central1-ignite-873b7.cloudfunctions.net/submitDemoRequest';

    // Add an event listener for when the form is submitted
    demoBookingForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the browser's default form submission behavior

        // Provide immediate visual feedback to the user that the request is being processed
        formMessage.textContent = 'Submitting demo request...';
        formMessage.style.color = 'orange'; // Change text color to indicate pending state

        // Collect form data from the input fields.
        // We'll also trim whitespace from string inputs and parse the class to an integer.
        const formData = {
            name: demoBookingForm.elements.name.value.trim(),           // Get student name, trim whitespace
            studentClass: parseInt(demoBookingForm.elements.age.value), // Get student class, parse to integer
            email: demoBookingForm.elements.email.value.trim(),         // Get email, trim whitespace
            phone: demoBookingForm.elements.phone.value.trim(),         // Get phone, trim whitespace
            // Include a client-side timestamp. The server-side function will typically
            // add its own server timestamp for data integrity, but this can be useful too.
            clientTimestamp: new Date().toISOString()
        };

        try {
            // Send the collected form data to your Cloud Function using the Fetch API
            const response = await fetch(CLOUD_FUNCTION_ENDPOINT, {
                method: 'POST', // We are sending data, so use the POST method
                headers: {
                    'Content-Type': 'application/json', // Indicate that we are sending JSON data
                },
                body: JSON.stringify(formData), // Convert the JavaScript object into a JSON string
            });

            // Attempt to parse the response from the Cloud Function as JSON.
            // Your Cloud Function is designed to always send back a JSON response.
            const result = await response.json();

            // Check if the HTTP response status is OK (e.g., 200-299)
            if (response.ok) {
                // If the request was successful, display the success message from the function
                formMessage.textContent = result.message || 'Demo request submitted successfully!';
                formMessage.style.color = 'green'; // Set text color to green for success
                demoBookingForm.reset(); // Clear all input fields in the form
            } else {
                // If the response indicates an error (e.g., 400, 409, 500 status codes)
                // Display the error message provided by your Cloud Function
                formMessage.textContent = `Error: ${result.message || 'Something went wrong with your request.'}`;
                formMessage.style.color = 'red'; // Set text color to red for errors
                console.error('Server error response:', result); // Log the full error object for debugging
            }
        } catch (error) {
            // This 'catch' block handles network-related errors (e.g., no internet connection,
            // or if the Cloud Function URL is incorrect/unreachable).
            formMessage.textContent = 'Network error. Please check your internet connection or try again later.';
            formMessage.style.color = 'red'; // Set text color to red for network errors
            console.error('Fetch error during form submission:', error); // Log the specific error details
        }
    });
});
