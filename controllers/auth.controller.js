const UserModel = require('../models/user.model');
const {compareStringAndHash} = require('../services/bcryptService');
const {isTokenStillValidByTimeLimit} = require('../helpers/authenticationHelpers');
const config = require('../config');

exports.authenticateUser = async function(req, res) {
    try {
        let user = await UserModel.findOne({email: req.body.email});
        if (!user){
            throw new Error('User Not found');
        }

        if (!(await compareStringAndHash(req.body.password, user.password))){
            throw new Error('Wrong password');
        }

        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, config.tokenSettings.access)){
            throw new Error('Token expired, please use your refresh token to get new access token');
        }

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.refreshAccessToken = async function(req, res) {
    res.status(501).json({'message':'not implemented'});
};
