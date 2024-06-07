const jwt  = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyUser;
