const assert = require('assert');
const User = require('../').Controller;
const db = require('../').DAL;
const passwordRegex = require('../').Controller.PASSWORD_REGEX;
const nameRegex = require('../').Controller.NAME_REGEX;
const safe = require('safe-regex');
const jwt = require('jsonwebtoken');
const secret = require('../../../config').jwt_secret;

describe('User Controller', () => {
    beforeEach(async () => {
        try {
            await db.deleteAllUsers();
        } catch (err) {
            throw new Error(err);
        }
    });

    describe('#regex', () => {
        it('[password] must pass the safe regex test', () => {
            const isSafe = safe(String(passwordRegex));
            assert.equal(isSafe, true);
        });

        it('[name] must pass the safe regex test', () => {
            const isSafe = safe(String(nameRegex));
            assert.equal(isSafe, true);
        });
    });

    describe('#signup()', () => {
        it('must fail to signup a user because of bad password', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abc',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            try {
                const result = await User.signup(user);
                assert.equal(result.created, false);
                assert.equal(result.error.name, 'ValidationError');
            } catch (err) {
                assert.fail(err);
            }
        });

        it('must fail to signup a user because of malformed email address',
            async () => {
                const user = {
                    email: 'aliceexamplecom',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                };

                try {
                    const result = await User.signup(user);
                    assert.equal(result.created, false);
                    assert.equal(result.error.name, 'ValidationError');
                } catch (err) {
                    assert.fail(err);
                }
            });

        it('must signup a user', async () => {
            const user = {
                email: 'bob@example.com',
                password: 'abcdefghij',
                firstName: 'Bob',
                lastName: 'The Recipient',
            };

            try {
                const result = await User.signup(user);
                assert.equal(result.created, true);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#login()', () => {
        it('must generate a token', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            try {
                const {created} = await User.signup(user);
                assert.equal(created, true);

                const credentials = {
                    email: user.email,
                    password: user.password,
                };
                const result = await User.login(credentials);
                assert.equal(result.error, null);
            } catch (err) {
                assert.fail(err);
            }
        });

        it('must fail because of incorrect password', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'O\'rly',
            };

            try {
                await User.signup(user);

                const credentials = {
                    email: user.email,
                    password: 'zzzzzzzzzz',
                };
                const result = await User.login(credentials);
                assert.equal(result.token, null);
                assert.equal(result.error.name, 'BadLoginCredentialsException');
            } catch (err) {
                assert.fail(err);
            }
        });

        it('must fail because user does not exist', async () => {
            try {
                const result = await User.login({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                });
                assert.equal(result.token, null);
                assert.equal(result.error.name, 'BadLoginCredentialsException');
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#getUsers()', () => {
        it('must get a list of users if authenticated', async () => {
            const alice = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            const bob = {
                email: 'bob@example.com',
                password: 'defghijklm',
                firstName: 'Bob',
                lastName: 'Recipient',
            };

            try {
                const aliceResult = await User.signup(alice);
                assert.equal(aliceResult.created, true);
                const bobResult = await User.signup(bob);
                assert.equal(bobResult.created, true);

                const results = await User.getUsers(aliceResult.token);
                const users = results.users;
                assert.equal(users[0].email, alice.email);
                assert.equal(users[0].firstName, alice.firstName);
                assert.equal(users[0].lastName, alice.lastName);
                assert.equal(users[1].email, bob.email);
                assert.equal(users[1].firstName, bob.firstName);
                assert.equal(users[1].lastName, bob.lastName);
            } catch (err) {
                assert.fail(err);
            }
        });

        it('must fail to get a list of users', async () => {
            try {
                const fakeId = 'e8b5a51d-11c8-3310-a6ab-367563f20686';
                const results = await User.getUsers(fakeId);
                assert.equal(results.users, null);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#updateUser()', () => {
        it('must update a user', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            try {
                const result = await User.signup(user);
                assert.equal(result.created, true);
                const token = result.token;

                const decoded = jwt.verify(token, secret);
                const id = decoded.sub;

                const dbUser = await db.getUser(id);
                assert.equal(dbUser.firstName, user.firstName);
                assert.equal(dbUser.lastName, user.lastName);

                const newFirstName = 'Carol';
                const newLastName = 'Interceptor';
                const updatedResult = await User.updateUser({
                    token,
                    firstName: newFirstName,
                    lastName: newLastName,
                });
                assert.equal(updatedResult.error, null);
                const updatedDbUser = await db.getUser(id);
                assert.equal(updatedDbUser.firstName, newFirstName);
                assert.equal(updatedDbUser.lastName, newLastName);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    after(async () => {
        try {
            await db.deleteAllUsers();
        } catch (err) {
            throw new Error(err);
        }
    });
});
