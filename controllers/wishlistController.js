const Wishlist = require("../model/wishlist.model");
const {intRedis} = require('../client')

let {client} = require('../client');


const createWishlistHandler = async (req, res) => {
    try {
        
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }

        const newWishlist = new Wishlist(req.body);
        const savedWishlist = await newWishlist.save();
        const wishlist = await Wishlist.find({});
        await client?.set('wishlist', JSON.stringify(wishlist),{EX:3600});

        res.status(201).json(savedWishlist);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "failed to create wishlist" });
    }
};

const deleteWishlistHandler = async (req, res) => {
    try {
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }
        await Wishlist.findByIdAndDelete(req.params.id);
        await client?.del('wishlist');

        res.json({ message: "Hotel Deleted From Wishlist" });
    } catch (err) {
        res.status(500).json({ message: "Could not delete hotel from wishlist" });
    }
};

const getWishlistHandler = async (req, res) => {
    try {
        
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }
    
        const cachedWishlist = await client?.get('wishlist');
        if (cachedWishlist) {
            return res.json(JSON.parse(cachedWishlist));
        }

    
        const wishlist = await Wishlist.find({});
        if (!wishlist) {
            return res.json({ message: "No items found in the wishlist" });
        }

        await client?.set('wishlist',JSON.stringify(wishlist),{EX:3600});

        res.json(wishlist);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = { createWishlistHandler, deleteWishlistHandler, getWishlistHandler };