const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const User = require("../model/user.model");
// const intRedis = require('../client');
// let client;
const {intRedis} = require('../client')

let {client} = require('../client');


const loginHandler = async (req, res) => {
    try {
     
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }

        const { number, password } = req.body;
    
        const cachedUser = await client?.get(`user:${number}`);

        let user;

        if (cachedUser) {
        
            user = JSON.parse(cachedUser);
        
            user = await User.findOne({ number });

            if (!user) {
                return res.status(401).json({ message: "Incorrect Mobile Number" });
            }

         
            await client?.set(`user:${number}`,JSON.stringify(user),{EX:3600});
        }

      
        const decodedPassword = CryptoJS.AES.decrypt(user.password,'bharathkumar').toString(CryptoJS.enc.Utf8);

        if (decodedPassword !== password) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

    
        const { password: _, ...rest } = user._doc;

   
        const accessToken = jwt.sign({ username: user.username },'MY_SUPER_SECRET_KEY');

        
        res.json({ ...rest, accessToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = loginHandler;
