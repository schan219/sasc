const User = require('./userModel');

module.exports = {

    /**
     * Retrieves all users.
     * @return {[Object]}
     */
    getAllUsers() {
        return new Promise(async (resolve, reject) => {
            User.findAll({attributes: ['email', 'firstName', 'lastName']})
                .then((users) => {
                    resolve(users);
                }).catch((err) => reject(err));
        });
    },

    /**
     * Retrieves a user.
     * @param {String} id
     * @return {Object} user or null
     */
    getUser(id) {
        return new Promise(async (resolve, reject) => {
            User.findOne({
                where: {id},
                attributes: ['id', 'email', 'firstName', 'lastName'],
            }).then((user) => {
                resolve(user);
            }).catch((err) => reject(err));
        });
    },

    /**
     * Checks if given id exists.
     * @param {String} id
     * @return {Boolean}
     */
    checkIfIdExists(id) {
        return new Promise(async (resolve, reject) => {
            User.count({
                where: {
                    id,
                },
            }).then((count) => {
                if (count > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => reject(err));
        });
    },

    /**
     * Creates a user.
     * @param {String} email
     * @param {String} password
     * @param {String} firstName
     * @param {String} lastName
     * @return {{Boolean, String}}
     */
    createUser(email, password, firstName, lastName) {
        return new Promise(async (resolve, reject) => {
            User.findOrCreate({
                where: {
                    email,
                },
                defaults: {
                    password,
                    firstName,
                    lastName,
                },
            }).spread((_, created) => {
                User.findOne({
                    where: {email},
                    attributes: ['id'],
                }).then((user) => {
                    const id = user.id;
                    resolve({created, id});
                });
            }).catch((err) => reject(err));
        });
    },

    /**
     * Updates a user's first name or last name.
     * @param {String} id
     * @param {String} firstName
     * @param {String} lastName
     * @return {Boolean}
     */
    updateUser(id, firstName, lastName) {
        return new Promise(async (resolve, reject) => {
            User.update({
                firstName,
                lastName,
            },
            {
                where: {
                    id,
                },
            }).then(() => {
                resolve(true);
            }).catch((err) => reject(err));
        });
    },

    /**
     * Retrieves password and id by email.
     * @param {String} email
     * @return {{String, String}}
     */
    getPasswordAndId(email) {
        return new Promise(async (resolve, reject) => {
            User.findOne({
                where: {email},
                attributes: ['id', 'password'],
            }).then((row) => {
                if (row != null) {
                    const result = {
                        password: row.password,
                        id: row.id,
                    };
                    resolve(result);
                } else {
                    resolve(null);
                }
            }).catch((err) => reject(err));
        });
    },

    /**
     * Deletes all users.
     * @return {null}
     */
    deleteAllUsers() {
        return new Promise(async (resolve, reject) => {
            User.destroy({
                where: {},
                truncate: true,
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    },
};
