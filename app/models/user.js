var mongoose = require('mongoose');
var md5 = require('js-md5');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        user.password = md5(user.password);
        next();       
    } else {
        return next();
    }
});

module.exports = mongoose.model('User', UserSchema);