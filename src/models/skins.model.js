const mongoose = require('mongoose')

const skinSchema = new mongoose.Schema({
    skinName: {type: String, required: true},
    skinRarity:{type: String, required: true, enum:['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']},
    skinPrice:{type: Number, required: true},
    // Skin namoyishi uchun rasm URL (Steam CDN yoki boshqa CDN dan)
    imageUrl: { type: String, default: '' }
})

const Skin = mongoose.model('Skin', skinSchema);

module.exports = Skin;