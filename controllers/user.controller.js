const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.createUser = async function(req, res) {
    try {

        let user = await UserModel.findOneAndUpdate({'name':req.body.email}, req.body, {upsert:true,new: true,runValidators: true, setDefaultsOnInsert: true});

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.getAllUsers = async function(req, res) {
    res.status(501).json({'message':'not implemented'})
};

exports.getUserById = async function(req, res) {
    res.status(501).json({'message':'not implemented'})
};

exports.updateUser = async function(req, res) {
    res.status(501).json({'message':'not implemented'})
};
