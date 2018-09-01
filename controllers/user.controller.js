const UserModel = require('../models/user.model');
const {getStringHash} = require('../services/bcryptService');

exports.createUser = async function(req, res) {
    try {
        if (!req.body.email || !req.body.password){
            throw new Error('Required data is not defined');
        }

        req.body.password = await getStringHash(req.body.password);

        let user = await UserModel.findOneAndUpdate({'name':req.body.email}, req.body,
                {upsert:true,new: true,runValidators: true, setDefaultsOnInsert: true}
            );

        res.json(user);
    } catch (e) {
        return res.json(e);
    }
};

exports.getAllUsers = async function(req, res) {
    res.status(501).json({'message':'not implemented'});
};

exports.getUserById = async function(req, res) {
    res.status(501).json({'message':'not implemented'});
};

exports.updateUser = async function(req, res) {
    res.status(501).json({'message':'not implemented'});
};
