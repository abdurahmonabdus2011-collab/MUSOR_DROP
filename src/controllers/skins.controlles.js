const Skin = require('../models/skins.model')

const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

exports.getAllSkins = async (req, res) => {
    try{
        const skins = await Skin.find()
        res.status(200).json(skins)
    } catch (error) {
        res.status(500).json({message: 'Error fetching skins'})
    }
}

exports.createSkin = async (req, res) => {
    try{
        const newSkin = new Skin(req.body)
        const savedSkin = await newSkin.save()
        res.status(201).json(savedSkin)
    } catch (error){
        res.status(400).json({message: error.message})
    }
}
exports.updateSkin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!MONGO_ID_REGEX.test(id)) {
            return res.status(400).json({ message: 'ID notogri formatda' });
        }

        // validate middleware body tozalagan; skinName/skinRarity/skinPrice/imageUrl olinadi
        const { skinName, skinRarity, skinPrice, imageUrl } = req.body;
        const updates = {};
        if (skinName !== undefined) updates.skinName = skinName;
        if (skinRarity !== undefined) updates.skinRarity = skinRarity;
        if (skinPrice !== undefined) updates.skinPrice = skinPrice;
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Yangilash uchun malumot yuborilmadi' });
        }

        const updatedSkin = await Skin.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedSkin) {
            return res.status(404).json({ message: 'Skin topilmadi' });
        }

        res.status(200).json({ message: 'Skin yangilandi', skin: updatedSkin });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validatsiya xatosi', error: error.message });
        }
        res.status(500).json({ message: 'Skinga yangilashda xatolik', error: error.message });
    }
};

exports.deleteSkin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!MONGO_ID_REGEX.test(id)) {
            return res.status(400).json({ message: 'ID notogri formatda' });
        }

        const deletedSkin = await Skin.findByIdAndDelete(id);

        if (!deletedSkin) {
            return res.status(404).json({ message: "Skin topilmadi" });
        }

        res.status(200).json({ message: "Skin o'chirildi" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting skin" });
    }
};