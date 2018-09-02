const ApiModule = require('../modules/api.module');
const {errorResponseHandler} = require('../helpers/errorHandler');


exports.createUser = async function(req, res) {
    try {
        let user = await ApiModule.createUserApi(req.body);
        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.getAllUsers = async function(req, res) {
    try {
        let users = await ApiModule.getAllUsersApi()
        res.json(users);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.getUserById = async function(req, res) {
    try {
        let user = await ApiModule.getUserByIdApi(req.params.id);
        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.updateUser = async function(req, res) {
    try {
        let user = await ApiModule.updateUserApi(req.body, req.params.id);
        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};
