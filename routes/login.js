var express = require("express");
var router = express.Router();
var moment = require("moment");
var mysql = require("mysql2");
require('dotenv').config();
var Crypto = require("crypto");
var secretKey = process.env.secretKey;
var connection = mysql.createConnection({
    // host : "localhost", //127.0.0.1
    // port : 3306,
    // user : "root",
    // password : "1234",
    // database : "test"
    host : process.env.host, //127.0.0.1
    port : process.env.port,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database
});

router.get("/", function(req,res,next){
    res.render("login");
})

router.post("/login", function(req,res,next){
    var post_id = req.body.post_id;
    var password = req.body.password;
    console.log(post_id,password);
    connection.query(
        `select * from user_list where post_id = ? and password = ?`,
        [post_id, password],
        function(err,result){
            if(err){
                console.log(err);
                // res.send("SQL login connection Error");
                res.render("error")
            }else{
                if(result.length > 0){
                    req.session.logged = result[0];
                    console.log(req.session)
                    res.redirect("/board");
                }else{
                    res.render("error", {message:"아이디 혹은 패스워드가 다릅니다."});
                }
            }
        }
    )
})

router.get("/signup", function(req,res,next){
        res.render("Sign_Up");
    
});

router.post("/signup_2", function(req,res,next){
    var post_id = req.body.post_id;
    var password = req.body.password;
    var name = req.body.name;
    var division = req.body.division;
    var linkcode = req.body.linkcode;
    var crypto = Crypto.createHmac("sha256", secretKey).update(password).digest('hex');
    console.log(crypto);
    console.log(post_id, password, name, division, linkcode);
    connection.query(
        `select * from user_list where post_id = ?`,
        [post_id],
        function(err,result){
            if(err){
                console.log(err);
                res.send("SQL connect error");
            }else{
                if(result.length > 0){
                    res.send("이미 존재하는 아이디");
                }else{
                    connection.query(
                        `insert into user_list (post_id, password, name, division, linkcode) value(?, ?, ?, ?, ?)`,
                        [post_id, password, name, division, linkcode], function(err2, result2){
                            if(err2){
                                console.log(err2);
                                res.send("SQL insert Error");
                            }else{
                                res.redirect("/");
                            }
                        }
                    )
                }
            }
        }
    )
})

router.get("/logout", function(req,res,next){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Session destroy error");
        }else{
            res.redirect("/")
        }        
    })
})

module.exports = router;