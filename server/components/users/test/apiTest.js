const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../').DAL;
const app = 'https://localhost:3000';
chai.use(chaiHttp);

// Use chai with https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('User API', () => {
    beforeEach(async () => {
        try {
            await db.deleteAllUsers();
        } catch (err) {
            throw new Error(err);
        }
    });

    describe('#POST/signup', () => {
        it('must signup a user', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then((res) => {
                    chai.expect(res).to.have.status(201);
                }).catch((err) => {
                    throw err;
                });
        });

        it('must fail to signup a user', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abc',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then((res) => {
                    chai.expect(res).to.have.status(422);
                    assert.equal(res.body.error.name, 'ValidationError');
                }).catch((err) => {
                    throw err;
                });
        });
    });

    describe('#POST/login', () => {
        it('must return an error', () => {
            return chai.request(app)
                .post('/login')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                }).then((res) => {
                    chai.expect(res).to.have.status(401);
                    assert.equal(
                        res.body.error.name,
                        'BadLoginCredentialsException'
                    );
                }).catch((err) => {
                    throw err;
                });
        });

        it('must retrieve a token', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then(() => {
                    return chai.request(app)
                        .post('/login')
                        .send({
                            email: 'alice@example.com',
                            password: 'abcdefghij',
                        }).then((res) => {
                            chai.expect(res).to.have.status(200);
                        }).catch((err) => {
                            throw err;
                        });
                }).catch((err) => {
                    throw err;
                });
        });
    });

    describe('#GET/users', () => {
        it('must get a list of users', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then((res) => {
                    return chai.request(app)
                        .get('/users')
                        .set('x-authentication-token', res.body.token)
                        .then((res) => {
                            chai.expect(res).to.have.status(200);
                        }).catch((err) => {
                            throw err;
                        });
                }).catch((err) => {
                    throw err;
                });
        });

        it('must return an error', () => {
            return chai.request(app)
                .get('/users')
                .set('x-authentication-token', 'aaaaaaaaaa')
                .then((res) => {
                    chai.expect(res).to.have.status(401);
                    assert.equal(res.body.error.name, 'JsonWebTokenError');
                }).catch((err) => {
                    throw err;
                });
        });
    });

    describe('#PUT/users', () => {
        it('must update a user\'s first and last name', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then((res) => {
                    return chai.request(app)
                        .put('/users')
                        .set('x-authentication-token', res.body.token)
                        .send({
                            'firstName': 'Carol',
                            'lastName': 'Interceptor',
                        }).then((res) => {
                            chai.expect(res).to.have.status(200);
                        }).catch((err) => {
                            throw err;
                        });
                }).catch((err) => {
                    throw err;
                });
        });

        it('must only update a user\'s first name', () => {
            return chai.request(app)
                .post('/signup')
                .send({
                    email: 'alice@example.com',
                    password: 'abcdefghij',
                    firstName: 'Alice',
                    lastName: 'Sender',
                }).then((res) => {
                    return chai.request(app)
                        .put('/users')
                        .set('x-authentication-token', res.body.token)
                        .send({
                            'firstName': 'Carol',
                        }).then(() => {
                            return chai.request(app)
                                .get('/users')
                                .set('x-authentication-token', res.body.token)
                                .then((getRes) => {
                                    assert.equal(
                                        getRes.body.users[0].firstName,
                                        'Carol'
                                    );
                                    assert.equal(
                                        getRes.body.users[0].lastName,
                                        'Sender'
                                    );
                                }).catch((err) => {
                                    throw err;
                                });
                        }).catch((err) => {
                            throw err;
                        });
                }).catch((err) => {
                    throw err;
                });
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
