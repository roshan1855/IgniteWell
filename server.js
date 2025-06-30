const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, images)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});