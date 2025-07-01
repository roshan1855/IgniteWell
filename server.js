const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, images)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

// Add this block to serve home.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

function isValidFullName(name) {
  return /^[A-Za-z\s'-]{2,60}$/.test(name);
}

app.post('/join-submit', (req, res) => {
  const joinSubmission = req.body;
  // Server-side validation for fullName
  if (!isValidFullName(joinSubmission.fullName)) {
    return res.status(400).send('Invalid Full Name. Please use only letters, spaces, hyphens, and apostrophes (2-60 characters).');
  }
  joinSubmission.timestamp = new Date().toISOString();
  // ...rest of your code...
});

app.post('/submit', (req, res) => {
  const submission = {
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.phone,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'submissions.json');
  let submissions = [];

  // Read existing submissions
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    submissions = JSON.parse(data);
  }

  // Add new submission
  submissions.push(submission);

  // Save back to file
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

  res.send('<h2>Thank you! Your submission has been saved.</h2><a href="demo-form.html">Back to form</a>');
});

app.post('/join-submit', (req, res) => {
  const joinSubmission = req.body;
  joinSubmission.timestamp = new Date().toISOString();

  const filePath = path.join(__dirname, 'teacherData.json');
  let submissions = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    submissions = JSON.parse(data);
  }

  submissions.push(joinSubmission);

  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

  res.send('<h2>Thank you for joining us! Your details have been saved.</h2><a href="join-us.html">Back to form</a>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});