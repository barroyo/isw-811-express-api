const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1:27017/auth-api');
const { User, UserAllowedAttributes }  = require('./models/userModel');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Gets this server host URL
 * 
 * @param {*} req 
 */
function getHostUrl(req){
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

/**
 * Strong params function for User payloads
 * 
 * @param {*} body the body of the request
 */
function userParams(body){
    // strong parameters
    var user = {};
    
    Object.keys(body).forEach((key) => {
        if(UserAllowedAttributes.indexOf(key) > -1){
            user[key] = body[key];
        }
    });
    return user;
}

/**
 * Handle all errors
 * 
 * @param {} res the response object to finalize
 * @param {string} errorMsg the error message to return
 * @param {Number} erroCode the error code to return
 */
function handleError(res, errorMsg, erroCode = 422) {
    res.status(erroCode);
    res.json({error: errorMsg});
}


// users endpoints

// list of users
app.get('/api/users', (req, res) => {
    User.find(function(err, users){
        if(err) {
            handleError(res, err, 500);
        }
        res.json(users);
    });
});

// create users
app.post('/api/users', (req, res) => {
    var user = userParams(req.body);
    user = new User(user);
    
    user.save(function(err){
        if(err) {
            handleError(res, err, 422);
        }
        res.status(201);
        res.setHeader('location',`${getHostUrl(req)}?id=${user._id}`);
        res.json(user);
    });
});

app.patch('/api/users', (req, res) => {
    var user = {};
    const userId = req.query.id;

    // check if user exists and if ID is valid
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        handleError(res, 'User not found', 404);
    }

    user = userParams(req.body, user);

    // execute the update
    User.findByIdAndUpdate(userId, user, {new: true}, (err, updatedUser) => {
        if(err) {
            handleError(res, err, 500);
        }
        res.status(200);
        res.json(updatedUser);
    });
});

// handle 404
app.use(function(req, res, next){
    handleError(res, 'Not found', 404);
    return;
});


app.listen(PORT, () => console.log('Auth API is listening on port 3000!'));