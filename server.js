const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static HTML/CSS/JS files from the same directory
app.use(express.static(path.join(__dirname, '')));

// In-memory Database for Demo Purposes
const users = []; // { name, email, password }
const pgListings = []; // Added properties will go here

// =======================
// AUTHENTICATION ROUTES
// =======================

// Sign Up Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Save user
    const newUser = { name, email, password };
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully!', user: { name, email } });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
});

// =======================
// PG LISTINGS ROUTES
// =======================

// Add PG Route
app.post('/api/pg', (req, res) => {
    const pgData = req.body;
    pgData.id = Date.now();
    pgListings.push(pgData);
    res.status(201).json({ message: 'PG Listing added successfully!', data: pgData });
});

// Get PGs Route
app.get('/api/pg', (req, res) => {
    res.status(200).json(pgListings);
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`Backend Server is running on http://localhost:${PORT}`);
    console.log(`You can now open http://localhost:${PORT}/index.html`);
    console.log(`==============================================\n`);
});
