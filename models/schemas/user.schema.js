let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
const tokenSchema = require('./token.schema');
const User = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    name: {
        type: String,
        unique: true,
        trim:true,
        validate: {
            validator: (value) => {
                return value.length>8 && value.length<32;
            },
            message: '"name" must have length from 8 to 32 characters'
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, '"email" is missing'],
        validate: {
            validator: (value) => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
            },
            message: '"email" has invalid pattern'
        }
    },
    password: {
        type: String,
        required: [true, '"password" is required'],
        validate: {
            validator: (value) => {
                return value.length>8 && value.length<16;
            },
            message: '"password" must have length from 8 to 16 characters'
        }
    },
    // accessToken:tokenSchema,
    // refreshToken: tokenSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
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

module.exports = User;
