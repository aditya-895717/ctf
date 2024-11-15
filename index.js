import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import authRoutes from './routes/auth.route.js';
import scoreRoutes from './routes/score.route.js';
import testControlRoutes from './routes/test.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Mongodb is connected');
}).catch((err) => {
  console.log(err);
});

const __dirname = path.resolve();
const app = express();
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (for FormData)

app.use(cors({
  origin: ' http://localhost:5173/', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.use('/api/auth', authRoutes); 
app.use('/api/score', scoreRoutes); 
app.use('/api/test', testControlRoutes)


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
})
