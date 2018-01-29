var fs=require("fs");
exports.uploadFileName=function uploadFileName(callback) {
    fs.readdir("./upload",(err,files)=>{
    if(err){
        console.log("没找到文件！");
        callback(err,null);
        return;
    }
    callback(null,files);
    })
}

exports.readPhoto=function readPhoto(pathname,callback) {

fs.readdir("./upload/"+pathname,(err,files)=>{
if(err){
    callback(err,null);
    return;
    }
    var newImg=[];
    (function iterator(i) {

        if(i==files.length){
            callback(null,newImg);
            return;
        }
        fs.stat("./upload/"+pathname+"/"+files[i],(err,stats)=>{
            if(err){
                callback("没有找到照片！",null);
                return;
            }
            if(stats.isFile()){
                newImg.push(files[i]);
            }
            iterator(i+1);
        })
    })(0);
})
}
exports.createfile=function(path,callback) {
    fs.mkdir(path,(err)=>{
        callback(err);
    })
}
