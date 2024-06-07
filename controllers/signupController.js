const CryptoJS = require('crypto-js');
const User = require("../model/user.model");

const singupHandler = async (req, res) => {
    try {
        const { number, email } = req.body;

        const existingUserByNumber = await User.findOne({ number });
        const existingUserByEmail = await User.findOne({ email });

        if (existingUserByNumber) {
            return res.json({
                message: "User already created, try a unique Number"
            });
        }

        if (existingUserByEmail) {
            return res.json({
                message: "User already exists with this Email"
            });
        }

        const newUser = new User({
            username: req.body.username,
            number: req.body.number,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString()
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        console.log("User created successfully : ", savedUser);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Error creating a user" });
    }
}

module.exports = singupHandler;
