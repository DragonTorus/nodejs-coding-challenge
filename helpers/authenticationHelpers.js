const moment = require('moment');

exports.isTokenStillValidByTimeLimit = function (createdAt, settings) {
    let creationTime = moment(createdAt);
    if (!creationTime.isValid()){
        throw new Error('Invalid time specified');
    }

    return isTokenObsolete(getValidTillMoment(creationTime, settings.maxValidTimeInSeconds));

    function getValidTillMoment(createdAtMoment, timeValidAfterCreation) {
        return createdAtMoment.add(timeValidAfterCreation,'seconds');
    }
    function isTokenObsolete(validTillMoment) {
        return validTillMoment.isAfter(moment());
    }
};

