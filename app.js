const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1:27017/auth-api');
const User = require('./models/userModel');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function userParams(body){
    // strong parameters
    var allowedAttributes = ['lastName', 'username', 'password', 'firstName'];
    Object.keys(body).forEach((key) => {
        if(allowedAttributes.indexOf(key) > -1){
            user[key] = body[key];
        }
    });
}
// users endpoints

// list of users
app.get('/api/users', (req, res) => {
    User.find(function(err, users){
        if(err) {
            res.send(err);
        }
        res.json(users);
    });
});

app.post('/api/users', (req, res) => {
    var user = new User();
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err){
        if(err) {
            res.status(422);
            res.json({error: err});
        }
        res.status(201);
        res.json(user);
    });
});

app.patch('/api/users', (req, res) => {
    var user = {};
    var userId = req.query.id;

    // check if user exists and if ID is valid
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404);
        res.json({error: 'User not found'});
    }

    
    // execute the update
    User.findByIdAndUpdate(userId, user, {new: true}, (err, updatedUser) => {
        if(err) {
            res.status(422);
            res.json({error: err});
        }
        res.status(200);
        res.json(updatedUser);
    });
});

// handle 404
app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});


app.listen(3000, () => console.log('Auth API is listening on port 3000!'));