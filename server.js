'use strict';

/* server dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

/* DB */
const mongoose = require('mongoose');
/* DB conf */
const config = require('./config/config');

/* JWT */
const jwt = require('jsonwebtoken');

/* UTILS */
const sha256 = require('sha256');


// /* CONTROLLER */
const UserCtrl = require('./controllers/User.controller');
const MaterCtrl = require('./controllers/Mater.controller');
const GradeCtrl = require('./controllers/Grade.controller');

/* server instanciate and config router */
const api = express();
api.use(cookieParser()); // cookie manager

//db connection
api.set('superSecret', config.secret); // secret variable  //variable environnement app.get('superSecret');
mongoose.connect(config.database,  { useMongoClient: true }); // connect to database

//get params / body on route /api/*
api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());

// DEBUG for console
api.use(morgan('dev'));


//config header
api .use(function (req,res,next) {
    //on intranet (client) else *
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


// ROUTE

//test
api.get('/',function(req,res){
    res.send("Bonjour");
});

/* REGISTRATION */
api.post('/user/add', function(req,res){
    UserCtrl.addUser(req,res);
});

//todo : => client setCookie token received from message api !!!! et le send pour chaque requete evidement

api.get('/user/logout', function(req,res){
    UserCtrl.logoutUser(req,res);
});

api.post('/user/login', function(req,res){
    UserCtrl.loginUser(req,res);
});

/* API -> need to be connected or logged before and get his token into cookie to used these routes */

/* USER */
api.get('/user/list', function(req,res){
    UserCtrl.listUser(req,res);
});

api.post('/user/promote', function(req,res){
    UserCtrl.promoteUser(req,res);
});

api.post('/user/profile', function(req,res){
    UserCtrl.decodeMyToken(req,res);
});


/* MATER */
api.post('/mater/add', function(req,res){
    MaterCtrl.addMater(req,res);
});

api.post('/mater/addUser', function(req,res){
    MaterCtrl.addUserForMater(req,res);
});

api.post('/mater/deleteUser', function(req,res){
    MaterCtrl.deleteUserForMater(req,res);
});

api.post('/mater/delete', function(req,res){
    MaterCtrl.deleteMater(req,res);
});

api.get('/mater/list', function(req,res){
    MaterCtrl.listMater(req,res);
});



/* NOTE */
api.post('/grade/add', function(req,res){
    GradeCtrl.addGrade(req,res);
});

api.get('/grade/list', function(req,res){
    GradeCtrl.listGrade(req,res);
});

api.post('/grade/delete', function(req,res){
    GradeCtrl.deleteGrade(req,res);
});











//OSEF juste pour tester les posts (car le token est mal gérer par postman)
// TEST form (for post query because dosnt work with postman)
api.get('/mater/add/test',function(req,res){
    res.sendfile('form_for_test/test_add_matter.html');
});

api.get('/mater/addUser/test',function(req,res){
    res.sendfile('form_for_test/test_add_user_for_matter.html');
});

api.get('/user/add/test',function(req,res){
    res.sendfile('form_for_test/test_add_user.html');
});

api.get('/user/promote/test',function(req,res){
    res.sendfile('form_for_test/test_promote_user.html');
});



//run
let port = process.env.PORT || 1337; // used to create, sign, and verify tokens
api.listen(port);
console.log('API intranet run at http://localhost:' + port);

