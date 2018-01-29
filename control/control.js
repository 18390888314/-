var db=require("../model/db");
var files=require("../model/files");
var formidable=require("formidable");
var util=require("util");
var path=require("path");
var fs=require("fs");
var session=require("express-session");
var ObjectId = require('mongodb').ObjectID;
var md5=require("../model/md5");
var cut=require("../model/cut");
var gm=require("gm");
var num=0;
exports.getUpload=function (req,res,next) {
    num += 1;
    /*db.deleteDB("number", {}, (err, result) => {
            if (err) {
                console.log("删除失败！");
            }
            db.insertDB("number", {"total": num}, (err, result) => {
                if (err) {
                    console.log("插入失败！");
                    return;
                }
                db.findDB("number", {}, (err, result) => {
                    console.log("网站访问总次数为：" + result[0].total + "次");
                })
            })

        }
    )*/

    db.getallcount("message", (result) => {
        var count = Math.ceil(result / 6);
        files.uploadFileName(function (err, files) {
            if (req.session.login) {
                db.findDB("login", {"username": req.session.username}, (err, result) => {
                    if (err) {
                        console.log("查询错误!");
                        return;
                    }
                    res.render("index.ejs", {
                        files,
                        count,
                        "user": req.session.login,
                        "username": req.session.username,

                       "headImage": result[0].headimg||"moren.jpeg",

                    });

                })
            } else {
                res.render("index.ejs", {
                    files,
                    count,
                    "user": req.session.login,
                    "username": req.session.username,
                    "headImage": "moren.jpeg",
                });
            }

        })

    })
}
//}
exports.insertDb=function(req,res,next) {
    if(req.session.login=="1") {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields) {
            if (err||fields.xingming==""|| fields.liuyan == "" || fields.liuyan.length > 50) {
                res.send({"result": -1});
                return;
            }
            db.insertDB("message", fields, (err, result) => {
                if (err) {
                    console.log("插入数据失败");
                    return;
                    next();
                }
                res.send({"result": 1});
            })
        });
    }
    else {
        res.send({"result":-2});
    }
}
exports.findDb=function(req,res,next) {
    var page=parseInt(req.query.page);
    db.findDB("message",{},{"sort":{"shijian":-1},"skipnumber":6,"page":page},(err,result)=>{

            if(err){
                console.log("查找数据失败");
                next();
            }
            res.json({"result":result});




    })
}
exports.deleteDb=function(req,res,next) {
    if(req.session.login=="1") {
        var id = req.query.page;
        db.deleteDB("message", {"_id": ObjectId(id)}, (err, result) => {
            res.send({"result":1});
        })
    }else {
     res.send({"result":-1});
    }
}
exports.getPhoto=function(req,res,next) {
    var pathname=req.params.photo;
    files.readPhoto(pathname,(err,newImg)=>{
 if(err){
     next();
            return;

        }
        res.render("photo.ejs",{
          "newImg":newImg,
            "pathname":pathname
        });
})

}
exports.dofavicon=function(req,res,next) {
return;
next();
}
exports.doup=function(req,res,next) {
    if (req.session.login=="1") {
    files.uploadFileName((err, files) => {
        res.render("up.ejs", {
            "newDir": files
        });
    })
}else{
        res.redirect("/unlogin");
    }
}

exports.dopost=function(req,res,next) {
    var form = new formidable.IncomingForm();
    form.uploadDir="./upload/";
    form.parse(req, function(err, fields,files) {
       if(path.extname(files.tupian.name)!=".bmp"&&path.extname(files.tupian.name)!=".png"&&path.extname(files.tupian.name)!=".gif"&&path.extname(files.tupian.name)!=".jpg"&&path.extname(files.tupian.name)!=".jpeg"){
           console.log("1111");
        res.send("图片文件过大或者格式错误");
        fs.unlink(files.tupian.path);
        return;
        }
       else if(files.tupian.size!==0){
            res.render("success.ejs");
        }
        var oldpath=files.tupian.path;
        var extname=path.extname(files.tupian.name);
        var random=Math.ceil(Math.random()*100000);
        var newpath="./upload/"+fields.wenjianjia+"/"+random+extname;

        fs.rename(oldpath,newpath,(err)=>{
if(err){
    console.log("改名失败！");
}
        })
    });
}
exports.success=function(req,res,next) {

}




/*exports.showIndex=function showIndex(req,res,next) {
    res.render("index.ejs",{
        "user":req.session.login,
        "username":req.session.username,
    });
}*/
exports.showRegister=function showRegister(req,res,next) {
    res.render("register.ejs");
}
exports.doRegister=function doRegister(req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields.password);
        if(!(fields)){
            res.send("-1");
            return;
        }
        if(fields.password.length<6){
            res.send("-1");
            return;
        }
        db.findDB("login",{
            "username":fields.username,
        },function(err,result) {
            if(err){
                console.log("数据库错误");
                res.send("-2");
                return;
            }
            if(result.length>0){
                res.send("-1");
                return;
            }
            if(result.length==0){
                var password=md5(fields.password);
                db.insertDB("login",{
                    "username":fields.username,
                    "password":password,
                    "headimg":"moren.jpeg",
                },function(err,result) {
                    if(err){
                        console.log("注册失败");
                        res.send("-1");
                        return;
                    }
                    res.send("1");

                })

            }
        })
    })
}
exports.showLogin=function showLogin(req,res,next) {
    res.render("login.ejs");
}

exports.doLogin=function doLogin(req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var password=md5(fields.password);
        db.findDB("login",{
            "username":fields.username,
            "password":password,
        },function(err,result) {
            if(err){
                console.log("数据库错误");
                res.send("-2");
                return;
            }
            if(result.length>0){
                req.session.login="1";
                req.session.username=fields.username;

                res.send("1");
                return;
            }
            if(result.length==0){
                res.send("-1");

            }
        })
    })
}
exports.unlogin=function unlogin(req,res,next) {
    res.render("unlogin.ejs");
}
exports.shownewfile=function shownewfile(req,res,next) {
    if(req.session.login=="1"){
        res.render("createfile.ejs");
    }else {
        res.render("unlogin.ejs");
    }

}
exports.donewfile=function donewfile(req,res,next) {
    var newfilename = req.query.filename;
    var newfilepath = "./upload/" + newfilename;
    files.createfile(newfilepath, (err) => {
        if (err) {
            console.log("创建失败");
            return;
        }
        console.log("创建成功");
        res.send({"result": 1});
    })
}











exports.dochange=function dochange(req,res,next) {
    res.render("uphead.ejs",{
        "user":req.session.login,
        "username":req.session.username,
    });
}
exports.douphead=function doup(req,res,next) {
    var form = new formidable.IncomingForm();
    form.uploadDir="./head/";
    form.parse(req, function(err,field,files) {
        //console.log(files);
        req.session.path=files.tupian.path;
        //var oldpath=files.tupian.path;
        //var newpath="head/"+req.session.username+".jpg";
        /*fs.rename(oldpath,newpath,(err)=>{
            if(err){
                console.log("改名失败");
            }
        })*/
        res.redirect("/cut");
    });
}
exports.showcut=function showcut(req,res,next) {
    var oldpath=req.session.path;
    var newpath="head/"+req.session.username+".jpg";
    fs.rename(oldpath,newpath,(err)=>{
        if(err){
            console.log("改名失败");
        }
        gm(newpath).resize(600,400).write(newpath,function (err) {
            if (!err) {
                console.log('done');
                //callback();
                res.render("cut.ejs",{
                    "image":path.basename(newpath),
                });
            }

        });


    })

}
exports.docut=function docut(req,res,next) {
    var width=req.query.width;
    var height=req.query.height;
    var left=req.query.left;
    var top=req.query.top;
console.log(width+"  "+height);
    cut(req.session.username+".jpg",width,height,left,top,()=>{
        db.updataDB("login",{"username":req.session.username},{$set:{"headimg":req.session.username+".jpg"}},(err,result)=>{
            if(err){
                console.log(err);
                return;
            }
            //console.log(result);
            res.send({"result":1});
        })});
}
