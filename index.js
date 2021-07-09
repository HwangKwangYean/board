var express = require("express");
var app = express();
require('dotenv').config();

var path = require("path");
var session = require("express-session");

app.set("views", path.join(__dirname + "/views"));
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

app.use(
    session({
        secret : process.env.session_secret,
        resave : false,
        saveUninitialized : true,
        maxAge : 3600000,   //3600000ms
    })
)

var login = require('./routes/login');
app.use('/',login);

var main = require('./routes/main');
app.use('/board',main);

// app.get("/test", function(req,res){
//     res.render("test");
// })

var server = app.listen(5000,function(){
    console.log("Kwang Yean'server port 5000 Let's get it!!");
})