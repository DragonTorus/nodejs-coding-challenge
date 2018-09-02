const UserModel = require('../models/user.model');
const {isTokenStillValidByTimeLimit} = require('../helpers/authenticationHelpers');
const maxValidTimeInSeconds = require('../config').tokenSettings.accessToken.maxValidTimeInSeconds;
const {matiError, errorResponseHandler} = require('../helpers/errorHandler');

exports.isAuthenticated = async function (req, res, next) {
    try {
        const token = getTokenFromAuthorizationHeader(req);
        let user = await UserModel.findOne({'accessToken.token': token});
        if (!user){
            throw new matiError('Access token not found', 'NotFound', 404);
        }
        if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, maxValidTimeInSeconds)){
            throw new matiError('Access Token expired, please use your refresh token to get new access token', 'Unauthorized', 401);
        }
        next();
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

function getTokenFromAuthorizationHeader(req) {
    if (!req.headers.authorization){
        throw new Error('Authorization is missing');
    }
    const parts = req.headers.authorization.match(/^(Bearer)\s([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$/i);
    if (!parts || !parts.length === 0){
        throw new Error('Invalid authorization header detected');
    }
    return parts[2];
}
