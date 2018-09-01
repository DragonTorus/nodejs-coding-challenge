const moment = require('moment');
const config = require('../config');
const uuid = require('uuid/v4');

function isTokenStillValidByTimeLimit(createdAt, maxValidTimeInSeconds) {
    let creationTime = moment(createdAt);
    if (!creationTime.isValid()){
        throw new Error('Invalid time specified');
    }

    return isTokenObsolete(getValidTillMoment(creationTime, maxValidTimeInSeconds));

    function getValidTillMoment(createdAtMoment, timeValidAfterCreation) {
        return createdAtMoment.add(timeValidAfterCreation,'seconds');
    }
    function isTokenObsolete(validTillMoment) {
        return validTillMoment.isAfter(moment());
    }
}

exports.isTokenStillValidByTimeLimit = isTokenStillValidByTimeLimit;

async function updateTokenByTypeIfExpired(UserModel , CurrentUser, TokenType) {
    if (isTokenStillValidByTimeLimit(CurrentUser[TokenType].createdAt, config.tokenSettings[TokenType])){
        return CurrentUser;
    }

    CurrentUser[TokenType].token = uuid();
    CurrentUser[TokenType].createdAt = new Date();
    return await UserModel.findOneAndUpdate({'_id':CurrentUser._id}, CurrentUser,{new: true,runValidators: true});
}
exports.updateTokenByTypeIfExpired = updateTokenByTypeIfExpired;

