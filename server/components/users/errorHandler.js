module.exports = {
    handleError(error) {
        let wrappedError;

        switch (error.name) {
        case 'JsonWebTokenError':
            wrappedError = {
                code: 401,
                name: error.name,
                message: error.message,
            };
            break;
        case 'TokenExpiredError':
            wrappedError = {
                code: 401,
                name: error.name,
                message: error.message,
            };
            break;
        case 'NotBeforeError':
            wrappedError = {
                code: 401,
                name: error.name,
                message: error.message,
            };
            break;
        case 'ValidationError':
            wrappedError = {
                code: 422,
                name: error.name,
                message: error.details[0].message,
            };
            break;
        case 'BadLoginCredentialsException':
            wrappedError = {
                code: error.code,
                name: error.name,
                message: error.message,
            };
            break;
        case 'EmailAlreadyRegisteredException':
            wrappedError = {
                code: error.code,
                name: error.name,
                message: error.message,
            };
            break;
        case 'InvalidTokenException':
            wrappedError = {
                code: error.code,
                name: error.name,
                message: error.message,
            };
            break;
        default:
            wrappedError = {
                code: 500,
                name: error.name,
                message: error.message,
            };
            break;
        }

        if (error.isJoi) {
            const key = error.details[0].context.key;

            switch (key) {
            case 'email':
                wrappedError.message = 'Must be a valid email address.';
                break;
            case 'password':
                wrappedError.message = 'Password must be between 10 and 160 '
                + 'characters long and can only include alphanumerics and '
                + 'symbols.';
                break;
            case 'firstName':
                wrappedError.message = 'First name must only include '
                + 'alphanumerics, space, and \'.';
                break;
            case 'lastName':
                wrappedError.message = 'Last name must only include '
                + 'alphanumerics, space, and \'.';
                break;
            case 'token':
                wrappedError.message = 'Token must be a valid string.';
                break;
            case 'sub':
            case 'iss':
            case 'aud':
            case 'iat':
            case 'nbf':
            case 'exp':
                wrappedError.message = 'Token is invalid.';
                break;
            default:
                break;
            }
        }

        return wrappedError;
    },
};
