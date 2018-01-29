var express=require("express");
var app=express();
var dofile=require("./control/control");
app.use(express.static("./views"));
app.use(express.static("./public"));
app.use(express.static("./upload"));
app.use(express.static("./head"));
app.set("views engine","ejs");
var session=require("express-session");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: {secure: true }
}))
app.get("/",dofile.getUpload);
app.post("/tijiao",dofile.insertDb);
app.get("/register",dofile.showRegister);
app.post("/doregister",dofile.doRegister);
app.get("/login",dofile.showLogin);
app.post("/dologin",dofile.doLogin);

app.get("/du",dofile.findDb);
app.get("/del",dofile.deleteDb);
app.get("/up",dofile.doup);
app.post("/up",dofile.dopost);
app.post("/success",dofile.success);
app.get("/unlogin",dofile.unlogin);
app.get("/change",dofile.dochange);
app.post("/uphead",dofile.douphead);
app.get("/cut",dofile.showcut);
app.get("/docut",dofile.docut);
app.get("/newfile",dofile.shownewfile)
app.get("/donewfile",dofile.donewfile);
app.get("/:photo",dofile.getPhoto);
app.use(function(req,res,next) {
    res.render("404.ejs");
});
app.get("/favicon.ico",dofile.dofavicon);
app.listen(3000,"127.0.0.1");
