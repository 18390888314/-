//var express=require("express");
var mongoclient=require("mongodb").MongoClient;
//var app=express();
var setting=require("./setting");
 function connectDB(callback) {    //连接数据库
     var url=setting.dburl;
     mongoclient.connect(url,(err,db)=>{
         if(err){
             console.log("数据库连接失败");
             return;
         }
        callback(err,db);
     });
 }
 exports.insertDB=function insertDB(collection,json,callback) {  //插入数据
     connectDB(function(err,db) {
         db.collection(collection).insertOne(json,(err,result)=>{
             callback(err,result);
             db.close();
         })
     })
 }
 exports.findDB=function findDB(collection,json,C,D) {    //查询数据
     var result=[];
     if(arguments.length==3){    //参数为三个时   callback为C
       var callback=C;
       var skipnum=0;
       var limit=0;
       var page=0;
     }else if(arguments.length==4){   //参数为四个时，callback为D
        var callback=D;
         var arg=C;
         var sort=arg.sort;
         var skipnum=arg.skipnumber*arg.page||0;  //略过条数
         var limit=arg.skipnumber||0;  //每页显示条数
     }else {
         throw new Error("参数错误！");
         return;
     }
     json=json||{};
     connectDB(function(err,db) {
     var curor=db.collection(collection).find(json).limit(limit).skip(skipnum).sort(sort);
curor.each((err,doc)=>{
    if(err){
        callback(err,null);
        db.close();
        return;
    }
    if(doc!=null){
        result.push(doc);
    }else{
        callback(null,result);
        db.close();
    }

})
     });
 }
 exports.deleteDB=function deleteDB(collection,json,callback) {   //删除数据
   connectDB((err,db)=>{
       if(err){
           console.log("数据库连接失败");
           return;
       }
       db.collection(collection).deleteMany(json,(err,result)=>{
           callback(err,result);
           db.close();
       })
   })
 }
 exports.updataDB=function updataDB(collection,json1,json2,callback) {    //修改数据
     connectDB((err,db)=>{
         if(err){
             console.log("数据库连接失败");
             return;
         }
         db.collection(collection).updateMany(json1,json2,(err,result)=>{
             callback(err,result);
             db.close();
         })

     })


 }
 exports.getallcount=function getallcount(collection,callback) {

    connectDB((err,db)=>{
        if(err){
            console.log("数据库连接失败");
            return;
        }
        db.collection(collection).count({}).then(function(result) {
            callback(result);
        });
    })
}