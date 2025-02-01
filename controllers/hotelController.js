const Hotel = require("../model/hotel.model");
const {intRedis} = require('../client')

let {client} = require('../client');

const getAllHotelHandler = async (req, res) => {
    const hotelCategory = req.query.category;  

    try {
      
        if(!client){
            client = await intRedis();
            console.log('redis client is not intialized');
            console.log('now redis is initialized');
         }

        let hotels;
        const redisKey = hotelCategory ? `hotels:${hotelCategory}` : 'hotels';

       
        const cachedHotels = await client?.get(redisKey);

        if (cachedHotels) {
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedHotels));
        }

        if (hotelCategory) {
            hotels = await Hotel.find({ category: hotelCategory });
        } else {
            hotels = await Hotel.find({});
        }

        if (!hotels || hotels.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        
        await client?.set(redisKey, JSON.stringify(hotels), { EX: 3600 });
        

        return res.json(hotels);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching hotels data" });
    }
};

module.exports = getAllHotelHandler;
