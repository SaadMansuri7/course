import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyToken from './middlewere/middlewere.js';
import admin from 'firebase-admin';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
});

app.get('/api/secure', verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.user.email}, you're authenticated!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
