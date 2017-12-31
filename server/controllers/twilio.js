const twilioModel = require("../models/twilio");

exports.addTwilioAccountInfo = function (req, res) {
    var twilio = {
        ID: 1,
        email: req.body.email,
        twilioPhoneNumber: req.body.twilioPhoneNumber,
        accountSid: req.body.accountSid,
        authToken: req.body.authToken
    };
    twilioModel.create(twilio, function (err) {
        if (err) {
            return res.status(422).send({error: "Failed to add twilio account information."});
        } else {
            return res.status(201).send({success: "Successfully added twilio account information."});
        }
    });
};

exports.getAllTwilioAccountInfo = function (req, res) {
    twilioModel.list(function (err, results) {
        if (err) {
            return res.status(422).send({error: "Failed to retrieve twilio account information."});
        }

        // If no existing information is in database, return an object of empty strings in a list
        if (results.length === 0) {
            var twilio = {
                email: "",
                twilioPhoneNumber: "",
                accountSid: "",
                authToken: "",
            };
            results = [];
            results.push(twilio);
        }

        var twilio = results[0];

        // Remove the "+1" at the beginning of the phone number if there is a number saved
        if (twilio.twilioPhoneNumber !== "") {
            twilio.twilioPhoneNumber = parseInt(twilio.twilioPhoneNumber.substring(2));
        }

        return res.status(200).json(twilio);
    });
};

exports.addOrUpdateTwilioAccountInfo = function (req, res) {
    // Only one entry exists for twilio account information
    const id = 1;
    const values = {
        ID: id,
        email: req.body.email,
        twilioPhoneNumber: req.body.twilioPhoneNumber,
        accountSid: req.body.accountSid,
        authToken: req.body.authToken
    };

    if (isNaN(values.twilioPhoneNumber)) {
        return res.status(422).send({error: "Twilio phone number must be a number."});
    } else if (values.twilioPhoneNumber.toString().length !== 10) {
        return res.status(422).send({error: "Twilio phone number must be ten digits long."});
    } else {
        // E.164 format for phone numbers. Canadian extension only
        values.twilioPhoneNumber = "+1" + values.twilioPhoneNumber.toString();
    }

    twilioModel.update(id, values, function (err, results, fields) {
        if (err) {
            return res.status(422).send({error: "Failed to update twilio account information."});
        } else if (results.affectedRows === 0 && results.changedRows === 0) {
            // There is no such entry so we'll create one
            twilioModel.create(values, function (err) {
                if (err) {
                    return res.status(422).send({error: "Failed to add twilio account information."});
                } else {
                    return res.status(201).send({success: "Successfully added twilio account information."});
                }
            });
        } else {
            return res.status(201).send({success: "Successfully updated twilio account information."});
        }
    });
};

exports.deleteAllTwilioAccountInfo = function (req, res) {
    twilioModel.destroyAll(function (err) {
        if (err) {
            return res.status(422).send({error: "Failed to remove twilio account information."});
        } else {
            return res.status(201).send({success: "Successfully removed twilio account information."});
        }
    });
};