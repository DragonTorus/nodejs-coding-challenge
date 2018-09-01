const UserModel = require('../models/user.model');
const {compareStringAndHash} = require('../services/bcryptService');
const config = require('../config');
const TokenTypes = config.tokenSettings.types;
const refreshMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.refresh].maxValidTimeInSeconds;
const accessMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.access].maxValidTimeInSeconds;
const {isTokenStillValidByTimeLimit, updateTokenByTypeIfExpired} = require('../helpers/authenticationHelpers');


exports.authenticateUser = async function(req, res) {
    try {
        let user = await UserModel.findOne({email: req.body.email});
        if (!user){
            throw new Error('User Not found');
        }

        if (!(await compareStringAndHash(req.body.password, user.password))){
            throw new Error('Wrong password');
        }

        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, accessMaxValidTimeInSeconds)){
            throw new Error('Token expired, please use your refresh token to get new access token');
        }

        user = await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.refresh);

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.refreshAccessToken = async function(req, res) {
    try {
        let user = await UserModel.findOne({email: req.body.email});
        if (!user){
            throw new Error('User Not found');
        }

        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, refreshMaxValidTimeInSeconds)){
            throw new Error('Refresh Token expired, please authenticate with your email and password to get new refresh token.');
        }

        user = await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.access);

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};
