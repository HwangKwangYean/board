var express = require('express');
var router = express.Router();
var mysql = require("mysql2");
var moment = require("moment");
const { query } = require('express');

var connection = mysql.createConnection({
    host : "localhost", //127.0.0.1
    port : 3306,
    user : "root",
    password : "1234",
    database : "test"
});


router.get('/',function(req,res,next){  
    console.log("/board start")     
    connection.query(
        `select * from board`,
        function(err,result){
            if(err){
                console.log(err);
                res.send("select Error")
            }else{
                console.log(result)
                res.render('index',{
                    content : result
                })
            }
        }
    )      
})

router.get("/add", function(req,res,next){
    res.render('add');
})

router.post("/add_2", function(req,res,next){
    var title = req.body.title;
    var content = req.body.content;
    var img = req.body.img;
    var date = moment().format("YYYYMMDD");
    var time = moment().format("HHmmss");
    var author = req.body.author;
    console.log(title,content);
    if(!req.session.logged){
        res.redirect('/');
    }else{
        var author = req.session.logged.name;
        var post_id = req.session.logged.post_id;
        connection.query(
            `insert into board(title, content, img, date, time, author, post_id) values(?,?,?,?,?,?,?)`,
            [title, content, img, date, time, author, post_id],
            function(err,result){
                if(err){
                    console.log(err);
                    res.send("add insert Error");
                }else{
                    res.redirect("/board");
                }
            }
        )
    }
})



router.get('/',function(req,res,next){
    res.render('Main_Page.ejs');
})

router.get('/info',function(req,res,next){
    if(!req.session.logged){
        res.redirect("/board");
    }else{
        var no = req.query.no;
        console.log(no);
        connection.query(
            `select * from board where No = ?`,
            [no],
            function(err,result){
                if(err){
                    console.log(err)
                    res.send("Info select Error");
                }else{
                    connection.query(
                        `select * from comment where parent_num = ?`,
                        [no],
                        function(err2,result2){
                            if(err2){
                                console.log(err2);
                                res.render("error",{
                                    message : "게시글의 댓글 출력 에러"
                                })
                            }else{
                                res.render("info",{
                                    content : result,
                                    opinion : result2,
                                    post_id : req.session.logged.post_id,
                                    name : req.session.logged.name,
        
                                })
                            }
                        }
                    )
                }
            }
        )
    }
})

router.post('/add_comment',function(req,res,next){
    if(!req.session.logged){
        res.redirect("/board/info?no="+no);
    }else{
        var no = req.body.no;
        var comment = req.body.comment;
        var post_id = req.session.logged.post_id;
        var name = req.session.logged.name;
        var date = moment().format("YYYYMMDD");
        var time = moment().format("HHmmss");
        console.log(no,comment,post_id,name,date,time);
        connection.query(
            `insert into comment(parent_num,opinion,post_id,name,date,time) values(?,?,?,?,?,?)`,
            [no,comment,post_id,name,date,time],
            function(err,result){
                if(err){
                    console.log(err);
                    res.render("error",{
                        message : "댓글 추가 실패"
                    })
                }else{
                    res.redirect("/board/info?no="+no);
                }
            }
        ) 
    }
      
})

router.get("/comment_del/:no/:parent_num",function(req,res,next){
    var no = req.params.no;
    var parent_num = req.params.parent_num;
    connection.query(
        `delete from comment where No = ?`,
        [no],
        function(err,result){
            if(err){
                console.log(err);
                res.render("error",{
                    message : "댓글 삭제 에러"
                })
            }else{
                res.redirect("/board/info?no="+parent_num);
            }
        }
    )
})

router.get("/comment_up",function(req,res,next){
    var no = req.query.no;
    var parent_num = req.query.parent_num;
    var up = parseInt(req.query.up);
    console.log(no, parent_num, up);
    var up_2 = ++up;
    console.log(up_2);
    connection.query(
        `update comment set up = ? where No = ?`,
        [up_2,no],
        function(err,result){
            if(err){
                console.log(err);
                res.render("error",{
                    message : "좋아요 추가 에러"
                })
            }else{
                res.redirect("/board/info?no="+parent_num);
            }
        }
    )
})

router.get("/comment_down", function(req,res,next){
    var no = req.query.no;
    var parent_num = req.query.parent_num;
    var down = parseInt(req.query.down);
    console.log(no, parent_num, down);
    var down_2 = ++down;
    console.log(down_2);
    connection.query(
        `update comment set down = ? where No = ?`,
        [down_2,no],
        function(err,result){
            if(err){
                console.log(err);
                res.render("error",{
                    message : "싫어요 추가 에러"
                })
            }else{
                res.redirect("/board/info?no="+parent_num);
            }
        }
    )
})

router.get("/del", function(req,res,next){
    var no = req.query.no;
    console.log(no);
    connection.query(
        `delete from board where No = ?`,
        [no],
        function(err,result){
            if(err){
                console.log(err);
                res.send("delete Error");
            }else{
                res.redirect("/board");
            }
        }
    )
})

router.get("/update", function(req,res,next){
    var no = req.query.no;
    console.log(no);
    connection.query(
        `select * from board where No = ?`,
        [no],
        function(err,result){
            if(err){
                console.log(err);
                res.send("update select Error");
            }else{
                res.render('update',{
                    content : result
                })
            }
        }
    )
})

router.get('/FirstPage',function(req,res,next){
    res.render('1st_Page.ejs');
})

router.get('/SecondPage',function(req,res,next){
    res.render('2nd_Page.ejs');
})

router.get('/ThirdPage',function(req,res,next){
    res.render('3rd_Page.ejs')
})

router.get('/FourthPage',function(req,res,next){
    res.render('4th_Page.ejs');
})

router.get('/FifthPage',function(req,res,next){
    res.render('5th_Page.ejs');
})

router.get('/SixthPage',function(req,res,next){
    res.render('6th_Page.ejs')
})

router.get('/SeventhPage',function(req,res,next){
    res.render('7th_Page.ejs')
})

module.exports = router;