let mongoose = require('mongoose');
let schema = require('./schemas/token.schema');
const MODEL = 'Token';

module.exports  = mongoose.model(MODEL, schema);
