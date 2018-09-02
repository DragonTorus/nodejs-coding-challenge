const assert = require('assert');
const request = require('request-promise-native');
const testHost = 'http://localhost:3000' ;
const config = require('../config');
const UserModel = require('../models/user.model');
const mongoose = require('mongoose');
const moment = require('moment');
let user = {};
let access = {};

describe('Test Authentication (Valid scenarios)', function() {

    it('It should create the user', async function() {
        let optionsApi = {
            url: testHost + '/user',
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'POST',
            body: {
                name: 'test-name',
                email:'test@mail.com',
                password:'testpassword'
            },
            json: true
        };

        let resp = await request(optionsApi);
        assert.ok(resp._id);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.equal(resp.password, undefined);
        assert.equal(resp.accessToken, undefined);
        assert.equal(resp.refreshToken, undefined);
        user = resp;
    });
    it('It should authenticate the user', async function() {
        let optionsApi = {
            url: testHost + '/auth',
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'POST',
            body: {
                email:'test@mail.com',
                password:'testpassword'
            },
            json: true
        };

        let resp = await request(optionsApi);
        assert.equal(resp.name, 'test-name');
        assert.equal(resp.email, 'test@mail.com');
        assert.ok(resp.accessToken);
        assert.ok(resp.refreshToken);
        access = resp;
    });
    it('It should be authenticated and return user by id', async function() {
        let optionsApi = {
            url: testHost + '/user/'+ user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            json: true
        };

        let resp = await request(optionsApi);
        assert.equal(resp._id, user._id);
        assert.equal(resp.name, user.name);
        assert.equal(resp.email, user.email);
        assert.equal(resp.password, undefined);
        assert.equal(resp.accessToken, undefined);
        assert.equal(resp.refreshToken, undefined);
    });

    it('It should get new access token by refresh token and email', async function() {
        let optionsApi = {
            method: 'POST',
            url: testHost + '/refresh-token',
            body:{
                email:user.email,
                token:access.refreshToken
            },
            headers: {
                'User-Agent': 'Express-Agent'
            },
            json: true
        };
        let resp = await request(optionsApi);
        assert.equal(resp.name, user.name);
        assert.equal(resp.email, user.email);
        assert.ok(resp.accessToken);
    });

    it('It should be authenticated and hello:world', async function() {
        let optionsApi = {
            url: testHost + '/hello',
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            json: true
        };

        let resp = await request(optionsApi);
        assert.equal(resp.hello, 'world');
    });

});

describe('Test Authentication (InValid scenarios)', function() {
    it('It should not update the user without missing authentication', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'PUT',
            body: {
                name: 'test',
                email:'test@mail.com',
                password:'testpassword'
            },
            json: true
        };

        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Authorization is missing');
        }
    });
    it('It should not create the user returning invalid token', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer 00000' + access.accessToken
            },
            method:'PUT',
            body: {
                name: 'testtttt',
                email:'testmail.com',
                password:'testpassword'
            },
            json: true
        };

        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Invalid authorization header detected');
        }
    });
    it('It should not create the user returning not found token', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer a74e5463-ee35-45b8-9c38-28e979c9b184'

            },
            method:'PUT',
            body: {
                name: 'testtttt',
                email:'test@mail.com'
            },
            json: true
        };

        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Access token not found');
        }
    });
    it('It should  not get new access token by refresh token and missing email', async function() {
        let optionsApi = {
            method: 'POST',
            url: testHost + '/refresh-token',
            body:{
                token:access.refreshToken
            },
            headers: {
                'User-Agent': 'Express-Agent'
            },
            json: true
        };
        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Required data "email" or "token" is not defined');
        }
    });
    it('It should not update the user returning access token expired error', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken

            },
            method:'PUT',
            body: {
                name: 'tes',
                email:'test@mail.com',
                password:'testpassword'
            },
            json: true
        };

        try {
            await updateTokenCreationTime({'accessToken.token':access.accessToken}, {value:3, span:'day'}, 'accessToken');
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Access Token expired, please use your refresh token to get new access token');
        }
    });


    it('It should  not get new access token by outdated refresh token', async function() {
        let optionsApi = {
            method: 'POST',
            url: testHost + '/refresh-token',
            body:{
                email:user.email,
                token:access.refreshToken
            },
            headers: {
                'User-Agent': 'Express-Agent'
            },
            json: true
        };
        try {
            await updateTokenCreationTime({'refreshToken.token':access.refreshToken}, {value:7, span:'day'}, 'refreshToken');
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Refresh Token expired, please authenticate with your email and password to get new refresh token.');
        }
    });
    it('It should not be authenticated with error obsolete access token response', async function() {
        let optionsApi = {
            url: testHost + '/hello',
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            json: true
        };

        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Access Token expired, please use your refresh token to get new access token');
        }
    });
    after(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});

async function updateTokenCreationTime(query, time, property) {
    await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
    const user = await UserModel.findOne(query);
    let createdAtMoment = moment(user[property].createdAt);
    outdatedCreatedAt = createdAtMoment.subtract(time.value,time.span);
    user[property].createdAt = outdatedCreatedAt.toDate();
    await user.save();
    await mongoose.disconnect();
}
