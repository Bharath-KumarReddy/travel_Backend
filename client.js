const { createClient } = require('redis');
const dotenv = require('dotenv')
dotenv.config();
let client;

const intRedis = async () => {
    if (!client) {
        client = createClient({
            url: process.env.REDIS_URL
        });

        client.on('error', (err) => console.error('Error on creating Redis client:', err));

        try {
            await client.connect();
            console.log('Successfully connected to Redis');
        } catch (error) {
            console.error('Error connecting to Redis:', error);
            throw error;
        }
    }
    return client;
};

module.exports = { intRedis, client };
