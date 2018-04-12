'use strict';

const JWT = require('jsonwebtoken');
const Config = require('getconfig');
const Fixtures = require('../fixtures');
const Server = Fixtures.server;
const db = Fixtures.db;

const { after, before, describe, it } = exports.lab = require('lab').script();
const { expect } = require('code');


describe('GET /users/profile', () => {

    let server;
    const user = Fixtures.user_id();

    before(async () => {

        server = await Server;

        await Promise.all([
            db.users.insert(user)
        ]);
    });

    after(async () => {

        await Promise.all([
            db.users.destroy({ id: user.id })
        ]);

    });

    it('Get user profile', () => {

        const token = JWT.sign({ id: user.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        return server.inject({ method: 'get', url: '/users/profile', headers: { 'Authorization': token } }).then((res) => {

            expect(res.statusCode).to.equal(200);
        });
    });

    it('Get fake user profile', () => {

        const fake = Fixtures.user_id();
        const token = JWT.sign({ id: fake.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        return server.inject({ method: 'get', url: `/users/profile`, headers: { 'Authorization': token } }).then((res) => {

            expect(res.statusCode).to.equal(401);
        });
    });
});
