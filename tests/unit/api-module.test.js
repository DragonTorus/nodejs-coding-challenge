const assert = require('assert');
const config = require('../../config');
const UserModel = require('../../models/user.model');
const mongoose = require('mongoose');
const moment = require('moment');
const ApiModule = require('../../modules/api.module');


describe('testing authenticateUserApi', function() {

    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
    });
    it('It should authenticate the user', async function() {
        let resp = await ApiModule.authenticateUserApi({
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.accessToken);
        assert.ok(resp.refreshToken);
    });
    it('It should throw missing data exception', async function() {
        try {
            await ApiModule.authenticateUserApi({
                password:'testpassword'
            });
        } catch (e) {
            assert.equal(e.message, 'Required data "email" or "password" is not defined');
        }
    });

    it('It should throw user not found exception', async function() {
        try {
            await ApiModule.authenticateUserApi({
                email:'test1@mail.com',
                password:'testpassword'
            });
        } catch (e) {
            assert.equal(e.message, 'User Not found');
        }
    });

    it('It should throw wrong password exception', async function() {
        try {
            await ApiModule.authenticateUserApi({
                email:'test@mail.com',
                password:'testpassword1'
            });
        } catch (e) {
            assert.equal(e.message, 'Wrong password');
        }
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

describe('testing refreshAccessTokenApi', function() {
    let access = {};
    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    });

    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
        user = resp;
    });
    it('It should authenticate the user', async function() {
        let resp = await ApiModule.authenticateUserApi({
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.accessToken);
        assert.ok(resp.refreshToken);
        access = resp;
    });
    it('It should throw missing data exception', async function() {
        try {
            await ApiModule.refreshAccessTokenApi({
                token:access.refreshToken
            });
        } catch (e) {
            assert.equal(e.message, 'Required data "email" or "token" is not defined');
        }
    });

    it('It should throw user not found exception', async function() {
        try {
            await ApiModule.refreshAccessTokenApi({
                email:'test1@mail.com',
                token:access.refreshToken.token
            });
        } catch (e) {
            assert.equal(e.message, 'User Not found');
        }
    });

    it('It should throw expired token exception', async function() {
        try {
            await updateTokenCreationTime({'refreshToken.token':access.refreshToken.token}, {value:7, span:'day'}, 'refreshToken');
            await ApiModule.refreshAccessTokenApi({
                email:'test@mail.com',
                token:access.refreshToken.token
            });
        } catch (e) {
            assert.equal(e.message, 'Refresh Token expired, please authenticate with your email and password to get new refresh token.');
        }
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

describe('testing createUserApi', function() {
    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    });

    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
    });
    it('It should not create the user', async function() {
        try {
            await ApiModule.createUserApi({
                email:'test@mail.com'
            });
        } catch (e) {
            assert.equal(e.message, 'Required data "email" or "password" is not defined');
        }
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

describe('testing getAllUsersApi', function() {
    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    });
    it('It should not get the user list', async function() {
        try {
            await ApiModule.getAllUsersApi();
        } catch (e) {
            assert.equal(e.message, 'User Not found');
        }
    });
    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
    });
    it('It should not get the user list', async function() {
        let users = await ApiModule.getAllUsersApi();
        assert.ok(users.length>0);
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

describe('testing getUserByIdApi', function() {
    let user = {};
    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    });
    it('It should not get the user list', async function() {
        try {
            await ApiModule.getUserByIdApi();
        } catch (e) {
            assert.equal(e.message, 'Required data "id" is not defined');
        }
    });
    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
        user = resp;
    });
    it('It should not get the user', async function() {
        try {
            await ApiModule.getUserByIdApi('5b8ad14cc8813847300c51ea');
        } catch (e) {
            assert.equal(e.message, 'User Not found');
        }
    });
    it('It should get the user', async function() {
        let resp = await ApiModule.getUserByIdApi(user._id);
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

describe('testing ', function() {
    let user = {};
    before(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    });
    it('It should not get the user to update', async function() {
        try {
            await ApiModule.updateUserApi({}, '5b8ad14cc8813847300c51ea');
        } catch (e) {
            assert.equal(e.message, 'Required data to update is missing or path param "id" is not defined');
        }
    });
    it('It should create the user', async function() {
        let resp = await ApiModule.createUserApi({
            name: 'test-name',
            email:'test@mail.com',
            password:'testpassword'
        });
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
        user = resp;
    });
    it('It should throw parameter missing exception', async function() {
        try {
            await ApiModule.updateUserApi({email:'test111@mail.com'},'5b8ad14cc8813847300c51ea');
        } catch (e) {
            assert.equal(e.message, 'Required data to update is missing or path param "id" is not defined');
        }
    });
    it('It should update the user', async function() {
        let resp = await ApiModule.updateUserApi({email:'test111@mail.com'},user._id);
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test111@mail.com');
        assert.ok(resp.password);
        assert.ok(resp.accessToken);
        assert.ok(resp.accessToken.token);
        assert.ok(resp.refreshToken.token);
    });
    after(async function() {
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

async function updateTokenCreationTime(query, time, property) {
    const user = await UserModel.findOne(query);
    let createdAtMoment = moment(user[property].createdAt);
    outdatedCreatedAt = createdAtMoment.subtract(time.value,time.span);
    user[property].createdAt = outdatedCreatedAt.toDate();
    await user.save();
}
