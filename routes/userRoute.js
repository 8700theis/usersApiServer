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
router.post('/', upload.single("userImage"), (req, res) => {
    const { name } = req.body;
    const userModel = new User({
        name: name,
        userImage: req.file.path
    });
    try {
        let usernameExists = User.findOne({ name: name }, (err, existingUser) => {
            if (existingUser === null) {
                const savedUser = userModel.save();
                res.send({ message: 'Bruger er oprettet.' });
            } else {
                res.send({ message: 'Bruger med dette brugernavn eksistere allerede' });
            }
        });
    } catch (err) {
        res.json({ message: err });
    }
});

//Delete user by id
router.delete('/:userId', async(req, res) => {
    try {
        const removedUser = await User.deleteOne({ _id: req.params.userId });
        res.send({ message: 'Bruger er slettet.' });
    } catch (error) {
        res.json({ message: err });
    }
});

//Update user by ID
router.patch('/:username', upload.single("userImage"), (req, res) => {
    const { name } = req.body;
    try {
        //Kig efter om det nye brugernavn eksisterer
        const findUserName = User.findOne({ name: req.params.name }, (err, user) => {
            if (user === null) {
                const updateUser = User.updateOne({ name: req.params.username }, {
                    $set: {
                        name: name,
                        userImage: req.file.path,
                    }
                }, (err, data) => {
                    res.send({ message: 'Bruger opdateret.' });
                });
            } else {
                res.send({ message: 'Brugernavnet eksistere allerede.' });
            }
        });

    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;