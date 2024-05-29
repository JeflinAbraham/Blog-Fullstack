import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGOURI)
.then(() => {
    console.log("mongoDb is connected");
})
.catch((err) => {
    console.log(err);
})

const app = express();
app.use(express.json({limit:"16Kb"}));

app.listen(3000, () => {
    console.log("listening to port 3000!");
})
app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);


//middleware for handling errors
//in Express.js, error handling middleware functions are defined with four parameters: (err, req, res, next). This signature allows Express to recognize them as error handling middleware functions.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
