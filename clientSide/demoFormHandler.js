const demoBookingForm = document.getElementById('demoBookingForm');
const formMessage = document.getElementById('formMessage'); // Get the message div

// IMPORTANT: This URL will be provided by Firebase after you deploy your Cloud Function.
// We'll replace this placeholder in Step 4.
const CLOUD_FUNCTION_ENDPOINT = 'https://us-central1-ignite-873b7.cloudfunctions.net/submitDemoRequest';

demoBookingForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop the default form submission

  formMessage.textContent = 'Submitting demo request...';
  formMessage.style.color = 'orange'; // Give visual feedback

  // Collect form data
  const formData = {
    studentName: demoBookingForm.elements.name.value,
    studentClass: demoBookingForm.elements.age.value, // 'age' is the name of the class input
    email: demoBookingForm.elements.email.value,
    phone: demoBookingForm.elements.phone.value,
    timestamp: new Date().toISOString() // Add a timestamp
  };

  try {
    const response = await fetch(CLOUD_FUNCTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json(); // Assuming your function sends back JSON

    if (response.ok) {
      formMessage.textContent = 'Demo request submitted successfully!';
      formMessage.style.color = 'green';
      demoBookingForm.reset(); // Clear the form after success
    } else {
      formMessage.textContent = `Error: ${result.message || 'Something went wrong.'}`;
      formMessage.style.color = 'red';
      console.error('Server error:', result);
    }
  } catch (error) {
    formMessage.textContent = 'Network error. Please try again later.';
    formMessage.style.color = 'red';
    console.error('Fetch error:', error);
  }
});
