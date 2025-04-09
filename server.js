const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// 🔗 MongoDB connection
mongoose.connect('mongodb+srv://s2rajputgaming:singhsagarkumar@temp.imyqdme.mongodb.net/feedback-app?retryWrites=true&w=majority&appName=temp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// 📄 Define Mongoose model
const Feedback = mongoose.model('Feedback', {
  name: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// 🧠 Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// 📨 Route to handle form submission
app.post('/submit-feedback', async (req, res) => {
  const { name, message } = req.body;

  try {
    const feedback = new Feedback({ name, message });
    await feedback.save();
    res.send(`<h2>Thank you, ${name}! Your feedback has been saved to MongoDB.</h2>`);
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).send('Something went wrong.');
  }
});

// 🚀 Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
app.get('/all-feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    
    let html = `
      <h1>All Feedbacks</h1>
      <ul>
        ${feedbacks.map(f => `<li><strong>${f.name}</strong>: ${f.message} <em>(${f.createdAt.toLocaleString()})</em></li>`).join('')}
      </ul>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('Failed to load feedbacks');
  }
});
