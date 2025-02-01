const { createClient } = require('redis');

let client;

const intRedis = async () => {
    if (!client) {
        client = createClient({
            url: 'redis://:mypassword@localhost:6379'
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
