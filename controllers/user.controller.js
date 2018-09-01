const UserModel = require('../models/user.model');
const TokenModel = require('../models/token.model');
const {getStringHash} = require('../services/bcryptService');
const uuid = require('uuid/v4');

exports.createUser = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password){
            throw new Error('Required data is not defined');
        }

        let User = new UserModel(req.body);
        User.accessToken = new TokenModel({token:uuid()});
        User.refreshToken = new TokenModel({token:uuid()});
        User.password = await getStringHash(req.body.password);

        let user = await UserModel.create(User);

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.getAllUsers = async function(req, res) {
    try {
        let users = await UserModel.find();
        if (!users){
            throw new Error('Entity Not found');
        }
        res.json(users);
    } catch (e) {
        return res.json(e);
    }
};

exports.getUserById = async function(req, res) {
    try {
        let user = await UserModel.findById(req.params.id);
        if (!user){
            throw new Error('Entity Not found');
        }
        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.updateUser = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password){
            throw new Error('Required data is not defined');
        }

        req.body.password = await getStringHash(req.body.password);

        let user = await UserModel.findOneAndUpdate({'_id':req.params.id}, req.body,
            {new: true,runValidators: true}
        );

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};
