const express = require('express');
const router = express.Router();

const User = require('./userController');

router.post('/signup', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    try {
        const result = await User.signup(user);
        const error = result.error;

        if (error) {
            res.status(error.code).send({error});
        } else {
            res.status(201).send({token: result.token});
        }
    } catch (error) {
        res.status(error.code).send({error});
    }
});

router.post('/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    try {
        const result = await User.login(user);
        const error = result.error;

        if (error) {
            res.status(error.code).send({error});
        } else {
            res.status(200).send({token: result.token});
        }
    } catch (error) {
        res.status(error.code).send({error});
    }
});

router.get('/users', async (req, res) => {
    const token = req.get('x-authentication-token');

    try {
        const result = await User.getUsers(token);
        const error = result.error;

        if (error) {
            res.status(error.code).send({error});
        } else {
            res.status(200).send({users: result.users});
        }
    } catch (error) {
        res.status(error.code).send({error});
    }
});

router.put('/users', async (req, res) => {
    const user = {
        token: req.get('x-authentication-token'),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    try {
        const result = await User.updateUser(user);
        const error = result.error;

        if (error) {
            res.status(error.code).send({error});
        } else {
            res.status(200).send({});
        }
    } catch (error) {
        res.status(error.code).send({error});
    }
});

module.exports = router;
