'use strict';

var validate = require('./../../config/validate.js');
var dbObj = require('./../../db.js');
var UserModal = dbObj.UserModal();


module.exports = {
    getAdminUsersList: getAdminUsersList,
    getAdminUserView: getAdminUserView,
    changeUserStatus: changeUserStatus
};

/**
 * [getAdminUsersList - Function is use to get all users list]
 * @param  {object}  
 * @param  {object} 
 * @return {object} 
 */
function getAdminUsersList(req, res) {
    console.log("1<<----------------<<")
    var limit = req.body.limit;
    var offset = req.body.page;
    var filterExpression = '#isDeleted = :isDeleted AND #isActive = :isActive';
    var expressionAttributeValues = {
        ':isDeleted': false,
        ':isActive': true
    };
    var expressionAttributeNames = {
        '#isDeleted': 'isDeleted',
        '#isActive': 'isActive'
    };
    if (req.body.parms.firstName) {
        console.log("2<<----------------<<")
        filterExpression += ' AND begins_with(#firstName,:firstName)';
        expressionAttributeNames['#firstName'] = 'firstName';
        expressionAttributeValues[':firstName'] = req.body.parms.firstName || undefined;
    } if (req.body.parms.lastName) {
        filterExpression += ' OR begins_with(#lastName,:lastName)';
        expressionAttributeNames['#lastName'] = 'lastName';
        expressionAttributeValues[':lastName'] = req.body.parms.lastName || undefined;
    } if (req.body.parms.email) {
        filterExpression += ' OR begins_with(#email,:email)';
        expressionAttributeNames['#email'] = 'email';
        expressionAttributeValues[':email'] = req.body.parms.email || undefined;
    }

    UserModal.scan().filterExpression(filterExpression)
        .expressionAttributeValues(expressionAttributeValues)
        .expressionAttributeNames(expressionAttributeNames).limit(limit)
        .exec(function (err, userData) {
            console.log(err, "3<<--------><><><><><--------<<", userData)
            if (err) {
                res.json({
                    "code": 402,
                    "data": null,
                    "message": "No record found!"
                });
            } else {
                var model = UserModal.scan().filterExpression(filterExpression)
                    .expressionAttributeValues(expressionAttributeValues)
                    .expressionAttributeNames(expressionAttributeNames);
                var data = JSON.parse(JSON.stringify(userData));
                var allUserArr = [];
                if (validate.isValid(data) && validate.isValid(data.Items) && data.Items.length > 0) {
                    data.Items.forEach(function (eachUser) {
                        allUserArr.push(eachUser);
                    });
                    if (validate.isValid(data.LastEvaluatedKey) && validate.isValid(data.LastEvaluatedKey.id)) {
                        getPaginatedData(model, limit, offset, data.LastEvaluatedKey, allUserArr, function (err, response, dataLen) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    "code": 401,
                                    "data": err,
                                    "message": "Not Found!"
                                });
                            } else {
                                res.json({
                                    "code": 200,
                                    "data": response,
                                    "message": "Users fetched successfully!"
                                });
                            }
                        });
                    } else {
                        res.json({
                            "code": 200,
                            "data": allUserArr,
                            "message": "Users fetched successfully!"
                        });
                    }
                } else {
                    res.json({
                        "code": 200,
                        "data": null,
                        "message": "No record found!"
                    });
                }
            }
        })
}


function getPaginatedData(model, limit, offset, LastEvaluatedKey, allUserArr, callback) {
    if (validate.isValid(model)) {
        if (validate.isValid(limit) && validate.isValid(offset)) {
            var iterateCount = 2;
            userBasedOnlimitAndOffset(model, limit, offset, LastEvaluatedKey, iterateCount, allUserArr, function (err, response) {
                if (err) {
                    callback(err, false);
                } else {
                    var startIndex = limit * (offset - 1);
                    var endIndex = (limit * offset) - 1;
                    var dataArray = [];
                    for (var i = startIndex; i <= endIndex; i++) {
                        if (validate.isValid(response[i])) {
                            dataArray.push(response[i]);
                        }
                    }
                    callback(null, dataArray, response.length);
                }
            });
        }
    }
}

function userBasedOnlimitAndOffset(model, limit, offset, lastEvaluatedKey, iterateCount, allUserArr, callback) {
    if (validate.isValid(model) && validate.isValid(lastEvaluatedKey) && validate.isValid(lastEvaluatedKey.id)) {
        model.startKey(lastEvaluatedKey);
        model.exec(function (err, allUsers) {
            if (err) {
                console.log(err);
                callback("Unable to fetch users!!", false);
            } else {
                var allUsers = JSON.parse(JSON.stringify(allUsers));
                if (validate.isValid(allUsers.LastEvaluatedKey) && validate.isValid(allUsers.LastEvaluatedKey.id) && allUsers.Items.length == 0) {
                    userBasedOnlimitAndOffset(model, limit, offset, allUsers.LastEvaluatedKey, iterateCount, allUserArr, callback);
                } else if (validate.isValid(allUsers.LastEvaluatedKey) && validate.isValid(allUsers.LastEvaluatedKey.id) && allUsers.Items.length !== 0) {
                    userBasedOnlimitAndOffset(model, limit, offset, allUsers.LastEvaluatedKey, iterateCount, allUserArr, callback);
                    allUsers.Items.forEach(function (eachUser) {
                        allUserArr.push(eachUser);
                    });
                } else {
                    allUsers.Items.forEach(function (eachUser) {
                        allUserArr.push(eachUser);
                    });
                    callback(null, allUserArr);
                }
            }
        });
    } else {
        callback("Missing data!!", false);
    }
}
/**
 * [getAdminUserView - get User information using id]
 * @param  {object}  
 * @param  {object} 
 * @return {object} 
 */
function getAdminUserView(req, res) {
    if (validate.isValid(req.swagger.params.userId) && validate.isValid(req.swagger.params.userId.value)) {
        UserModal.query(req.swagger.params.userId.value).exec(function (err, data) {
            if (err) {
                res.json({
                    'code': 401,
                    "data": null,
                    'message': "Invalid User ID."
                });
            } else {
                if (validate.isValid(data) && data.length !== 0) {
                    res.json({
                        "code": 200,
                        "message": "User fetched successfully",
                        "data": JSON.parse(JSON.stringify(data.Items[0]))
                    });
                } else {
                    res.json({
                        "code": 401,
                        "data": null,
                        "message": "User not found."
                    });
                }
            }
        });
    } else {
        res.json({
            "code": 401,
            "data": null,
            "message": " User ID is missing."
        });
    }
}

/**
 * [changeUserStatus - change User status using id]
 * @param  {object}  
 * @param  {object} 
 * @return {object} 
 */
function changeUserStatus(req, res) {
    if (validate.isValid(req.body.id)) {
        UserModal.update(req.body, function (err, response) {
            if (err) {
                res.json({
                    "code": 401,
                    "data": null,
                    "message": "Something went wrong! Please try again."
                });
            } else if (response) {
                res.json({
                    'code': 200,
                    'data': JSON.parse(JSON.stringify(response)),
                    'message': 'User updated successfully!'
                });
            }
        })
    } else {
        res.json({
            "code": 401,
            "data": null,
            "message": " User ID is missing."
        });
    }
}