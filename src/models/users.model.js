const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username majburiy'],
        unique: true,
        trim: true,
        minlength: [3, 'Username kamida 3 belgidan iborat bo\'lishi kerak'],
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'Email majburiy'],
        unique: true,
        trim: true,
        lowercase: true,
        // Oddiy email formati tekshiruvi
        match: [/^\S+@\S+\.\S+$/, 'Email formati tog\'ri emas']
    },
    password: {
        type: String,
        required: [true, 'Password majburiy'],
        minlength: [6, 'Password kamida 6 belgidan iborat bo\'lishi kerak'],
        select: false // API javoblarida parol hech qachon chiqib ketmasligi uchun
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role faqat "user" yoki "admin" bolishi mumkin'
        },
        default: 'user'
    },
    wallet: {
        type: Number,
        default: 0,
        min: [0, 'Wallet manfiy bolishi mumkin emas']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

// Parol turgicha saqlanmasligi uchun saqlashdan oldin bcrypt bilan hash qilamiz
userSchema.pre('save', async function () {
    // Parol ozgarganda (yoki yangi user yaratilganda) hash qilamiz
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Parolni tekshirish uchun qulay metod (loginda ishlatiladi)
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// toJSON chaqrilganda parolni javobdanolib tashlaymiz
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
