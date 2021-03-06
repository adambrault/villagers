'use strict';

const Fixtures = require('../fixtures');
const JWT = require('jsonwebtoken');
const Config = require('getconfig');
const Server = Fixtures.server;
const db = Fixtures.db;
const { after, before, describe, it } = exports.lab = require('lab').script();
const { expect } = require('code');

describe('POST Lists:', () => {

    let server;

    let list1 = Fixtures.list();
    let list2 = Fixtures.list();

    const user1 = Fixtures.user_id();
    const user2 = Fixtures.user_id();

    before(async () => {

        await Promise.all([
            db.users.insert(user1),
            db.users.insert(user2)
        ]);

        const list1Query = {
            method: 'POST',
            url: '/lists',
            payload: list1
        };

        const list2Query = {
            method: 'POST',
            url: '/lists',
            payload: list2
        };

        server = await Server;

        const token = JWT.sign({ id: user1.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        list1Query.headers = { 'Authorization': token };
        list2Query.headers = { 'Authorization': token };

        await server.inject(list1Query)
            .then((response) => {

                list1 = response.result.data;
            });

        await server.inject(list2Query)
            .then((response) => {

                list2 = response.result.data;
            });
    });

    after(async () => {

        await Promise.all([
            db.lists.destroy({ id: list2.id }),
            db.users.destroy({ id: user1.id }),
            db.users.destroy({ id: user2.id })
        ]);
    });

    it('delete list', () => {

        const token = JWT.sign({ id: user1.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        const deleteQuery = {
            method: 'DELETE',
            headers: { 'authorization': token }
        };

        deleteQuery.url = `/lists/${list1.id}`;

        return (
            server.inject(deleteQuery)
                .then((response) => {

                    expect(response.statusCode).to.equal(204);
                })
        );
    });

    it('unauthorized delete list', () => {

        const token = JWT.sign({ id: user2.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        const deleteQuery = {
            method: 'DELETE',
            headers: { 'authorization': token }
        };

        deleteQuery.url = `/lists/${list2.id}`;

        return (
            server.inject(deleteQuery)
                .then((response) => {

                    expect(response.statusCode).to.equal(401);
                })
        );
    });

    it('delete non-existing list', () => {

        const token = JWT.sign({ id: user1.id, timestamp: new Date() }, Config.auth.secret, Config.auth.options);
        const deleteQuery = {
            method: 'DELETE',
            url: `/lists/${list1.id}`,
            headers: { 'authorization': token }
        };

        return (
            server.inject(deleteQuery)
                .then((response) => {

                    expect(response.statusCode).to.equal(404);
                })
        );
    });
});
