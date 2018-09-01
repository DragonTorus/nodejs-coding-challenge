const UserModel = require('../models/user.model');
const {isTokenStillValidByTimeLimit} = require('../helpers/authenticationHelpers');
const maxValidTimeInSeconds = require('../config').tokenSettings.accessToken.maxValidTimeInSeconds;
exports.isAuthenticated = async function (req, res, next) {
    try {
        const token = getTokenFromAuthorizationHeader(req);
        let user = await UserModel.findOne({'accessToken.token': token});
        if (!user){
            throw new Error('Access token not found');
        }
        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, maxValidTimeInSeconds)){
            throw new Error('Access token has expired, please refresh access token');
        }
        next();
    } catch (e) {
        return res.json(e);
    }
};

function getTokenFromAuthorizationHeader(req) {
    if (!req.headers.authorization){
        throw new Error('Authorization is missing');
    }
    const parts = req.headers.authorization.match(/^(Bearer)\s([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$/i);
    if (!parts.length === 0){
        throw new Error('Invalid authorization header detected');
    }
    return parts[2];
}
