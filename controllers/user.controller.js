const UserModel = require('../models/user.model');
const TokenModel = require('../models/token.model');
const {getStringHash} = require('../services/bcryptService');
const uuid = require('uuid/v4');
const {matiError, errorResponseHandler} = require('../helpers/errorHandler');

exports.createUser = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password){
            throw new matiError('Required data is not defined', 'BadRequest', 400);
        }

        let User = new UserModel(req.body);
        User.accessToken = new TokenModel({token:uuid()});
        User.refreshToken = new TokenModel({token:uuid()});
        User.password = await getStringHash(req.body.password);

        let user = await UserModel.create(User);

        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.getAllUsers = async function(req, res) {
    try {
        let users = await UserModel.find();
        if (!users){
            throw new matiError('User Not found', 'NotFound', 404);
        }
        res.json(users);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.getUserById = async function(req, res) {
    try {
        let user = await UserModel.findById(req.params.id);
        if (!user){
            throw new matiError('User Not found', 'NotFound', 404);
        }
        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};

exports.updateUser = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password){
            throw new matiError('Required data is not defined', 'BadRequest', 400);
        }

        req.body.password = await getStringHash(req.body.password);

        let user = await UserModel.findOneAndUpdate({'_id':req.params.id}, req.body,
            {new: true,runValidators: true}
        );

        res.json(user);
    } catch (e) {
        return errorResponseHandler(e,res);
    }
};
