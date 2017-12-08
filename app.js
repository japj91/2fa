#!/usr/bin/node
var passHash = require("./passHash")
var express = require('express');
var http = require('http');
var bodyparser = require('body-parser');

var fs = require('fs');
var jsonfile = require('jsonfile');
var path = require("path");
var speakeasy = require("speakeasy");
var bhash = require("bcrypt");

var userfile = "users.txt";

var app = express();

http.createServer(app).listen("8080", function () {

});

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.set('views', './views');
app.set('view engine', 'pug');


var html = path.resolve(__dirname, "html");

app.get('/', function (req, res) {
    res.sendFile(html + "/index.html");
});


var jap;
app.post("/sec", function (req, resp) {
    var secret = speakeasy.generateSecret();
    var popo = secret.base32;

// npm install --save qrcode
    var QRCode = require('qrcode');

// Get the data URL of the authenticator URL
    QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
        console.log(secret.otpauth_url);
        jap = secret.base32;
        resp.send(data_url);
    });

});
app.get("/check", function (req, resp) {
    resp.sendFile(html + "/verification.html");
});

app.post('/login-check', function (req, res) {
    jsonfile.readFile(userfile, function (er, data) {

        if (data.userName == req.body.name) {

            var jao = bhash.compareSync(req.body.password, data.passWord, function (err, res) {
                if (err) {
                    console.log(err);
                }


                return res;

            })

            if (jao== true) {
                console.log(data.twofactor);
                console.log(req.body.token);
                var verififed = speakeasy.totp.verify({
                    secret: data.twofactor,
                    encoding: "base32",
                    token: req.body.token
                });
                if (verififed) {
                    res.send("sucessfully loged in ")
                }
                else{
                    res.send("unable to verify user- please try again");
                }
            };
        }
        else {
            res.send("Login failed because of wrong password or non-existing account.")
        }

    });
});


app.get('/add-users', function (req, res) {
    res.sendFile(html + "/index.html");
});

/** Reads userfile "database". Renders template from views/users.pug by passing the users object */
app.get('/users', function (req, res) {
    jsonfile.readFile(userfile, function (err, obj) {
        if (err) throw err;
        console.log(obj);
        res.render('users', {users: obj});
    });
});

/** Reads userfile "database". Appends JSON object with POST data to the old userfile object. Writes new object to the userfile. */

app.post('/adduser', function (req, resp) {
// storing users in file

    var verififed = speakeasy.totp.verify({
        secret: jap,
        encoding: "base32",
        token: req.body.token
    });
    console.log(verififed);

    if (verififed == true) {

        passHash.hash(req.body.name, req.body.password, jap)
            .then((obj) => {
                jsonfile.writeFile(userfile, obj, (err) => {
                    resp.send('successfully registered new user...<br> <a href="/check">Try logging in!</a>')
                })
            })
            .catch((err) => {
                resp.send(err);
            })
    }
    else {
        resp.send(verififed);
    }
});
