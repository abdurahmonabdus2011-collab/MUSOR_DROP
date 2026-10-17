const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseName: {
        type: String,
        required: [true, 'Case name majburiy'],
        trim: true
    },
    casePrice: {
        type: Number,
        required: [true, 'Case price majburiy'],
        // Narx noldan katta bolishi shart
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Case price 0 dan katta bolishi kerak'
        }
    },
    imageUrl: {
        type: String,
        trim: true,
        default: ''
    },
    // Har bir element: skin (Skin modeliga havola) va chance (0-100)
    skins: [{
        skin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skin',
            required: true
        },
        chance: {
            type: Number,
            required: true,
            min: [0, 'Chance 0 dan kichik bolmasin'],
            max: [100, 'Chance 100 dan katta bolmasin']
        }
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

// Skins ichidagi barcha chance lar yig'indisi 100 ga teng bolishi tekshiriladi
caseSchema.pre('validate', function () {
    if (this.skins && this.skins.length > 0) {
        const totalChance = this.skins.reduce((sum, s) => sum + (s.chance || 0), 0);
        if (totalChance !== 100) {
            throw new Error(`Skins ichidagi chancelar yig'indisi 100 ga teng bolishi kerak. Hozirgi: ${totalChance}%`);
        }
    }
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
