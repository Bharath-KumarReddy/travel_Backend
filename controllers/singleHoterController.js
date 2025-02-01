const Hotel = require("../model/hotel.model");
// const intRedis = require('../client');
// let client;
const {intRedis} = require('../client')

let {client} = require('../client');

const singlehotelHandler = async (req, res) => {
    try {
    
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }

        const { id } = req.params;

        const cachedHotel = await client?.get(`hotel:${id}`);

        if (cachedHotel) {
            return res.json(JSON.parse(cachedHotel));
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ message: "No hotel found" });
        }


        await client?.set(`hotel:${id}`, JSON.stringify(hotel),{EX:3600});

        res.json(hotel);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching hotel data" });
    }
};

module.exports = singlehotelHandler;
