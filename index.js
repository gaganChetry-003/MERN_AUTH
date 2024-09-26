
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import authRoute from './routes/authRoute.js'

dotenv.config();

const app = express();



const PORT = process.env.PORT || 4001;




app.use(express.json())
app.use('/api/auth', authRoute)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is up on PORT ${PORT}`)
})
