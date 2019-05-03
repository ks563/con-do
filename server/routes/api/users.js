//this file contains all api routes for users
//it uses the userController to relate to our database
require('dotenv').config()
const db = require("../../db/models");
const router = require("express").Router();
const passport = require("../../db/config/passport/");
const isAuthenticated = require("../../db/config/middleware/isAuthenticated");
const JWT = require("jsonwebtoken");
const Mailer = require("../../db/config/mailer")
const generator = require("generate-password")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("environ ", process.env.SENDGRID_API_KEY)
// /api/users aka getting the logged in user by checking the req.user Obj
router.route("/")
    .get(function(req, res){
        db.User
        .findOne({
            where: {
                id: req.user.id
            }
        })
        .then((userData)=> {
            //the user's permissions will be determined by their user type
            //their permissions will be added to the req.user object created by the passport session so 
            //that we can always verfiy on the backend if the user has permisssion to perform the inovked action
            //it is also referenced by the userData object that is being passed to react so permissions are available
            //on the front end as well
            switch (userData.userType){
                case "admin": 
                    req.user.permissions = {
                                C: ["admin create"],
                                R: ["admin read"],
                                U: ["admin update"],
                                D: ["admin delete"]
                    }
                break;
                case "delegate":
                    req.user.permissions = {
                            C: ["delegate create"],
                            R: ["delagate read"],
                            U: ["delagate update"],
                            D: ["delagate delete"]
                    }
                break;
            }
            //
            userData.dataValues.permissions = req.user.permissions;
            console.log(userData)
            res.send(userData)
        })
        .catch(err=> console.log(err.name + " " + err.message));
        
    })
    
// /api/users/signup    
router.route("/signup")
    .post(function(req, res){
        let password = generator.generate({
            length: 12,
            numebers: true
        });
        req.body.password = password;
        db.User
        .create(req.body)
        .then(userObj => {
            console.log(userObj.dataValues.email)
            let userInfo = {
                    email: req.body.email,
                    password: req.body.password
            }
            let token = JWT.sign({data: userInfo}, "chocolate-chip-cookies", { expiresIn: '176h' })
            userObj.userTok = token
            let message ={ 
                from: "noreply@condo.com",
                to: userObj.dataValues.email,
                subject: "Welcome!",
                text: token,
                html: token
            }
            sgMail.send(message);
            res.send(userObj.dataValues)
        })
        .catch(err=> console.log(err));
    })

// /api/users/login
router.route("/login")
    .post(passport.authenticate("local"),function(req, res){
        let userInfo = req.user
        res.send(userInfo);
    })
router.route("/login/:token")
    .get(function(req, res){
        var decoded = JWT.verify(req.params.token, 'chocolate-chip-cookies');
        console.log("decoded obj", decoded);
        // req.user.id= decoded.data.id
        res.send(decoded.data)
    })

module.exports = router;