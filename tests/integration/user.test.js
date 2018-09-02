const assert = require('assert');
const request = require('request-promise-native');
const testHost = 'http://localhost:3000';
const config = require("../../config");
const UserModel = require("../../models/user.model");
const mongoose = require('mongoose');
let user = {};
let access = {};

describe('Test Endpoints (Valid scenarios)', function() {
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
    it('It should return user by id', async function() {
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
    it('It should update the user by id', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            method:'PUT',
            body: {
                name: 'update-test-name',
                email:'update@mail.com',
                password:'updatedpassword'
            },
            json: true
        };

        let resp = await request(optionsApi);
        assert.equal(resp._id, user._id);
        assert.equal(resp.name, 'update-test-name');
        assert.equal(resp.email, 'update@mail.com');
        assert.equal(resp.password, undefined);
        assert.equal(resp.accessToken, undefined);
        assert.equal(resp.refreshToken, undefined);
        user = resp;
    });
    it('It should get the list of users', async function() {
        let optionsApi = {
            url: testHost + '/user',
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            method:'GET',
            json: true
        };

        let resp = await request(optionsApi);
        assert.ok(resp.length>0);
    });
});

describe('Test Endpoints (InValid scenarios)', function() {
    it('It should not create the user returning "name" length validation error', async function() {
        let optionsApi = {
            url: testHost + '/user',
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'POST',
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
            assert.equal(e.error.message, 'User validation failed: name: "name" must have length from 8 to 32 characters');
        }
    });
    it('It should not create the user returning "email" wrong pattern validation error', async function() {
        let optionsApi = {
            url: testHost + '/user',
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'POST',
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
            assert.equal(e.error.message, 'User validation failed: email: "email" has invalid pattern');
        }
    });
    it('It should not create the user returning missing parameter validation error', async function() {
        let optionsApi = {
            url: testHost + '/user',
            headers: {
                'User-Agent': 'Express-Agent'
            },
            method:'POST',
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
            assert.equal(e.error.message, 'Required data "email" or "password" is not defined');
        }
    });
    it('It should not update the user returning "name" length validation error', async function() {
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
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Validation failed: name: "name" must have length from 8 to 32 characters');
        }
    });
    it('It should not update the user returning "email" pattern validation error', async function() {
        let optionsApi = {
            url: testHost + '/user/' + user._id,
            headers: {
                'User-Agent': 'Express-Agent',
                'Authorization': 'Bearer ' + access.accessToken
            },
            method:'PUT',
            body: {
                name: 'update-test-name',
                email:'updatemail.com',
                password:'updatedpassword'
            },
            json: true
        };

        try {
            let resp = await request(optionsApi);
            assert.ok(!resp);
        } catch (e) {
            assert.equal(e.error.message, 'Validation failed: email: "email" has invalid pattern');
        }
    });
    after(async function() {
        await mongoose.connect(config.mongo.database,{useNewUrlParser: true});
        await UserModel.remove({});
        await mongoose.disconnect();
    });
});
