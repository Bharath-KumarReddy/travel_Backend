const CryptoJS = require('crypto-js');
const User = require("../model/user.model");
// const intRedis = require('../client');
// let client;
const {intRedis} = require('../client')

let {client} = require('../client');

const singupHandler = async (req, res) => {
    try {
      
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
        }

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
            password: CryptoJS.AES.encrypt(req.body.password, 'bharathkumar').toString()
        });

     
        const savedUser = await newUser.save();

      
        await client?.set(`user:${savedUser.number}`,JSON.stringify(savedUser),{EX:3600});

      
        res.status(201).json(savedUser);
        console.log("User created and cached successfully : ", savedUser);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Error creating a user" });
    }
};

module.exports = singupHandler;
