let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
const Token = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    token:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value);
            },
            message: '"accessToken" invalid token pattern'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    toObject: {
        transform: (doc, ret) => {
            delete ret.__v;
        }
    }
});

module.exports = Token;
