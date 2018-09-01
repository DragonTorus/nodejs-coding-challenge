const util = require('util');
const bcrypt = require('bcryptjs');

exports.getStringHash = async function (string) {
    const salt = await util.promisify(bcrypt.genSalt)(10);
    return await util.promisify(bcrypt.hash)(string, salt);
};
