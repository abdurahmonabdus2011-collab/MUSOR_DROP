const Joi = require('joi');

// enum qiymatlari skins.model.js dagi bilan bir xil bo'lishi kerak
const skinValidation = Joi.object({
    skinName: Joi.string()
        .min(3)
        .max(100)
        .required(),

    skinRarity: Joi.string()
        .valid('Common', 'Rare', 'Epic', 'Legendary', 'Mythic')
        .required(),

    skinPrice: Joi.number()
        .min(0.1)
        .required(),

    imageUrl: Joi.string()
        .allow('', null)
        .optional()
});

// PATCH uchun: barcha maydonlar ixtiyoriy, lekin kamida bittasi yozilishi shart
const skinUpdateValidation = Joi.object({
    skinName: Joi.string()
        .min(3)
        .max(100),

    skinRarity: Joi.string()
        .valid('Common', 'Rare', 'Epic', 'Legendary', 'Mythic'),

    skinPrice: Joi.number()
        .min(0.1),

    imageUrl: Joi.string()
        .allow('', null)
        .optional()
}).min(1);

module.exports = {
    skinSchema: skinValidation,
    skinUpdateSchema: skinUpdateValidation,
};