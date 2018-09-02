const ApiModule = require('../modules/api.module');
const {errorResponseHandler} = require('../helpers/errorHandler');

exports.authenticateUser = async function(req, res) {
    try {
        let user = await ApiModule.authenticateUserApi(req.body);
        res.json({
            name:user.name,
            email:user.email,
            accessToken:user.accessToken.token,
            refreshToken:user.refreshToken.token
        });
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.refreshAccessToken = async function(req, res) {
    try {
        let user = await ApiModule.refreshAccessTokenApi(req.body);
        res.json({
            name:user.name,
            email:user.email,
            accessToken:user.accessToken.token
        });
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};
