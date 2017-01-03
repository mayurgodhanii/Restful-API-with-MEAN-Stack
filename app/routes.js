var User = require('./models/user');
var Employee = require('./models/employee');
var md5 = require('js-md5');

function checkTokenValidation(req, cb) {
    if (!req.headers.token) {
        cb(500, 500);
    } else {
        User.findOne({
            token: req.headers.token
        }, function (err, user) {
            if (err)
                cb(500, 500);
            if (!user) {
                cb(500, 500);
            } else {
                cb(200, user);
            }
        });
    }
}

module.exports = function (router, config, jwt) {
    router.get('/', function (req, res) {
        res.json({message: 'hooray! welcome to our api!'});
    });

    router.route('/signup').post(function (req, res) {
        if (!req.body.username || !req.body.password || !req.body.name) {
            return res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name
            });
            // save the user
            newUser.save(function (err) {
                if (err) {
                    return res.json({success: false, msg: 'Username already exists.'});
                }
                return res.json({success: true, msg: 'Successful created new user.'});
            });
        }
    })

    router.route('/login').post(function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });

            var encrpted_pswd = md5(req.body.password);
            User.findOne({
                username: req.body.username,
                password: encrpted_pswd
            }, function (err, user) {
                if (err)
                    return res.json({success: false, msg: 'Authentication failed. Wrong password.'});
                if (!user) {
                    return res.send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    var token = jwt.sign(user, config.secret);
                    user.token = token;
                    user.save(function (err) {
                        if (err) {
                            return res.json({success: false, msg: 'Authentication failed. Wrong password.'});
                        }
                        return res.json({success: true, token: token});
                    });
                }
            });
        }
    })

    router.route('/profile').post(function (req, res) {

        checkTokenValidation(req, function (status, user) {
            if (status == 200) {
                console.log(req.body.name);
                if (typeof req.body.name != 'undefined') {
                    user.name = req.body.name;
                }
                user.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Error occured. Please try again after sometime.'});
                    }
                    return res.json({success: true, msg: 'Profile has been updated.'});
                });
            } else {
                return res.json({success: false, msg: 'Failed to authenticate token.'});
            }
        });
        return;
    })


    router.route('/employee')
            // Add new employee for login user 
            .post(function (req, res) {
                if (!req.body.firstname || !req.body.lastname) {
                    return res.json({success: false, msg: 'Please enter firstname and lastname.'});
                } else {
                    checkTokenValidation(req, function (status, user) {
                        if (status == 200) {
                            var employee = new Employee();
                            employee.user_id = user._id;
                            employee.firstname = req.body.firstname;
                            employee.lastname = req.body.lastname;

                            if (typeof req.body.position_title != 'undefined') {
                                employee.position_title = req.body.position_title;
                            }
                            if (typeof req.body.gender != 'undefined') {
                                employee.gender = req.body.gender;
                            }
                            if (typeof req.body.address != 'undefined') {
                                employee.address = req.body.address;
                            }
                            if (typeof req.body.mobile != 'undefined') {
                                employee.mobile = req.body.mobile;
                            }
                            if (typeof req.body.email != 'undefined') {
                                employee.email = req.body.email;
                            }
                            console.log(user._id);
                            console.log(employee);
                            employee.save(function (err) {
                                if (err)
                                    res.send(err);

                                res.json({success: true, msg: 'Employee created!'});
                            });
                        } else {
                            return res.json({success: false, msg: 'Failed to authenticate token.'});
                        }
                    });
                }
            })
            // get all the employee for login user
            .get(function (req, res) {
                checkTokenValidation(req, function (status, user) {
                    if (status == 200) {
                        Employee.find({user_id: user._id}, function (err, employees) {
                            if (err)
                                res.send(err);
                            return res.json({success: true, msg: "Employee list.", data: employees});
                        });
                    } else {
                        return res.json({success: false, msg: 'Failed to authenticate token.'});
                    }
                });
            });

// on routes that end in /employee/:employee_id
// ----------------------------------------------------
    router.route('/employee/:employee_id')
            //Get Employee details by id
            .get(function (req, res) {
                checkTokenValidation(req, function (status, user) {
                    if (status == 200) {
                        Employee.findById(req.params.employee_id, function (err, employee) {
                            if (err)
                                res.send(err);
                            return res.json({success: true, msg: "Employee details.", data: employee});
                        });
                    } else {
                        return res.json({success: false, msg: 'Failed to authenticate token.'});
                    }
                });
            })
            //Edit Employee details by id
            .put(function (req, res) {
                checkTokenValidation(req, function (status, user) {
                    if (status == 200) {
                        Employee.findById(req.params.employee_id, function (err, employee) {
                            if (err)
                                return res.json({success: false, msg: 'Employee details not available.'});

                            if (typeof req.body.firstname != 'undefined') {
                                employee.firstname = req.body.firstname;
                            }
                            if (typeof req.body.lastname != 'undefined') {
                                employee.lastname = req.body.lastname;
                            }
                            if (typeof req.body.position_title != 'undefined') {
                                employee.position_title = req.body.position_title;
                            }
                            if (typeof req.body.gender != 'undefined') {
                                employee.gender = req.body.gender;
                            }
                            if (typeof req.body.address != 'undefined') {
                                employee.address = req.body.address;
                            }
                            if (typeof req.body.mobile != 'undefined') {
                                employee.mobile = req.body.mobile;
                            }
                            if (typeof req.body.email != 'undefined') {
                                employee.email = req.body.email;
                            }
                            employee.save(function (err) {
                                if (err)
                                    res.send(err);
                                res.json({success: true, msg: 'Employee updated!'});
                            });
                        });
                    } else {
                        return res.json({success: false, msg: 'Failed to authenticate token.'});
                    }
                });
            })
            //Remove Employee details by id
            .delete(function (req, res) {
                checkTokenValidation(req, function (status, user) {
                    if (status == 200) {
                        Employee.remove({
                            _id: req.params.employee_id
                        }, function (err, employee) {
                            if (err)
                                res.send(err);
                            res.json({success: true, msg: 'Successfully deleted'});
                        });
                    } else {
                        return res.json({success: false, msg: 'Failed to authenticate token.'});
                    }
                });
            });
};

