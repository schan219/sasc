const bcrypt = require('bcrypt');
const crypto = require('crypto');
const SALT_ROUNDS = require('../../config').saltRounds;
const secret = require('../../config').hash_secret;

hashBcrypt = async (password) => {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (err) {
        throw err;
    }
};

compareBcrypt = async (plaintextPassword, hash) => {
    try {
        const match = await bcrypt.compare(plaintextPassword, hash);
        return match;
    } catch (err) {
        return err;
    }
};

hashSHA256 = (text) => {
    const hash = crypto.createHmac('sha256', secret).update(text).digest('hex');
    return hash;
};

module.exports = {
    async hash(password) {
        if (password) {
            try {
                const hashedPassword = hashSHA256(password);
                const hashedBcryptPassword = await hashBcrypt(hashedPassword);
                return hashedBcryptPassword;
            } catch (err) {
                throw err;
            }
        } else {
            return new Error('Password does not exist');
        }
    },
    async compare(plaintextPassword, hash) {
        if (plaintextPassword) {
            try {
                const hashedPassword = hashSHA256(plaintextPassword);
                const match = compareBcrypt(hashedPassword, hash);
                return match;
            } catch (err) {
                throw err;
            }
        } else {
            return new Error('Password does not exist');
        }
    },
};
