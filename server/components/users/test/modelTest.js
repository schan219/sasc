const assert = require('assert');
const User = require('../').DAL;
const sequelize = require('../../../db').sequelize;

describe('User Model', () => {
    beforeEach(async () => {
        try {
            //await User.deleteAllUsers();
        } catch (err) {
            throw new Error(err);
        }
    });

    describe('#create connection', () => {
        it('must create a connection to the database', async () => {
            try {
                await sequelize.authenticate();
                assert.ok('Connection has been established successfully.');
            } catch (err) {
                assert.fail('Unable to connect to the database');
            }
        });
    });

    /*describe('#createUser()', () => {
        it('must create a user', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            try {
                const {created, id} = await User.createUser(
                    user.email,
                    user.password,
                    user.firstName,
                    user.lastName
                );

                assert.equal(created, true);

                const dbUser = await User.getUser(id);
                assert.equal(dbUser.email, user.email);
                assert.equal(dbUser.firstName, user.firstName);
                assert.equal(dbUser.lastName, user.lastName);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#getAllUsers()', () => {
        it('must find all users', async () => {
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
                await User.createUser(alice.email,
                    alice.password,
                    alice.firstName,
                    alice.lastName
                );
                await User.createUser(bob.email,
                    bob.password,
                    bob.firstName,
                    bob.lastName
                );

                const dbUsers = await User.getAllUsers('alice@example.com');
                assert.equal(dbUsers[0].email, alice.email);
                assert.equal(dbUsers[0].firstName, alice.firstName);
                assert.equal(dbUsers[0].lastName, alice.lastName);
                assert.equal(dbUsers[1].email, bob.email);
                assert.equal(dbUsers[1].firstName, bob.firstName);
                assert.equal(dbUsers[1].lastName, bob.lastName);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#getUser()', () => {
        it('must get a user by id', async () => {
            const user = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'Sender',
            };

            try {
                const {created, id} = await User.createUser(
                    user.email,
                    user.password,
                    user.firstName,
                    user.lastName
                );

                assert.equal(created, true);

                const dbUser = await User.getUser(id);
                assert.equal(dbUser.email, user.email);
                assert.equal(dbUser.firstName, user.firstName);
                assert.equal(dbUser.lastName, user.lastName);
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
                const {created, id} = await User.createUser(
                    user.email,
                    user.password,
                    user.firstName,
                    user.lastName
                );

                assert.equal(created, true);

                const dbUser = await User.getUser(id);
                assert.equal(dbUser.firstName, user.firstName);
                assert.equal(dbUser.lastName, user.lastName);

                const newFirstName = 'Carol';
                const newLastName = 'Interceptor';
                const result = await User.updateUser(
                    dbUser.id,
                    newFirstName,
                    newLastName
                );
                assert.equal(result, true);
                const revisedDbUser = await User.getUser(id);
                assert.equal(revisedDbUser.firstName, newFirstName);
                assert.equal(revisedDbUser.lastName, newLastName);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#getPasswordAndId()', () => {
        it('must get the password and id', async () => {
            const alice = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'The Sender',
            };

            try {
                await User.createUser(
                    alice.email,
                    alice.password,
                    alice.firstName,
                    alice.lastName
                );

                const {
                    password,
                } = await User.getPasswordAndId('alice@example.com');
                assert.equal(password, alice.password);
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('#checkIfIdExists()', () => {
        it('must return true', async () => {
            const alice = {
                email: 'alice@example.com',
                password: 'abcdefghij',
                firstName: 'Alice',
                lastName: 'The Sender',
            };

            try {
                const {created, id} = await User.createUser(
                    alice.email,
                    alice.password,
                    alice.firstName,
                    alice.lastName
                );
                assert.equal(created, true);

                const result = await User.checkIfIdExists(id);
                assert.equal(result, true);
            } catch (err) {
                assert.fail(err);
            }
        });

        it('must return false', async () => {
            try {
                const fakeId = 'e8b5a51d-11c8-3310-a6ab-367563f20686';
                const result = await User.checkIfIdExists(fakeId);
                assert.equal(result, false);
            } catch (err) {
                assert.fail(err);
            }
        });
    });*/

    after(async () => {
        try {
            //await User.deleteAllUsers();
            await sequelize.close();
        } catch (err) {
            throw new Error(err);
        }
    });
});
