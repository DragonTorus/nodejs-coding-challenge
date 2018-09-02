const uuid = require('uuid/v4');
const {getStringHash} = require('../services/bcryptService');
const UserModel = require('../models/user.model');
const TokenModel = require('../models/token.model');
const {compareStringAndHash} = require('../services/bcryptService');
const config = require('../config');
const TokenTypes = config.tokenSettings.types;
const refreshMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.refresh].maxValidTimeInSeconds;
const accessMaxValidTimeInSeconds = config.tokenSettings[TokenTypes.access].maxValidTimeInSeconds;
const {isTokenStillValidByTimeLimit, updateTokenByTypeIfExpired} = require('../helpers/authenticationHelpers');
const {matiError} = require('../helpers/errorHandler');

exports.authenticateUserApi = async function(data) {
    if (!data.email || !data.password){
        throw new matiError('Required data "email" or "password" is not defined', 'BadRequest', 400);
    }

    let user = await UserModel.findOne({email: data.email});

    if (!user){
        throw new matiError('User Not found', 'NotFound', 404);
    }

    if (!(await compareStringAndHash(data.password, user.password))){
        throw new matiError('Wrong password', 'Unauthorized', 401);
    }

    if (!isTokenStillValidByTimeLimit(user.accessToken.createdAt, accessMaxValidTimeInSeconds)){
        user = await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.access);
    }

    return await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.refresh);
};

exports.refreshAccessTokenApi = async function(data) {
        if (!data.email || !data.token){
            throw new matiError('Required data "email" or "token" is not defined', 'BadRequest', 400);
        }

        let user = await UserModel.findOne({email: data.email, 'refreshToken.token': data.token});

        if (!user){
            throw new matiError('User Not found', 'NotFound', 404);
        }

        if (!isTokenStillValidByTimeLimit(user.refreshToken.createdAt, refreshMaxValidTimeInSeconds)){
            throw new matiError('Refresh Token expired, please authenticate with your email and password to get new refresh token.', 'Unauthorized', 401);
        }

        return await updateTokenByTypeIfExpired(UserModel, user, TokenTypes.access);
};

exports.createUserApi = async function(data) {
        if (!data.email || !data.password){
            throw new matiError('Required data "email" or "password" is not defined', 'BadRequest', 400);
        }

        let User = new UserModel(data);
        User.accessToken = new TokenModel({token:uuid()});
        User.refreshToken = new TokenModel({token:uuid()});
        User.password = await getStringHash(data.password);

        return await UserModel.create(User);
};

exports.getAllUsersApi = async function() {
        let users = await UserModel.find();
        if (!users){
            throw new matiError('User Not found', 'NotFound', 404);
        }
        return users;
};

exports.getUserByIdApi = async function(id) {
    if (!id){
        throw new matiError('Required data "id" is not defined', 'BadRequest', 400);
    }

    let user = await UserModel.findById(id);
    if (!user){
        throw new matiError('User Not found', 'NotFound', 404);
    }
    return user;
};

exports.updateUserApi = async function(data, id) {
    if (Object.keys(data).length===0 || !id){
        throw new matiError('Required data to update is missing or path param "id" is not defined', 'BadRequest', 400);
    }

    if (data.password){
        data.password = await getStringHash(data.password);
    }

    return await UserModel.findOneAndUpdate({'_id':id}, data,
        {new: true,runValidators: true, setDefaultsOnInsert:true}
    );
};
