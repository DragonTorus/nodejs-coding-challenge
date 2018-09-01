let mongoose = require('mongoose');
let schema = require('./schemas/user.schema');
const MODEL = 'User';

module.exports  = mongoose.model(MODEL, schema);
