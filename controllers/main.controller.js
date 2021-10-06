require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new CustomAPIError('Please provide username and password', 400);
    }

    // ! For demo purpose only
    const id = new Date().getDate();

    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    console.log(token);
    res.status(200).json({ msg: `User created`, token });
};

const dashBoard = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomAPIError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const luckyNumber = Math.floor(Math.random() * 100);
        res.status(200).json({
            msg: `Hello, ${decoded.username}`,
            secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
        });
    } catch (error) {
        throw new CustomAPIError(
            'You are not authorized to access this data',
            401
        );
    }
};

module.exports = { login, dashBoard };
