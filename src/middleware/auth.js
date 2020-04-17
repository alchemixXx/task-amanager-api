const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const jwtSecretPhrase = process.env.JWT_SECRET_PHRASE;

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecretPhrase);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
          throw new Error('Unable to login');
        }

        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send({error: "Please, authenticate"})
    }
}

module.exports = {auth}