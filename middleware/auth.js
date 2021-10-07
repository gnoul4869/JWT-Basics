require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../errors');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username } = decoded;
        req.user = { id, username };
        next();
    } catch (error) {
        throw new AuthenticationError(
            'You are not authorized to access this data'
        );
    }
};

module.exports = authMiddleware;
