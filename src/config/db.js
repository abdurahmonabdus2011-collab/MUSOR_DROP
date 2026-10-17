const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        // MONGODB_URI yoki MONGO_URI (Atlas yoki lokal) — qo'shtirnoqlarni tozalash
        const uri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').replace(/^["']+|["']+$/g, '').trim();
        await mongoose.connect(uri)
        console.log('Connected to MongoDB'); 
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    }
}
module.exports = connectDB;