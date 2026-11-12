const express = require('express');
const cors = require('cors');
require('dotenv').config();

const caseRoutes = require('./routes/caseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to parse form-urlencoded request bodies

// API Routes
app.use('/api/v1/cases', caseRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Graahak AI Backend is running successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});