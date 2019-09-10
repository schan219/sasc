const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const hash = require('./lib').hash;
const compare = require('./lib').compare;
const User = require('./userDAL');
const secret = require('../../config').jwt_secret;
const Errors = require('./errors');
const handleError = require('./errorHandler').handleError;
const BadLoginCredentialsException = Errors.BadLoginCredentialsException;
const EmailAlreadyRegisteredException = Errors.EmailAlreadyRegisteredException;
const InvalidTokenException = Errors.InvalidTokenException;
const JWT_ALGORITHM = 'HS256';
const JWT_ISSUER = require('../../config.json').jwt_issuer;

const PASSWORD_REGEX = /^[a-zA-Z0-9 `~!@#$%^&*()\-_=+,./?'":;{}\\|<>]{10,160}$/;
const NAME_REGEX = /^[a-zA-Z ']{0,50}$/;

const getUnixTime = () => {
    return Date.now() / 1000 | 0;
};

const getHourFromNow = (now) => {
    return now + (60 * 60);
};

const createToken = (id) => {
    const timestamp = getUnixTime();
    const expiry = getHourFromNow(timestamp);
    const token = jwt.sign({
        sub: id,
        iss: JWT_ISSUER,
        aud: [JWT_ISSUER],
        iat: timestamp,
        nbf: timestamp,
        exp: expiry,
    }, secret, {algorithm: JWT_ALGORITHM});

    return token;
};

module.exports = {
    PASSWORD_REGEX,
    NAME_REGEX,
    /**
     * Creates a user if not exists.
     * @param {Object} user
     * @return {Object} error, created, token
     */
    async signup(user) {
        const schema = Joi.object().keys({
            email: Joi.string().trim().email().max(256).required(),
            password: Joi.string().regex(PASSWORD_REGEX).required(),
            firstName: Joi.string().trim().regex(NAME_REGEX),
            lastName: Joi.string().trim().regex(NAME_REGEX),
        });

        try {
            const result = await Joi.validate(user, schema);
            result.password = await hash(result.password);

            const {created, id} = await User.createUser(
                result.email,
                result.password,
                result.firstName,
                result.lastName
            );

            if (!created) {
                const error = handleError(
                    new EmailAlreadyRegisteredException()
                );
                return {
                    error,
                    created,
                    token: null,
                };
            }

            const token = createToken(id);
            return {
                error: null,
                created,
                token,
            };
        } catch (err) {
            const error = handleError(err);
            return {
                error,
                created: false,
                token: null,
            };
        }
    },
    /**
     * Authenticates a user given email and password.
     * @param {Object} user
     * @return {String} token
     */
    async login(user) {
        const schema = Joi.object().keys({
            email: Joi.string().trim().email().max(256).required(),
            password: Joi.string().regex(PASSWORD_REGEX).required(),
        });
        try {
            const result = await Joi.validate(user, schema);

            const dbResult = await User.getPasswordAndId(result.email);

            if (!dbResult) {
                const error = handleError(new BadLoginCredentialsException());
                return {
                    error,
                    token: null,
                };
            }

            const match = await compare(result.password, dbResult.password);

            if (match) {
                const token = createToken(dbResult.id);
                return {
                    error: null,
                    token,
                };
            } else {
                const error = handleError(new BadLoginCredentialsException());
                return {
                    error,
                    token: null,
                };
            }
        } catch (err) {
            const error = handleError(err);
            return {
                error,
                token: null,
            };
        }
    },
    /**
     * Get a list of users.
     * @param {String} token
     * @return {Object}
     */
    async getUsers(token) {
        const schema = Joi.string().required();
        try {
            const sanitizedToken = await Joi.validate(token, schema);
            const decoded = jwt.verify(
                sanitizedToken,
                secret,
                {algorithms: [JWT_ALGORITHM]}
            );

            const tokenContentSchema = Joi.object().keys({
                sub: Joi.string().required(),
                iss: Joi.string().required(),
                aud: Joi.array().items(Joi.string()).required(),
                iat: Joi.date().timestamp().required(),
                nbf: Joi.date().timestamp().required(),
                exp: Joi.date().timestamp().required(),
            });

            const sanitizedTokenContents = await Joi.validate(
                decoded,
                tokenContentSchema
            );

            const id = sanitizedTokenContents.sub;
            const match = await User.checkIfIdExists(id);

            if (match) {
                const users = await User.getAllUsers();
                return {
                    error: null,
                    users,
                };
            } else {
                const error = handleError(new InvalidTokenException());
                return {
                    error,
                    users: null,
                };
            }
        } catch (err) {
            const error = handleError(err);
            return {
                error,
                users: null,
            };
        }
    },
    /**
     * Updates a user's first name or last name.
     * @param {Object} user
     * @return {Object}
     */
    async updateUser(user) {
        const schema = Joi.object().keys({
            token: Joi.string().required(),
            firstName: Joi.string().trim().regex(NAME_REGEX),
            lastName: Joi.string().trim().regex(NAME_REGEX),
        });

        try {
            const result = await Joi.validate(user, schema);
            const sanitizedToken = result.token;
            const decoded = jwt.verify(
                sanitizedToken,
                secret,
                {algorithms: [JWT_ALGORITHM]}
            );

            const tokenContentSchema = Joi.object().keys({
                sub: Joi.string().required(),
                iss: Joi.string().required(),
                aud: Joi.array().items(Joi.string()).required(),
                iat: Joi.date().timestamp().required(),
                nbf: Joi.date().timestamp().required(),
                exp: Joi.date().timestamp().required(),
            });

            const sanitizedTokenContents = await Joi.validate(
                decoded,
                tokenContentSchema
            );

            const id = sanitizedTokenContents.sub;
            const dbUser = await User.getUser(id);

            if (dbUser) {
                const id = dbUser.id;

                await User.updateUser(
                    id,
                    result.firstName || dbUser.firstName,
                    result.lastName || dbUser.lastName
                );

                return {
                    error: null,
                };
            } else {
                const error = handleError(new InvalidTokenException());
                return {
                    error,
                };
            }
        } catch (err) {
            const error = handleError(err);
            return {
                error,
            };
        }
    },
};
