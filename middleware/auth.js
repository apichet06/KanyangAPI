const jwt = require('jsonwebtoken');
const Messages = require('../config/messages');
require('dotenv');

class auth {
    static async authenticateToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: Messages.error, Message: Messages.notToken });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: Messages.error, Message: Messages.invalidToken });
            }
            req.userId = decoded.userId;
            next();
        });
    }
}

module.exports = auth;