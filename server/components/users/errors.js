module.exports = {
    BadLoginCredentialsException: function() {
        this.code = 401;
        this.message = 'Email or password is incorrect.';
        this.name = 'BadLoginCredentialsException';
    },
    EmailAlreadyRegisteredException: function() {
        this.code = 422;
        this.message = 'The email is already taken.';
        this.name = 'EmailAlreadyRegisteredException';
    },
    InvalidTokenException: function() {
        this.code = 403;
        this.message = 'Authentication token is invalid.';
        this.name = 'InvalidTokenException';
    },
};
