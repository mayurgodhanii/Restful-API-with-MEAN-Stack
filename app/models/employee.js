var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var EmployeeSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    position_title: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);