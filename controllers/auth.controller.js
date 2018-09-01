const UserModel = require('../models/user.model');
const {compareStringAndHash} = require('../services/bcryptService');
const config = require('../config');
const TokenTypes = config.tokenSettings.types;
const refreshMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.refresh].maxValidTimeInSeconds;
const accessMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.access].maxValidTimeInSeconds;
const {isTokenStillValidByTimeLimit, updateTokenByTypeIfExpired} = require('../helpers/authenticationHelpers');
const {matiError, errorResponseHandler} = require('../helpers/errorHandler');


exports.authenticateUser = async function(req, res) {
    try {
        let user = await UserModel.findOne({email: req.body.email});
        if (!user){
            throw new matiError('User Not found', 'NotFound', 404);
        }

        if (!(await compareStringAndHash(req.body.password, user.password))){
            throw new matiError('Wrong password', 'Unauthorized', 401);
        }

        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, accessMaxValidTimeInSeconds)){
            throw new matiError('Token expired, please use your refresh token to get new access token', 'Unauthorized', 401);
        }

        user = await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.refresh);

        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.refreshAccessToken = async function(req, res) {
    try {
        let user = await UserModel.findOne({email: req.body.email, 'refreshToken.token': req.body.token});
        if (!user){
            throw new matiError('User Not found', 'NotFound', 404);
        }

        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, refreshMaxValidTimeInSeconds)){
            throw new matiError('Refresh Token expired, please authenticate with your email and password to get new refresh token.', 'Unauthorized', 401);
        }

        user = await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.access);

        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};
