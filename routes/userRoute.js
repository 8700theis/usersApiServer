const express = require('express');
const router = express.Router();
//Multer er en middleware der parser bodyens file date i stedet for field data
const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/userImages/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

//Get alle the Users
router.get('/', async(req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        res.json({ message: err });
    }
});

//Get single User by id
router.get('/:userId', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (error) {
        res.json({ message: err });
    }
});

//Create a user
router.post('/', upload.single("userImage"), async(req, res) => {
    const { name } = req.body;
    const userModel = new User({
        name: name,
        userImage: req.file.path,
    });
    try {
        const savedUser = await userModel.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message: err });
    }
});

//Delete user by id
router.delete('/:userId', async(req, res) => {
    try {
        const removedUser = await User.deleteOne({ _id: req.params.userId });
        res.json(removedUser);
    } catch (error) {
        res.json({ message: err });
    }
});

module.exports = router;